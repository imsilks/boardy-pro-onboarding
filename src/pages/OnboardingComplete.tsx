
import React, { useEffect, useState } from "react";
import GlassCard from "@/components/GlassCard";
import { CheckCircle } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { useContactId } from "@/hooks/useContactId";
import TeamHeader from "@/components/team/TeamHeader";

const OnboardingComplete = () => {
  const {
    contactId,
    teamName,
    loading: contactLoading
  } = useContactId();
  const [updating, setUpdating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const fadeInCard = useFadeIn("up", 300);
  
  useEffect(() => {
    // Only attempt to update pro status if we have a contactId
    if (contactId && !contactLoading) {
      updateProStatus(contactId);
    }
  }, [contactId, contactLoading]);
  
  const updateProStatus = async (contactId: string) => {
    setUpdating(true);
    try {
      console.log("Updating pro status for contact ID:", contactId);

      // Call the Make.com webhook to update isProUser from FALSE to TRUE
      const response = await fetch("https://hook.us1.make.com/1hafbx8w1vqw5koxa6bslbsjw2sdadic", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId
        })
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
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
  
  // Get the team name for display - ensure it's capitalized
  const displayTeamName = teamName ? ` for ${teamName.charAt(0).toUpperCase() + teamName.slice(1)}` : '';
  
  return <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        <TeamHeader 
          title="Setup Complete" 
          subtitle={`Your Boardy Pro account${displayTeamName} is ready to use`} 
        />

        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {updating || contactLoading ? <div className="py-16 flex flex-col items-center justify-center">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Activating your Pro account...</p>
              </div> : <div className="py-6 flex flex-col items-center justify-center space-y-6">
                <div className="text-green-500 mb-2">
                  <CheckCircle size={64} className="mx-auto" />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold mb-2">
                    Congratulations!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your Boardy Pro account{displayTeamName} has been successfully set up and activated.
                  </p>
                </div>
              </div>}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">If you have any questions, please contact silka@boardy.ai</p>
        </div>
      </div>
    </div>;
};

export default OnboardingComplete;
