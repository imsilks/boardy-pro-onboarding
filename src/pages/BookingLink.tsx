
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ArrowRight, CalendarCheck } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { useContactId } from "@/hooks/useContactId";

const BOOKING_LINK_API_ENDPOINT = "https://hook.us1.make.com/lilxxslc2dg7l3kqvri9ky4a4fjodsdl";

const BookingLink = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Get contactId and teamSlug from useContactId hook
  const { 
    contactId: storedContactId, 
    teamName, 
    getContactId, 
    getTeamSlug,
    updateContactId 
  } = useContactId();
  
  const [bookingLink, setBookingLink] = useState("");
  const [contactId, setContactId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [teamSlug, setTeamSlug] = useState<string | null>(null);

  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    // Get contactId from URL query params or from the useContactId hook
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get("contactId");
    
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
      // Also update it in the hook's state and sessionStorage
      updateContactId(id);
    } else if (storedContactId) {
      console.log("Using contactId from useContactId hook:", storedContactId);
      setContactId(storedContactId);
    } else {
      console.warn("No contactId found in URL or through useContactId");
      toast.error("Contact information is missing");
    }

    // Get and store teamSlug
    const urlTeamSlug = params.teamSlug;
    if (urlTeamSlug) {
      console.log("Found teamSlug in URL parameters:", urlTeamSlug);
      setTeamSlug(urlTeamSlug);
    } else {
      const storedTeamSlug = getTeamSlug();
      console.log("Retrieved teamSlug from storage:", storedTeamSlug);
      setTeamSlug(storedTeamSlug);
    }
  }, [location, storedContactId, params.teamSlug, updateContactId, getTeamSlug]);

  const handleSubmitBookingLink = async () => {
    // First get the latest contactId using multiple sources
    const finalContactId = contactId || getContactId() || storedContactId;
    
    console.log("Submitting with contactId:", finalContactId);
    
    if (!finalContactId) {
      toast.error("Contact ID is missing. Please try again from the beginning.");
      return;
    }
    
    if (bookingLink) {
      // Validate URL format if there's a value
      try {
        new URL(bookingLink);
      } catch (e) {
        toast.error("Please enter a valid URL");
        return;
      }
    }
    
    setSaving(true);
    try {
      if (bookingLink) {
        console.log(`Saving booking link: ${bookingLink} for contact: ${finalContactId}`);

        // Call the API to store the booking link
        const response = await fetch(BOOKING_LINK_API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contactId: finalContactId,
            calendarBookingLink: bookingLink
          })
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("API error response:", errorText);
          throw new Error(`API error: ${response.status} - ${errorText}`);
        }
        
        toast.success("Booking link saved successfully!");
      } else {
        console.log("No booking link provided, skipping save operation");
      }

      // Get the final teamSlug to use in navigation
      const finalTeamSlug = teamSlug || getTeamSlug();
      
      // Include the teamSlug in the navigation if it exists
      const path = finalTeamSlug ? `/${finalTeamSlug}/join-team` : `/join-team`;
      console.log(`Navigating to: ${path}?contactId=${finalContactId}`);
      
      setTimeout(() => {
        navigate(`${path}?contactId=${finalContactId}`);
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

    // Get the final contactId and teamSlug for navigation
    const finalContactId = contactId || getContactId() || storedContactId;
    const finalTeamSlug = teamSlug || getTeamSlug();
    
    // Include the teamSlug in the navigation if it exists
    const path = finalTeamSlug ? `/${finalTeamSlug}/join-team` : `/join-team`;
    
    if (finalContactId) {
      console.log(`Skipping to: ${path}?contactId=${finalContactId}`);
      navigate(`${path}?contactId=${finalContactId}`);
    } else {
      console.log(`Skipping to: ${path} (without contactId)`);
      navigate(path);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        {/* Header section */}
        <div className="text-center mb-12" style={fadeInTitle}>
          <div className="inline-flex items-center justify-center p-2 mb-4">
            <img src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" alt="Boardy Pro Logo" className="h-16 w-16 object-contain" />
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
                    <Input 
                      id="booking-link" 
                      type="url" 
                      placeholder="https://calendly.com/your-link" 
                      value={bookingLink} 
                      onChange={e => setBookingLink(e.target.value)} 
                      className="w-full" 
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Examples: Calendly, Cal.com, or other booking service
                  </p>
                </div>
                
                <div className="pt-4 w-full space-y-3">
                  {saving ? <Button className="w-full" disabled>
                      <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </Button> : <Button className="w-full" onClick={handleSubmitBookingLink}>
                      <CalendarCheck size={18} className="mr-2" />
                      Submit
                    </Button>}
                  
                  <Button variant="outline" onClick={handleSkip} className="w-full text-white bg-slate-400 hover:bg-slate-300">
                    <ArrowRight size={16} className="mr-2" />
                    Skip This Step
                  </Button>
                  
                  <Button variant="ghost" className="w-full" onClick={handleBack}>
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
    </div>;
};

export default BookingLink;
