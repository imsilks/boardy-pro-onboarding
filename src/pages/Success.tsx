
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar } from "lucide-react";
import { useFadeIn } from "@/lib/animations";

const Success = () => {
  const location = useLocation();
  const [contactId, setContactId] = useState<string | null>(null);
  
  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    // Get contactId from URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    setContactId(id);
  }, [location]);

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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">Account Verified</h1>
          <p className="text-lg text-gray-600">Your phone number has been verified</p>
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
                  We've successfully verified your account.
                  {contactId && <span className="text-xs block mt-2 text-gray-400">ID: {contactId}</span>}
                </p>
              </div>
              
              <div className="w-full space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => {
                    // Try to redirect to Cronofy again if we have the contactId
                    if (contactId) {
                      window.location.href = `https://boardy-server-v36-production.up.railway.app/api/cronofy/auth/${contactId}`;
                    }
                  }}
                >
                  <Calendar className="mr-2" size={18} />
                  Connect Calendar
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    window.location.href = "/";
                  }}
                >
                  Return to Home
                </Button>
              </div>
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
