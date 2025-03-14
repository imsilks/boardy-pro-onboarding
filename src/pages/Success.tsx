
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowLeft, CalendarPlus, ArrowRight } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";

const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [returningFromCronofy, setReturningFromCronofy] = useState(false);
  
  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    // Get contactId from URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    const fromCronofy = params.get("fromCronofy");
    
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
      // Store contactId in sessionStorage to persist it
      sessionStorage.setItem("boardyContactId", id);
    } else {
      // Try to get from sessionStorage if not in URL
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
      }
    }
    
    // Check if returning from Cronofy
    if (fromCronofy === "true") {
      setReturningFromCronofy(true);
      toast.success("Calendar connected successfully! Welcome back.");
    }
  }, [location]);

  const handleConnectCalendar = async () => {
    // Use contactId from state, which is populated from URL or sessionStorage
    const idToUse = contactId || sessionStorage.getItem("boardyContactId");
    
    if (!idToUse) {
      toast.error("Contact ID is missing. Please try again from the beginning.");
      return;
    }

    setConnecting(true);
    setConnectionError(false);

    try {
      // Direct API URL as provided
      const cronofyUrl = `https://boardy-server-v36-production.up.railway.app/api/cronofy/auth/${idToUse}?redirect=${encodeURIComponent(window.location.origin + "/success?fromCronofy=true&contactId=" + idToUse)}`;
      console.log("Attempting to connect to Cronofy:", cronofyUrl);
      
      // Redirect the user to the Cronofy auth endpoint
      window.location.href = cronofyUrl;
      
      // Set a timeout to show error message if redirect doesn't happen within 5 seconds
      setTimeout(() => {
        setConnectionError(true);
        setConnecting(false);
      }, 5000);
      
    } catch (error) {
      console.error("Error connecting to Cronofy:", error);
      toast.error("Unable to connect to calendar service. Please try again later.");
      setConnectionError(true);
      setConnecting(false);
    }
  };

  const handleContinue = () => {
    // Navigate to the next step in your onboarding flow
    toast.info("Continuing to the next step in onboarding");
    navigate("/dashboard"); // Update this to your actual next page
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        {/* Header section */}
        <div className="text-center mb-12" style={fadeInTitle}>
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <img 
              src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" 
              alt="Boardy Pro Logo" 
              className="h-16 w-16 object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            {returningFromCronofy ? "Calendar Connected" : "Account Verified"}
          </h1>
          <p className="text-lg text-gray-600">
            {returningFromCronofy 
              ? "Your calendar has been successfully connected" 
              : "Your phone number has been verified"}
          </p>
        </div>

        {/* Success card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              <div className="text-green-500 mb-2">
                <CheckCircle size={64} className="mx-auto" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-6">
                  {returningFromCronofy 
                    ? "We've successfully connected your calendar."
                    : "We've successfully verified your account."}
                  {contactId && <span className="text-xs block mt-2 text-gray-400">ID: {contactId}</span>}
                </p>
              </div>
              
              {/* Always display the three buttons */}
              <div className="w-full space-y-3">
                {connecting ? (
                  // Show loading state when connecting
                  <Button 
                    className="w-full" 
                    disabled={true}
                  >
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </Button>
                ) : (
                  // Connect calendar button
                  <Button 
                    className="w-full" 
                    onClick={handleConnectCalendar}
                  >
                    <CalendarPlus className="mr-2" size={18} />
                    Connect Another Calendar
                  </Button>
                )}
                
                {/* Continue button */}
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700" 
                  onClick={handleContinue}
                >
                  <ArrowRight className="mr-2" size={18} />
                  I'm good, let's move on
                </Button>
                
                {/* Return home button */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleReturnHome}
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
              </div>
              
              {/* Show connection error if applicable */}
              {connectionError && (
                <div className="px-4 py-3 mt-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                  <p>There was an issue connecting to the calendar service. Please try again.</p>
                </div>
              )}
            </div>
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            If you have any questions, please contact support@boardy.ai
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;
