import { Progress } from "@/components/ui/progress";

export default function VideoProgress({ progress }) {
  return (
    <div className="mb-4">
      <Progress value={progress} className="w-full h-5" />
      <p className="text-xs text-gray-500 mt-1 text-center">Processing ...</p>
    </div>
  );
}