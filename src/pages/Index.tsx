
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import PhoneInput from "@/components/PhoneInput";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchContactByPhone, getCronofyAuthUrl } from "@/lib/api";
import { useFadeIn, useAnimationSequence } from "@/lib/animations";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInSubtitle = useFadeIn("down", 200);
  const fadeInCard = useFadeIn("up", 300);

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    try {
      // Fetch contact ID from Supabase
      const contact = await fetchContactByPhone(phone);
      if (!contact) {
        toast.error("We couldn't find your account. Please check your phone number.");
        setLoading(false);
        return;
      }

      // Get Cronofy auth URL and redirect
      const cronofyUrl = getCronofyAuthUrl(contact.id);
      setRedirecting(true);
      toast.success("Account found! Redirecting to calendar connection...");

      // Simulate a small delay for better UX
      setTimeout(() => {
        window.location.href = cronofyUrl;
      }, 1500);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  // Validate phone number as user types
  const handlePhoneValidation = (isValid: boolean) => {
    setPhoneValid(isValid);
  };

  return <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
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
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">Welcome to Boardy Pro</h1>
          <p className="text-lg text-gray-600" style={fadeInSubtitle}>Enter your phone number to connect your calendars</p>
        </div>

        {/* Phone input card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {redirecting ? <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                <LoadingSpinner size="lg" className="text-primary" />
                <p className="text-gray-700 text-center font-medium">
                  Connecting to your calendar...
                </p>
              </div> : <PhoneInput onSubmit={handlePhoneSubmit} isLoading={loading} isValid={phoneValid} />}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            We'll verify your phone number to find your account
          </p>
        </div>
      </div>
    </div>;
};

export default Index;
