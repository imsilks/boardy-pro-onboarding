
import React from "react";
import { Upload, Check } from "lucide-react";
import { toast } from "sonner";

interface FileUploadAreaProps {
  file: File | null;
  onFileSelect: (file: File) => void;
}

const FileUploadArea: React.FC<FileUploadAreaProps> = ({ file, onFileSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      return;
    }
    
    console.log("Original file selected:", selectedFile.name, selectedFile.type);
    
    // Validate file type
    if (selectedFile.type !== "text/csv" && 
        !selectedFile.name.endsWith(".csv") && 
        !selectedFile.type.includes("excel") && 
        !selectedFile.type.includes("spreadsheet")) {
      toast.error("Please upload a CSV file");
      return;
    }
    
    try {
      // Create a new File object with the name "Connections.csv" as required by the API
      const renamedFile = new File(
        [selectedFile], 
        "Connections.csv", 
        { type: "text/csv" }
      );
      
      console.log("Renamed file:", renamedFile.name, renamedFile.type);
      
      onFileSelect(renamedFile);
      toast.success("File selected and will be uploaded as Connections.csv");
    } catch (error) {
      console.error("Error processing file:", error);
      toast.error("Failed to process the selected file");
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
      <input type="file" id="file-upload" onChange={handleFileChange} className="hidden" accept=".csv" />
      
      <label htmlFor="file-upload" className="flex flex-col items-center justify-center cursor-pointer">
        <Upload size={40} className="text-gray-400 mb-2" />
        <span className="text-sm text-gray-500 mb-1">
          {file ? file.name : "Click to select your CSV file"}
        </span>
        <span className="text-xs text-gray-400">
          Export from LinkedIn and upload here
        </span>
      </label>
      
      {file && <div className="mt-4 text-sm text-green-600 flex items-center justify-center">
          <Check size={16} className="mr-1" /> File selected (will be uploaded as Connections.csv)
        </div>}
    </div>
  );
};

export default FileUploadArea;
