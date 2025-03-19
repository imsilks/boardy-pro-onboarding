
import React from "react";
import { AlertCircle, RefreshCw, LogIn } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

interface UploadErrorProps {
  error: string | null;
  onRetry: () => void;
}

const UploadError: React.FC<UploadErrorProps> = ({ error, onRetry }) => {
  if (!error) return null;
  
  const isAuthError = error.includes("Authentication") || 
                      error.includes("JWT") || 
                      error.includes("401") ||
                      error.includes("auth") ||
                      error.includes("log in");
  
  const handleLogin = async () => {
    // Check if there's already a session before attempting to login
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      console.log("User already has a session, refreshing the page");
      window.location.reload();
      return;
    }
    
    console.log("Initiating login flow");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href
      }
    });
    
    if (error) {
      console.error("Login error:", error);
    }
  };
  
  return (
    <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
      <AlertCircle className="h-4 w-4 mr-2" />
      <AlertDescription>
        <p className="font-medium">{error}</p>
        
        {isAuthError ? (
          <p className="mt-1 text-xs text-red-600">
            You need to be logged in with a valid account to upload LinkedIn connections. 
            Your session may have expired or you need to log in again.
          </p>
        ) : (
          <p className="mt-1 text-xs text-red-600">
            This might be due to a CORS issue or server unavailability. In development mode, 
            you can use the "Simulate Success" option below.
          </p>
        )}
        
        <div className="mt-2 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry} 
            className="bg-red-50 border-red-200 hover:bg-red-100 text-red-800"
          >
            <RefreshCw size={14} className="mr-1" /> Try Again
          </Button>
          
          {isAuthError && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogin} 
              className="bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
            >
              <LogIn size={14} className="mr-1" /> Login Now
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default UploadError;
