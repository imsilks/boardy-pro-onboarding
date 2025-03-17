
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CalendarCheck, ExternalLink } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const BookingLink = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookingLink, setBookingLink] = useState("");
  const [contactId, setContactId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  
  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    // Get contactId from URL query params or session storage
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
    } else {
      // Try to get from sessionStorage if not in URL
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
        toast.error("Contact information is missing");
      }
    }
  }, [location]);

  const handleSaveBookingLink = async () => {
    if (!contactId) {
      toast.error("Contact ID is missing. Please try again from the beginning.");
      return;
    }

    if (!bookingLink) {
      toast.error("Please enter a booking link");
      return;
    }

    // Validate URL format
    try {
      new URL(bookingLink);
    } catch (e) {
      toast.error("Please enter a valid URL");
      return;
    }

    setSaving(true);

    try {
      // Here we'd save the booking link to the database
      // For now, we'll just log it and proceed
      console.log(`Saving booking link: ${bookingLink} for contact: ${contactId}`);
      
      // Simulate API call to save the booking link
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Booking link saved successfully!");
      
      // Navigate to dashboard or next step
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Error saving booking link:", error);
      toast.error("Failed to save booking link. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped adding a booking link");
    navigate("/dashboard");
  };

  const handleBack = () => {
    navigate(-1);
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
            Add Booking Link
          </h1>
          <p className="text-lg text-gray-600">
            Share your calendar booking link to allow others to schedule time with you
          </p>
        </div>

        {/* Booking link card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            <div className="py-6 flex flex-col items-center justify-center space-y-6">
              <div className="text-blue-500 mb-2">
                <CalendarCheck size={64} className="mx-auto" />
              </div>
              
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="booking-link">Your Calendar Booking Link</Label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-grow">
                      <Input
                        id="booking-link"
                        type="url"
                        placeholder="https://calendly.com/your-link"
                        value={bookingLink}
                        onChange={(e) => setBookingLink(e.target.value)}
                        className="pr-10"
                      />
                      <ExternalLink size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Examples: Calendly, Cal.com, or other booking service
                  </p>
                </div>
                
                <div className="pt-4 w-full space-y-3">
                  {saving ? (
                    <Button className="w-full" disabled>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={handleSaveBookingLink}
                    >
                      <CalendarCheck size={18} className="mr-2" />
                      Save Booking Link
                    </Button>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={handleSkip}
                  >
                    <ArrowRight size={16} className="mr-2" />
                    Skip This Step
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={handleBack}
                  >
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            Your booking link will be shared with others to make it easy to book time with you
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingLink;
