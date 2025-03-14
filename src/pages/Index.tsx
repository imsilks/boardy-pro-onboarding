
import React, { useState } from "react";
import { toast } from "sonner";
import { getCronofyAuthUrl, isUrlReachable, formatPhoneNumber } from "@/lib/api";
import { fetchContactByPhoneSecure } from "@/api/contact-lookup";
import { useFadeIn } from "@/lib/animations";
import HeaderSection from "@/components/HeaderSection";
import PhoneFormSection from "@/components/PhoneFormSection";

const Index = () => {
  // State for phone validation and lookup
  const [loading, setLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [contact, setContact] = useState<{ id: string; fullName?: string } | null>(null);
  const [redirectError, setRedirectError] = useState(false);
  const [lookupPhone, setLookupPhone] = useState<string | null>(null);
  const [showLinkedInUpload, setShowLinkedInUpload] = useState(false);
  
  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInSubtitle = useFadeIn("down", 200);
  const fadeInCard = useFadeIn("up", 300);

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    setRedirectError(false);
    setLookupPhone(phone);
    
    try {
      console.log("Submitted phone number:", phone);
      
      // Try with multiple backup strategies for contact lookup
      const contactResult = await fetchContactByPhoneSecure(phone);
      
      if (!contactResult) {
        console.error("No contact found for phone:", phone);
        setLoading(false);
        return;
      }

      // Log the found contact info
      console.log("Found contact:", contactResult);
      setContact({
        id: contactResult.id,
        fullName: contactResult.fullName
      });

      // Show LinkedIn upload instead of redirecting immediately
      setLoading(false);
      setShowLinkedInUpload(true);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("Something went wrong. Please try again.");
      setRedirectError(true);
      setLoading(false);
    }
  };

  const handlePhoneValidation = (isValid: boolean) => {
    setPhoneValid(isValid);
  };

  const handleLinkedInUploadComplete = async () => {
    // After LinkedIn upload, proceed with Cronofy auth
    if (contact) {
      setRedirecting(true);
      
      // Get Cronofy auth URL with the contact ID and redirect
      const cronofyUrl = getCronofyAuthUrl(contact.id);
      console.log("Redirecting to:", cronofyUrl);
      
      try {
        // Check if the URL is reachable before redirecting
        const isReachable = await isUrlReachable(cronofyUrl);
        
        if (isReachable) {
          // Simulate a small delay for better UX
          setTimeout(() => {
            window.location.href = cronofyUrl;
          }, 1500);
        } else {
          // Handle the case when Cronofy is not reachable
          console.error("Cronofy URL is not reachable:", cronofyUrl);
          setRedirectError(true);
          toast.error("Unable to connect to calendar service. Please try again later.");
        }
      } catch (error) {
        console.error("Error checking URL:", error);
        setRedirectError(true);
      }
    }
  };

  const handleBackToPhone = () => {
    setShowLinkedInUpload(false);
  };

  const handleRetryRedirect = () => {
    if (contact) {
      setRedirectError(false);
      setRedirecting(true);
      
      const cronofyUrl = getCronofyAuthUrl(contact.id);
      toast.success("Retrying connection...");
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = cronofyUrl;
      }, 1000);
    }
  };

  const resetRedirect = () => {
    setRedirecting(false);
    setRedirectError(false);
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        {/* Header with title only */}
        <HeaderSection 
          fadeInTitle={fadeInTitle}
          fadeInSubtitle={fadeInSubtitle}
        />

        {/* Phone input, LinkedIn upload and redirect status */}
        <PhoneFormSection 
          loading={loading}
          phoneValid={phoneValid}
          redirecting={redirecting}
          redirectError={redirectError}
          contact={contact}
          lookupPhone={lookupPhone}
          fadeInCard={fadeInCard}
          handlePhoneSubmit={handlePhoneSubmit}
          handlePhoneValidation={handlePhoneValidation}
          handleRetryRedirect={handleRetryRedirect}
          resetRedirect={resetRedirect}
          showLinkedInUpload={showLinkedInUpload}
          onLinkedInUploadComplete={handleLinkedInUploadComplete}
          onBackToPhone={handleBackToPhone}
        />
      </div>
    </div>
  );
};

export default Index;
