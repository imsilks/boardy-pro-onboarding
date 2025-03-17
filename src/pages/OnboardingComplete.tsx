
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";

const OnboardingComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [completed, setCompleted] = useState(false);
  
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
      sessionStorage.setItem("boardyContactId", id);
      console.log("Stored/updated contactId in sessionStorage:", id);
      updateProStatus(id);
    } else {
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
        updateProStatus(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
        toast.error("Contact information is missing");
      }
    }
  }, [location]);

  const updateProStatus = async (contactId: string) => {
    setUpdating(true);
    try {
      console.log("Updating pro status for contact ID:", contactId);
      
      // Placeholder for the API call - will be replaced with actual implementation
      // This will update the isProUser status from FALSE to TRUE
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Pro status updated successfully");
      toast.success("Your account has been upgraded to Pro!");
      setCompleted(true);
    } catch (error) {
      console.error("Error updating pro status:", error);
      toast.error("Failed to update account status. Please contact support.");
    } finally {
      setUpdating(false);
    }
  };

  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        <div className="text-center mb-12" style={fadeInTitle}>
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <img 
              src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" 
              alt="Boardy Pro Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            Setup Complete
          </h1>
          <p className="text-lg text-gray-600">
            Your Boardy Pro account is ready to use
          </p>
        </div>

        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {updating ? (
              <div className="py-16 flex flex-col items-center justify-center">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Activating your Pro account...</p>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center space-y-6">
                <div className="text-green-500 mb-2">
                  <CheckCircle size={64} className="mx-auto" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Congratulations!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your Boardy Pro account has been successfully set up and activated.
                    {contactId && <span className="text-xs block mt-2 text-gray-400">ID: {contactId}</span>}
                  </p>
                </div>
                
                <div className="w-full space-y-3">
                  <Button 
                    className="w-full bg-green-600 hover:bg-green-700" 
                    onClick={handleGoToDashboard}
                  >
                    <ArrowRight className="mr-2" size={18} />
                    Go to Dashboard
                  </Button>
                </div>
              </div>
            )}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            If you have any questions, please contact support@boardy.ai
          </p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingComplete;
