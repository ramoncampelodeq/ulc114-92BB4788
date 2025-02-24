
import { Upload } from "lucide-react";

interface MinutesUploadButtonProps {
  sessionId: string;
  isUploading: boolean;
  onFileSelect: (file: File) => void;
}

export function MinutesUploadButton({
  sessionId,
  isUploading,
  onFileSelect,
}: MinutesUploadButtonProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="file"
        id={`file-${sessionId}`}
        className="hidden"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            onFileSelect(file);
          }
        }}
      />
      <label
        htmlFor={`file-${sessionId}`}
        className="flex items-center gap-1 text-sm text-primary hover:underline cursor-pointer"
      >
        <Upload className="h-4 w-4" />
        {isUploading ? "Enviando..." : "Anexar PDF"}
      </label>
    </div>
  );
}
