
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface UploadErrorProps {
  error: string | null;
  onRetry: () => void;
}

const UploadError: React.FC<UploadErrorProps> = ({ error, onRetry }) => {
  if (!error) return null;
  
  return (
    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        <p className="font-medium">{error}</p>
        
        <p className="mt-1 text-xs text-red-600">
          There was an error uploading your LinkedIn connections. 
          This might be due to network issues or server unavailability.
        </p>
        
        <div className="mt-2 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
          >
            <RefreshCw size={14} className="mr-1" /> Try Again
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UploadError;
