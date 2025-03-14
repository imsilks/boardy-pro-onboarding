
import React, { useState } from "react";
import { Upload, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadAreaProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ file, onFileSelect }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
  
  const validateFile = (selectedFile: File): boolean => {
    setError(null);
    
    // Check file type
    if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
      setError("Please upload a CSV file");
      toast.error("Please upload a CSV file");
      return false;
    }
    
    // Check file size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      toast.error(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      return false;
    }
    
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        // Create a new File object with the name "Connections.csv" as required
        const renamedFile = new File(
          [selectedFile], 
          "Connections.csv", 
          { type: "text/csv" }
        );
        
        onFileSelect(renamedFile);
        toast.success("File selected and will be uploaded as Connections.csv");
      }
    }
  };
  
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const selectedFile = e.dataTransfer?.files?.[0];
    if (selectedFile) {
      if (validateFile(selectedFile)) {
        // Create a new File object with the name "Connections.csv" as required
        const renamedFile = new File(
          [selectedFile], 
          "Connections.csv", 
          { type: "text/csv" }
        );
        
        onFileSelect(renamedFile);
        toast.success("File selected and will be uploaded as Connections.csv");
      }
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragActive 
          ? "border-primary bg-primary/5" 
          : error 
            ? "border-red-300 bg-red-50" 
            : file 
              ? "border-green-300 bg-green-50" 
              : "border-gray-300 hover:border-primary/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input 
        type="file" 
        id="file-upload" 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".csv" 
      />
      
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
        {error ? (
          <AlertCircle size={40} className="text-red-500 mb-2" />
        ) : file ? (
          <Check size={40} className="text-green-500 mb-2" />
        ) : (
          <Upload size={40} className="text-gray-400 mb-2" />
        )}
        
        <span className={`text-sm mb-1 ${
          error ? "text-red-500" : file ? "text-green-600" : "text-gray-500"
        }`}>
          {error ? error : file ? file.name : "Click or drag to upload your CSV file"}
        </span>
        
        {!error && !file && (
          <span className="text-xs text-gray-400">
            Export from LinkedIn and upload here (max 10MB)
          </span>
        )}
      </label>
      
      {file && !error && (
        <div className="mt-4 text-sm text-green-600 flex items-center justify-center">
          <Check size={16} className="mr-1" /> File selected (will be uploaded as Connections.csv)
        </div>
      )}
    </div>
  );
};

export default FileUploadArea;
