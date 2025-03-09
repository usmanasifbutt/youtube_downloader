"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "react-hot-toast";
import { formatTimeInput, parseTimeInput } from "@/utils";
import VideoPlayer from "@/components/VideoPlayer";
import FormFields from "@/components/FormFields";
import DownloadButton from "@/components/DownloadButton";
import VideoProgress from "@/components/VideoProgress";
import { YoutubeIcon } from "@/icons";
import { fetchProgress, trimVideo, downloadFullVideo } from "@/services";
import { downloadVideo } from "@/utils/downloader";

export default function YouTubeCutterForm() {
  const [loading, setLoading] = useState(false);
  const [fullDownloadLoading, setFullDownloadLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({ url: "", startTime: "", endTime: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name !== "url" ? formatTimeInput(value) : value,
    }));
  };

  const pollProgress = (taskId) => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchProgress(taskId);
        if (data.status === "completed") {
          clearInterval(interval);
          setLoading(false);
          setFormData({ url: "", startTime: "", endTime: "" });
          setProgress(0);
          downloadVideo(data.download_url, `${taskId}-trimmed-video.mp4`);
          toast.success("Your video has been cropped!");
        } else {
          setProgress(data.progress || 1);
        }
      } catch {
        toast.error("Error fetching video processing progress.");
        clearInterval(interval);
        setLoading(false);
      }
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { url, startTime, endTime } = formData;
    if (!url || !startTime || !endTime) return toast.error("All fields are required!");
    setLoading(true);

    try {
      const { task_id } = await trimVideo(url, parseTimeInput(startTime), parseTimeInput(endTime));
      pollProgress(task_id);
    } catch {
      toast.error("Error processing your video.");
      setLoading(false);
    }
  };

  const handleFullDownload = async () => {
    if (!formData.url) return toast.error("Please enter a YouTube video URL!");
    setFullDownloadLoading(true);
    await downloadFullVideo(formData.url);
    setFullDownloadLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gray-100">
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
            <DownloadButton loading={fullDownloadLoading} onClick={handleFullDownload} />
            <FormFields formData={formData} handleChange={handleChange} />
            {progress || loading ? <VideoProgress progress={progress} /> : (
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
