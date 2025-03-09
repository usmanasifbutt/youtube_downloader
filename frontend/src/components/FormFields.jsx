import { Input } from "@/components/ui/input";

export default function FormFields({ formData, handleChange }) {
  return (
    <>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        YouTube Video URL
      </label>
      <Input
        type="text"
        name="url"
        placeholder="https://www.youtube.com/watch?v=..."
        value={formData.url}
        onChange={handleChange}
        className="w-full mb-4"
      />
      <div className="grid grid-cols-2 gap-4 mb-4">
        {["startTime", "endTime"].map((field) => (
          <div key={field}>
            <Input
              type="text"
              name={field}
              placeholder="00:00:00"
              value={formData[field]}
              onChange={handleChange}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">Format: HH:MM:SS</p>
          </div>
        ))}
      </div>
    </>
  );
}
