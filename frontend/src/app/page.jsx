"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Toaster, toast } from "react-hot-toast";
import { formatTimeInput, parseTimeInput, isAbsoluteUrl } from "@/utils";
import VideoPlayer from "@/components/VideoPlayer";
import { YoutubeIcon } from "@/icons";

export default function YouTubeCutterForm() {
  const [loading, setLoading] = useState(false);
  const [fullDownloadLoading, setFullDownloadLoading] = useState(false); // New state for full download button
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

  const downloadVideo = (downloadUrl, fileName = "video.mp4") => {
    const link = document.createElement("a");
    link.href = isAbsoluteUrl(downloadUrl)
      ? downloadUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${downloadUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const pollProgress = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/progress/${taskId}`
        );
        const data = await response.json();

        if (data.status === "completed") {
          clearInterval(interval);
          setLoading(false);
          setFormData({ url: "", startTime: "", endTime: "" });
          downloadVideo(data.download_url, `${taskId}-trimmed-video.mp4`);
          setProgress(0);
          toast.success("Your video has been cropped!");
        } else {
          setProgress(data.progress || 1);
        }
      } catch (error) {
        toast.error(
          "An error occurred while fetching current progress of video processing."
        );
        console.log(error);
        setLoading(false);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let { url, startTime, endTime } = formData;

    startTime = parseTimeInput(startTime);
    endTime = parseTimeInput(endTime);

    if (!url || !startTime || !endTime) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/trim?url=${encodeURIComponent(
          url
        )}&start=${startTime}&end=${endTime}`
      );

      if (response.ok) {
        const { task_id } = await response.json();
        pollProgress(task_id);
      }
    } catch (error) {
      toast.error(
        "An error occurred while processing your video. Please try again."
      );
      console.log(error);
      setLoading(false);
    }
  };

  const handleFullDownload = async () => {
    const { url } = formData;
    if (!url) {
      toast.error("Please enter a YouTube video URL!");
      return;
    }

    try {
      setFullDownloadLoading(true); // Start loading
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/download?url=${encodeURIComponent(url)}`
      );
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;

        // Extract filename from headers or use a default
        const contentDisposition = response.headers.get("Content-Disposition");

        const filename = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : "video.mp4";
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(downloadUrl);
        a.remove();
      } else {
        toast.error("Failed to download the full video.");
      }
    } catch (error) {
      toast.error("An error occurred while downloading the full video.");
      console.log(error);
    } finally {
      setFullDownloadLoading(false); // Stop loading
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      <Card className="w-full max-w-xl shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center space-x-2">
            <YoutubeIcon />
            <span>Downloader</span>
          </h1>
          <p className="text-center text-sm text-gray-600 mb-6">
            Extract your favorite scenes or download the entire YouTube video.
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
            </div>
            <Button
              type="button"
              onClick={handleFullDownload}
              className="w-full mb-4"
              disabled={fullDownloadLoading || loading}
            >
              {fullDownloadLoading ? "Downloading..." : "Download Full Video"}
            </Button>
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
            {progress || loading ? (
              <div className="mb-4">
                <Progress value={progress} className="w-full h-5" />
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Processing ...
                </p>
              </div>
            ) : (
              <Button type="submit" className="w-full mb-2" disabled={loading}>
                Crop Video
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
