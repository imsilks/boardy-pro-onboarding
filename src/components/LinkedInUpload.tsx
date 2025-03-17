
import React, { useState } from "react";
import { ArrowLeft, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FileUploadArea from "./linkedin/FileUploadArea";
import UploadProgress from "./linkedin/UploadProgress";
import UploadError from "./linkedin/UploadError";
import ActionButtons from "./linkedin/ActionButtons";
import HelpText from "./linkedin/HelpText";
import { uploadLinkedInConnections } from "@/lib/api";
import { toast } from "sonner";

interface LinkedInUploadProps {
  contactId: string;
  onComplete: () => void;
  onBack: () => void;
}

const LinkedInUpload: React.FC<LinkedInUploadProps> = ({ contactId, onComplete, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelected = (selectedFile: File | null) => {
    if (selectedFile) {
      // Reset states on new file selection
      setFile(selectedFile);
      setUploadProgress(0);
      setUploadSuccess(false);
      setUploadError(null);
      console.log("LinkedIn file selected:", selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }

    if (!contactId) {
      // Try to get from sessionStorage if not in props
      const storedId = sessionStorage.getItem("boardyContactId");
      if (!storedId) {
        toast.error("Contact ID is missing");
        return;
      }
      contactId = storedId;
    }

    setUploading(true);
    setUploadError(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        const next = prev + Math.random() * 20;
        return next > 90 ? 90 : next; // Cap at 90% until complete
      });
    }, 500);
    
    try {
      await uploadLinkedInConnections(contactId, file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadSuccess(true);
      toast.success("LinkedIn connections imported successfully!");
      
      // Store the contactId in sessionStorage again for redundancy
      sessionStorage.setItem("boardyContactId", contactId);
      
      // Wait a moment before completing
      setTimeout(onComplete, 1000);
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Error uploading LinkedIn connections:", error);
      setUploadError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to upload LinkedIn connections");
    } finally {
      setUploading(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped LinkedIn import");
    onComplete();
  };

  return (
    <div className="py-6 flex flex-col items-center justify-center space-y-6">
      <div className="text-blue-500 mb-2">
        <Upload size={48} className="mx-auto" />
      </div>
      
      {uploadSuccess ? (
        <div className="text-center space-y-4">
          <div className="text-green-500">
            <CheckCircle size={48} className="mx-auto" />
          </div>
          <h3 className="text-xl font-medium">Import Successful!</h3>
          <p className="text-gray-600">
            Your LinkedIn connections have been imported successfully.
          </p>
          <Button 
            className="mt-4" 
            onClick={onComplete}
          >
            Continue
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-2 text-center">
            <h3 className="text-xl font-medium">Import LinkedIn Connections</h3>
            <p className="text-gray-600">
              Upload your LinkedIn connections to enhance your network
            </p>
          </div>
          
          {!uploading && !file && (
            <FileUploadArea 
              file={file}
              onFileSelect={handleFileSelected} 
            />
          )}
          
          {file && !uploadError && (
            <div className="w-full space-y-2">
              <Label>Selected File</Label>
              <div className="p-2 border rounded-md bg-blue-50 text-blue-700 text-sm flex items-center">
                <Upload size={16} className="mr-2" />
                {file.name}
              </div>
            </div>
          )}
          
          {uploading && (
            <UploadProgress 
              isUploading={uploading}
              progress={uploadProgress} 
            />
          )}
          
          {uploadError && (
            <UploadError 
              error={uploadError} 
              onRetry={handleUpload}
            />
          )}
          
          <HelpText />
          
          <ActionButtons 
            isFileSelected={!!file}
            isUploading={uploading}
            onUpload={handleUpload}
            onSkip={handleSkip}
            onBack={onBack}
            canSimulateSuccess={process.env.NODE_ENV === 'development'}
            onSimulateSuccess={() => {
              setUploadSuccess(true);
              toast.success("Simulated successful import");
              setTimeout(onComplete, 1000);
            }}
          />
        </>
      )}
    </div>
  );
};

export default LinkedInUpload;
