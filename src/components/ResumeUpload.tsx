import { Upload, FileText, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface ResumeUploadProps {
  onUpload?: (file: File) => void;
}

const ResumeUpload = ({ onUpload }: ResumeUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) { setFile(dropped); onUpload?.(dropped); }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) { setFile(selected); onUpload?.(selected); }
  };

  return (
    <div
      onDragOver={e => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
    >
      {file ? (
        <div className="flex items-center justify-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div className="text-left">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
          </div>
          <button onClick={() => setFile(null)} className="p-1 hover:bg-muted rounded">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      ) : (
        <label className="cursor-pointer">
          <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground mb-1">Drop your resume here or click to browse</p>
          <p className="text-sm text-muted-foreground">PDF or DOCX, max 5MB</p>
          <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleChange} />
        </label>
      )}
    </div>
  );
};

export default ResumeUpload;
