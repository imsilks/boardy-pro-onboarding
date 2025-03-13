
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, Check, AlertCircle, RefreshCw } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";

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
  const [uploadProgress, setUploadProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [canSimulateSuccess, setCanSimulateSuccess] = useState(false);
  const fadeInStyle = useFadeIn("up", 100);

  // Check if in development mode for simulation option
  useEffect(() => {
    setCanSimulateSuccess(import.meta.env.DEV || false);
    
    // Reset progress animation when not uploading
    if (!isUploading) {
      setUploadProgress(0);
    }
  }, [isUploading]);

  // Progress animation during upload
  useEffect(() => {
    let interval: number | null = null;
    
    if (isUploading && uploadProgress < 95) {
      interval = window.setInterval(() => {
        setUploadProgress(prev => {
          const increment = prev < 30 ? 5 : prev < 70 ? 2 : 0.5;
          return Math.min(prev + increment, 95);
        });
      }, 300);
    }
    
    return () => {
      if (interval !== null) window.clearInterval(interval);
    };
  }, [isUploading, uploadProgress]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }
      
      // Create a new File object with the name "Connections.csv" as required
      const renamedFile = new File(
        [selectedFile], 
        "Connections.csv", 
        { type: "text/csv" }
      );
      
      setFile(renamedFile);
      setUploadError(null);
      toast.success("File selected and will be uploaded as Connections.csv");
    }
  };

  const handleUpload = async (useRetry = false) => {
    if (!file) {
      toast.error("Please select a file first");
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    
    if (useRetry) {
      setRetryCount(prev => prev + 1);
      toast.info(`Retry attempt ${retryCount + 1}...`);
    } else {
      toast.info("Uploading your LinkedIn connections...");
    }
    
    try {
      const importUrl = `https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin/${contactId}`;
      console.log(`Starting upload to ${importUrl} with contact ID: ${contactId}`);
      console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);
      
      // Create a proper FormData object for multipart/form-data
      const formData = new FormData();
      
      // Important: The field must be named 'file' to match the expected format
      formData.append('file', file);
      
      // Log FormData entries for debugging
      console.log("Form data entries:");
      for(let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1] instanceof File ? 'File object' : pair[1]}`);
      }
      
      // Set longer timeout for the request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        // Make the request - let the browser set the Content-Type header with proper boundary
        const response = await fetch(importUrl, {
          method: 'POST',
          body: formData,
          signal: controller.signal,
          // Do not set Content-Type header manually as browser needs to set the boundary
        });
        
        clearTimeout(timeoutId);
        
        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Upload failed with status ${response.status}:`, errorText);
          throw new Error(`Server responded with ${response.status}: ${errorText || 'No error details provided'}`);
        }
        
        // Set progress to 100% on success
        setUploadProgress(100);
        
        let responseData;
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
            console.log("Successful upload response:", responseData);
          } else {
            const text = await response.text();
            console.log("Successful non-JSON response:", text);
            responseData = { message: "Upload successful" };
          }
        } catch (parseError) {
          console.warn("Could not parse response as JSON:", parseError);
          responseData = { message: "Upload successful, but response could not be parsed" };
        }
        
        toast.success("LinkedIn connections imported successfully!");
        
        // Small delay before completing to show the 100% progress
        setTimeout(() => {
          onComplete();
        }, 1000);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        throw fetchError; // Re-throw to be handled by the outer catch
      }
    } catch (error) {
      console.error("Upload error details:", error);

      let errorMessage = "Failed to upload connections";
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Network error: The server may be down or unreachable";
      } else if (error instanceof DOMException && error.name === 'AbortError') {
        errorMessage = "The request timed out. The server might be busy.";
      } else if (error instanceof Error) {
        errorMessage = error.message || "Unknown error occurred";
      }
      
      setUploadError(errorMessage);
      
      toast.error(
        <div>
          <p>There was an error uploading your file.</p>
          <ul className="list-disc pl-4 mt-1">
            <li>Check your internet connection</li>
            <li>The API server might be down for maintenance</li>
            <li>If this persists, please try again later or contact support</li>
          </ul>
        </div>, 
        { duration: 8000 }
      );
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRetry = () => {
    handleUpload(true);
  };
  
  // For development, providing a fallback option to bypass the upload
  const handleSimulateSuccess = () => {
    if (canSimulateSuccess) {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate the upload with a progress animation
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              toast.success("Simulated successful upload (DEV MODE)");
              setIsUploading(false);
              onComplete();
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  return <div className="w-full space-y-6" style={fadeInStyle}>
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-800">Import Your LinkedIn Connections</h3>
        <p className="text-gray-600">Upload your LinkedIn connections CSV</p>
      </div>
      
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
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading...</span>
            <span>{uploadProgress.toFixed(0)}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      
      {uploadError && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            <p className="font-medium">{uploadError}</p>
            <p className="mt-1 text-xs text-red-600">
              This might be due to a CORS issue or server unavailability. In development mode, you can use the "Simulate Success" option below.
            </p>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRetry} 
              className="mt-2 bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
            >
              <RefreshCw size={14} className="mr-1" /> Try Again
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        
        <Button 
          onClick={() => handleUpload(false)} 
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
      
      {canSimulateSuccess && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={handleSimulateSuccess} className="w-full text-xs">
            Simulate Success (DEV)
          </Button>
        </div>
      )}
      
      <p className="text-center text-xs text-gray-500 mt-6">
        Need help exporting your LinkedIn connections? 
        <a href="https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data" target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">
          View LinkedIn guide
        </a>
      </p>
    </div>;
};

export default LinkedInUpload;
