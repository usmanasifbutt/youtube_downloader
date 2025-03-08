"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"
import { Toaster, toast } from "react-hot-toast";
import { formatTimeInput, parseTimeInput } from "@/utils";
import VideoPlayer from "@/components/VideoPlayer";


export default function YouTubeCutterForm() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    url: "",
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name !== "url") {
      value = formatTimeInput(value);
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const downloadVideo = (downloadUrl) => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "trimmed_video.mp4"; // Suggested filename
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pollProgress = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/${taskId}`);
        const data = await response.json();
      
        if (data.status === "completed") {
          clearInterval(interval); // Stop polling
          setLoading(false);
          // Reset the form after submission
          setFormData({
            url: "",
            startTime: "",
            endTime: "",
          });

          downloadVideo(data.download_url);
          setProgress(0);
          toast.success("Your video has been cropped!");
        } else {
          setProgress(data.progress || 1); // Update progress bar
        }
      } catch (error) {
        toast.error("An error occurred while fetching current progress of video processing.");
        console.log(error);
        setLoading(false);
      }
    }, 3000); // Poll every 3 seconds
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { url, startTime, endTime } = formData;

    startTime = parseTimeInput(startTime);
    endTime = parseTimeInput(endTime);

    // Basic validation
    if (!url || !startTime || !endTime) {
      toast.error("All fields are required!");
      return;
    }
    
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trim?url=${encodeURIComponent(url)}&start=${startTime}&end=${endTime}`
      );

      if (response.ok) {
        const { task_id } = await response.json();
        pollProgress(task_id);
      } 
    } catch (error) {
      toast.error("An error occurred while processing your video. Please try again.");
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">YT Cutter</h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Extract your favorite scenes from YouTube videos.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <VideoPlayer url={formData.url} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video URL
              </label>
              <Input
                type="text"
                name="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.url}
                onChange={handleChange}
                className="w-full"
              />
              <p className="text-xs text-gray-500 mt-1">Enter the full YouTube video URL.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <Input
                  type="text"
                  name="startTime"
                  placeholder="00:00:00"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <Input
                  type="text"
                  name="endTime"
                  placeholder="00:00:00"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS</p>
              </div>
            </div>
            {
              progress || loading ? (
                <div className="mb-4">
                  <Progress value={progress} className="w-full h-5"/>
                  <p className="text-xs text-gray-500 mt-1 text-center">Processing ...</p>
                </div>
              ) : (
                <Button type="submit" className="w-full" disabled={loading}>
                  Start
                </Button>
              )
            }
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
