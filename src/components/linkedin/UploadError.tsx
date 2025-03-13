
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
          This might be due to a CORS issue or server unavailability. In development mode, you can use the "Simulate Success" option below.
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRetry} 
          className="mt-2 bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
        >
          <RefreshCw size={14} className="mr-1" /> Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default UploadError;
