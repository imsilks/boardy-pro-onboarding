import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, ArrowLeft, CalendarPlus, ArrowRight } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { getCronofyAuthUrl } from "@/lib/api";
const Success = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [contactId, setContactId] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    const fromCronofy = params.get("fromCronofy");
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
      sessionStorage.setItem("boardyContactId", id);
      console.log("Stored/updated contactId in sessionStorage:", id);
    } else {
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
        toast.error("Contact information is missing");
      }
    }
    if (fromCronofy === "true") {
      toast.success("Calendar connected successfully! Welcome back.");
    }
  }, [location]);
  const handleConnectCalendar = async () => {
    let idToUse = contactId;
    if (!idToUse) {
      idToUse = sessionStorage.getItem("boardyContactId");
      console.log("Retrieved contactId from sessionStorage for calendar connection:", idToUse);
    }
    if (!idToUse) {
      console.error("No contactId available for calendar connection");
      toast.error("Contact ID is missing. Please try again from the beginning.");
      return;
    }
    setConnecting(true);
    setConnectionError(false);
    try {
      console.log("Attempting to connect to Cronofy with contactId:", idToUse);
      const cronofyUrl = getCronofyAuthUrl(idToUse);
      if (cronofyUrl) {
        console.log("Redirecting to Cronofy URL:", cronofyUrl);
        window.location.href = cronofyUrl;
      } else {
        throw new Error("Failed to generate Cronofy URL");
      }
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
    const idToUse = contactId || sessionStorage.getItem("boardyContactId");
    navigate(`/booking-link${idToUse ? `?contactId=${idToUse}` : ''}`);
  };
  const handleReturnHome = () => {
    navigate("/");
  };
  return <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        <div className="text-center mb-12" style={fadeInTitle}>
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <img src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" alt="Boardy Pro Logo" className="h-16 w-16 object-contain" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
            Calendar Connected
          </h1>
          <p className="text-lg text-gray-600">
            Your calendar has been successfully linked to Boardy
          </p>
        </div>

        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              <div className="text-green-500 mb-2">
                <Calendar size={64} className="mx-auto" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">
                  Calendar Integration Complete!
                </h2>
                <p className="text-gray-600 mb-6">
                  We can now access your calendar to schedule meetings and avoid conflicts.
                  {contactId && <span className="text-xs block mt-2 text-gray-400">ID: {contactId}</span>}
                </p>
              </div>
              
              <div className="w-full space-y-3">
                {connecting ? <Button className="w-full" disabled={true}>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </Button> : <Button className="w-full" onClick={handleConnectCalendar}>
                    <CalendarPlus className="mr-2" size={18} />
                    Connect Another Calendar
                  </Button>}
                
                <Button onClick={handleContinue} className="w-full bg-slate-500 hover:bg-slate-400">
                  <ArrowRight className="mr-2" size={18} />
                  I'm good, let's move on
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleReturnHome}>
                  <ArrowLeft size={16} className="mr-2" />
                  Back
                </Button>
              </div>
              
              {connectionError && <div className="px-4 py-3 mt-3 bg-amber-50 border border-amber-200 rounded-md text-amber-700 text-sm">
                  <p>There was an issue connecting to the calendar service. Please try again.</p>
                </div>}
            </div>
          </GlassCard>
          
          
        </div>
      </div>
    </div>;
};
export default Success;