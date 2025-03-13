
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Check, AlertCircle } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";

interface LinkedInUploadProps {
  contactId: string;
  onComplete: () => void;
  onBack: () => void;
}

const LinkedInUpload: React.FC<LinkedInUploadProps> = ({ 
  contactId, 
  onComplete,
  onBack
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
  const fadeInStyle = useFadeIn("up", 100);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check if it's a CSV file
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      
      setFile(selectedFile);
      setUploadError(null);
      toast.success("File selected: " + selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Use the external API endpoint
      const formData = new FormData();
      formData.append("file", file);
      
      toast.info("Uploading your LinkedIn connections...");
      
      const importUrl = `https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin/${contactId}`;
      
      console.log("Attempting to upload to:", importUrl);
      
      const response = await fetch(importUrl, {
        method: 'POST',
        body: formData,
        // Adding these headers may help with CORS issues
        headers: {
          // Don't set Content-Type for FormData as the browser will set it with the boundary
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Upload failed with status ${response.status}:`, errorText);
        throw new Error(`Server responded with ${response.status}: ${errorText || 'No error details provided'}`);
      }
      
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.log("Non-JSON response:", text);
        data = { message: "Upload successful, but response was not JSON" };
      }
      
      console.log("Upload successful:", data);
      
      toast.success("LinkedIn connections imported successfully!");
      onComplete();
    } catch (error) {
      console.error("Upload error details:", error);
      
      // More specific error handling
      let errorMessage = "Failed to upload connections";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network error: The server may be down or unreachable";
      } else if (error instanceof Error) {
        errorMessage = error.message || "Unknown error occurred";
      }
      
      setUploadError(errorMessage);
      toast.error("Failed to upload: " + errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full space-y-6" style={fadeInStyle}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Import Your LinkedIn Connections</h3>
        <p className="text-gray-600">Upload your LinkedIn connections CSV to connect with your network</p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          id="file-upload"
          onChange={handleFileChange}
          className="hidden"
          accept=".csv"
        />
        
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload size={40} className="text-gray-400 mb-2" />
          <span className="text-sm text-gray-500 mb-1">
            {file ? file.name : "Click to select your CSV file"}
          </span>
          <span className="text-xs text-gray-400">
            Export from LinkedIn and upload here
          </span>
        </label>
        
        {file && (
          <div className="mt-4 text-sm text-green-600 flex items-center justify-center">
            <Check size={16} className="mr-1" /> {file.name} selected
          </div>
        )}
      </div>
      
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm flex items-start">
          <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
      
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Back
        </Button>
        
        <Button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="flex-1"
        >
          {isUploading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Uploading...
            </>
          ) : (
            <>
              <FileUp size={18} className="mr-2" />
              Upload
            </>
          )}
        </Button>
      </div>
      
      <p className="text-center text-xs text-gray-500 mt-6">
        Need help exporting your LinkedIn connections? 
        <a 
          href="https://www.linkedin.com/help/linkedin/answer/a566335/export-connections-from-linkedin" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary ml-1 hover:underline"
        >
          View LinkedIn guide
        </a>
      </p>
    </div>
  );
};

export default LinkedInUpload;
