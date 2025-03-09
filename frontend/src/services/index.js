// services/apiService.ts
import { toast } from "react-hot-toast";
import { downloadBlob } from "@/utils/downloader";

export const fetchProgress = async (taskId) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/progress/${taskId}`);
  return response.json();
};

export const trimVideo = async (url, startTime, endTime) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/trim?url=${encodeURIComponent(url)}&start=${startTime}&end=${endTime}`
  );
  return response.json();
};

export const downloadFullVideo = async (url) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/download?url=${encodeURIComponent(url)}`
  );
  if (response.ok) {
    await downloadBlob(response);
    toast.success("Full video downloaded successfully!");
  } else {
    toast.error("Failed to download the full video.");
  }
};
