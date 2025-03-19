
import React from "react";
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

const UploadProgress: React.FC<UploadProgressProps> = ({ isUploading, progress }) => {
  if (!isUploading) return null;
  
  return (
    <div className="space-y-2 animate-fade-in">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Uploading...</span>
        <span>{progress.toFixed(0)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
