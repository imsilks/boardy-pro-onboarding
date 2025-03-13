
import React from "react";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onBack: () => void;
  onUpload: () => void;
  isUploading: boolean;
  isFileSelected: boolean;
  canSimulateSuccess: boolean;
  onSimulateSuccess: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onBack, 
  onUpload, 
  isUploading, 
  isFileSelected,
  canSimulateSuccess,
  onSimulateSuccess
}) => {
  return (
    <>
      <div className="flex justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        
        <Button 
          onClick={onUpload} 
          disabled={!isFileSelected || isUploading} 
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
          <Button variant="secondary" size="sm" onClick={onSimulateSuccess} className="w-full text-xs">
            Simulate Success (DEV)
          </Button>
        </div>
      )}
    </>
  );
};

export default ActionButtons;
