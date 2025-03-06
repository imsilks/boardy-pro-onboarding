import React, { useState } from "react";
import { toast } from "sonner";
import PhoneInput from "@/components/PhoneInput";
import GlassCard from "@/components/GlassCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchContactByPhone, getCronofyAuthUrl, isUrlReachable } from "@/lib/api";
import { useFadeIn } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, User, Phone as PhoneIcon, Edit, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

const Index = () => {
  const [loading, setLoading] = useState(false);
  const [phoneValid, setPhoneValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [contact, setContact] = useState<{ id: string; fullName?: string } | null>(null);
  const [redirectError, setRedirectError] = useState(false);
  const [lookupPhone, setLookupPhone] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState("Enter your phone number to connect your calendars");
  const [isEditingSubtitle, setIsEditingSubtitle] = useState(false);

  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInSubtitle = useFadeIn("down", 200);
  const fadeInCard = useFadeIn("up", 300);

  // Function to handle editing the subtitle
  const handleEditSubtitle = () => {
    setIsEditingSubtitle(true);
  };

  // Function to save the subtitle
  const handleSaveSubtitle = () => {
    setIsEditingSubtitle(false);
    toast.success("Subtitle updated");
  };

  // Handle subtitle change
  const handleSubtitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSubtitle(e.target.value);
  };

  const handlePhoneSubmit = async (phone: string) => {
    setLoading(true);
    setRedirectError(false);
    setLookupPhone(phone);
    
    try {
      console.log("Submitted phone number:", phone);
      
      // Fetch contact ID from Supabase
      const contactResult = await fetchContactByPhone(phone);
      if (!contactResult) {
        console.error("No contact found for phone:", phone);
        toast.error("We couldn't find your account. Please check your phone number.");
        setLoading(false);
        return;
      }

      // Log the found contact info
      console.log("Found contact:", contactResult);
      setContact(contactResult);

      // Display contact details on success
      const contactDetails = [
        `Contact ID: ${contactResult.id}`,
        contactResult.fullName ? `Name: ${contactResult.fullName}` : "Name: Not available",
        `Phone: ${contactResult.phone || phone}`
      ];
      
      toast.success(
        "Account found!", 
        { 
          description: contactDetails.join('\n'),
          duration: 5000
        }
      );

      // Get Cronofy auth URL with the contact ID and redirect
      const cronofyUrl = getCronofyAuthUrl(contactResult.id);
      console.log("Redirecting to:", cronofyUrl);
      
      setRedirecting(true);

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
      console.error("Error processing request:", error);
      toast.error("Something went wrong. Please try again.");
      setRedirectError(true);
      setLoading(false);
    }
  };

  const handlePhoneValidation = (isValid: boolean) => {
    setPhoneValid(isValid);
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
          
          {/* Editable subtitle */}
          <div className="flex items-center justify-center" style={fadeInSubtitle}>
            {isEditingSubtitle ? (
              <div className="flex items-center space-x-2 max-w-sm">
                <Input 
                  value={subtitle} 
                  onChange={handleSubtitleChange} 
                  className="text-center text-lg py-1"
                  autoFocus
                />
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleSaveSubtitle} 
                  className="h-8 w-8 text-green-600"
                >
                  <Check size={16} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center group relative">
                <p className="text-lg text-gray-600">{subtitle}</p>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  onClick={handleEditSubtitle} 
                  className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit size={12} />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Phone input card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {redirecting ? (
              redirectError ? (
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
                        <User size={16} className="mr-1" /> Contact Information
                      </h3>
                      <p className="text-xs text-blue-700">ID: {contact.id}</p>
                      {contact.fullName && <p className="text-xs text-blue-700">Name: {contact.fullName}</p>}
                      <p className="text-xs text-blue-700 flex items-center mt-1">
                        <PhoneIcon size={14} className="mr-1" />
                        <span>{lookupPhone}</span>
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col space-y-2 w-full">
                    <Button 
                      onClick={handleRetryRedirect}
                      className="w-full"
                    >
                      <RefreshCw size={16} />
                      Retry Connection
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setRedirecting(false);
                        setRedirectError(false);
                        setLoading(false);
                      }}
                      className="w-full"
                    >
                      Enter Different Phone Number
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center space-y-4 animate-fade-in">
                  <LoadingSpinner size="lg" className="text-primary" />
                  <p className="text-gray-700 text-center font-medium">
                    Connecting to your calendar...
                  </p>
                  
                  {contact && (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4 w-full mt-2">
                      <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center">
                        <User size={16} className="mr-1" /> Account Found
                      </h3>
                      <p className="text-xs text-blue-700">ID: {contact.id}</p>
                      {contact.fullName && <p className="text-xs text-blue-700">Name: {contact.fullName}</p>}
                      <p className="text-xs text-blue-700 flex items-center mt-1">
                        <PhoneIcon size={14} className="mr-1" />
                        <span>{lookupPhone}</span>
                      </p>
                    </div>
                  )}
                </div>
              )
            ) : (
              <PhoneInput 
                onSubmit={handlePhoneSubmit} 
                isLoading={loading} 
                isValid={phoneValid} 
              />
            )}
          </GlassCard>
          
          {!redirecting && (
            <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
              We'll verify your phone number to find your account
            </p>
          )}
          
          {redirectError && (
            <p className="mt-6 text-center text-sm text-amber-500 animate-fade-in">
              Note: Your account was found successfully, but there was an issue connecting to the calendar service.
            </p>
          )}
        </div>
      </div>
    </div>;
};

export default Index;
