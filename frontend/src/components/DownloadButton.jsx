import { Button } from "@/components/ui/button";

export default function DownloadButton({ loading, onClick }) {
  return (
    <Button type="button" onClick={onClick} className="w-full mb-4" disabled={loading}>
      {loading ? "Downloading..." : "Download Full Video"}
    </Button>
  );
}
