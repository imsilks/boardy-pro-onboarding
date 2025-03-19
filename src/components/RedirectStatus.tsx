
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, User, Phone as PhoneIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface RedirectStatusProps {
  redirecting: boolean;
  redirectError: boolean;
  contact: { id: string; fullName?: string } | null;
  lookupPhone: string | null;
  onRetry: () => void;
  onReset: () => void;
}

const RedirectStatus: React.FC<RedirectStatusProps> = ({
  redirecting,
  redirectError,
  contact,
  lookupPhone,
  onRetry,
  onReset
}) => {
  if (!redirecting) return null;

  if (redirectError) {
    return (
      <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in">
        <div className="text-amber-500 mb-2">
          <img 
            src="/lovable-uploads/03d42aff-d6a9-4576-8507-8cb1277db403.png" 
            alt="Connection Error" 
            className="h-24 w-auto mx-auto mb-2 opacity-70"
          />
        </div>
        <p className="text-gray-700 text-center font-medium mb-2">
          Unable to connect to the calendar service
        </p>
        <p className="text-gray-500 text-sm text-center mb-4">
          The calendar connection service is currently unavailable. Please try again later.
        </p>
        
        {contact && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 w-full mb-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <User size={16} className="mr-1" /> Account Found
            </h3>
            {contact.fullName && <p className="text-xs text-blue-700">Name: {contact.fullName}</p>}
            <p className="text-xs text-blue-700 flex items-center mt-1">
              <PhoneIcon size={14} className="mr-1" />
              <span>{lookupPhone}</span>
            </p>
          </div>
        )}
        
        <div className="flex flex-col space-y-2 w-full">
          <Button 
            onClick={onRetry}
            className="w-full"
          >
            <RefreshCw size={16} className="mr-1" />
            Retry Connection
          </Button>
          <Button 
            variant="outline" 
            onClick={onReset}
            className="w-full"
          >
            Enter Different Phone Number
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in">
      <div className="text-primary">
        <LoadingSpinner size="lg" variant="refresh" className="text-blue-500" />
      </div>
      <p className="text-gray-700 text-center font-medium">
        Connecting to your calendar...
      </p>
      
      {contact && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 w-full mt-2">
            <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
              <User size={16} className="mr-1" /> Account Found
            </h3>
            {contact.fullName && <p className="text-xs text-blue-700">Name: {contact.fullName}</p>}
            <p className="text-xs text-blue-700 flex items-center mt-1">
              <PhoneIcon size={14} className="mr-1" />
              <span>{lookupPhone}</span>
            </p>
          </div>
        )}
    </div>
  );
};

export default RedirectStatus;
