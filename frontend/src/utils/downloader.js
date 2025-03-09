import { isAbsoluteUrl } from ".";

export const downloadVideo = (downloadUrl, fileName = "video.mp4") => {
    const link = document.createElement("a");
    link.href = isAbsoluteUrl(downloadUrl)
      ? downloadUrl
      : `${process.env.NEXT_PUBLIC_API_URL}${downloadUrl}`;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const downloadBlob = async (response) => {
  const blob = await response.blob();
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;

  // Extract filename from headers or use a default
  const contentDisposition = response.headers.get("Content-Disposition");
  const filename = contentDisposition
    ? contentDisposition.split("filename=")[1].replace(/"/g, "")
    : "video.mp4";
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(downloadUrl);
  link.remove();
}