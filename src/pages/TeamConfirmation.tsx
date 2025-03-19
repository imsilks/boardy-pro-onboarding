
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { useContactId } from "@/hooks/useContactId";
import { useTeam } from "@/hooks/useTeam";
import TeamHeader from "@/components/team/TeamHeader";
import LoadingTeamState from "@/components/team/LoadingTeamState";
import TeamNotFound from "@/components/team/TeamNotFound";
import TeamDetails from "@/components/team/TeamDetails";

const TeamConfirmation = () => {
  const navigate = useNavigate();
  const params = useParams();
  const teamSlug = params.teamSlug;
  
  const {
    contactId,
    loading: contactLoading,
    getContactId
  } = useContactId();
  
  // Pass the teamSlug directly to useTeam instead of teamName
  const { team, loading, joining, joinTeam } = useTeam(
    contactId, 
    teamSlug || ""
  );

  // Animation states
  const fadeInCard = useFadeIn("up", 300);

  const handleJoinTeam = async () => {
    // Get the latest contactId using multiple sources to ensure we have it
    const finalContactId = contactId || getContactId();
    
    console.log("Join team button clicked. Contact ID:", finalContactId);
    
    if (!finalContactId) {
      console.error("Missing contact information for join team");
      toast.error("Missing contact information");
      return;
    }
    
    try {
      console.log(`Attempting to join team with contactId: ${finalContactId}`);
      const success = await joinTeam(finalContactId);
      
      if (success) {
        console.log("Join team successful, preparing for navigation");
        // Navigate to onboarding complete page with path preserving team slug if it exists
        setTimeout(() => {
          try {
            const teamPath = teamSlug ? `/${teamSlug}` : '';
            const navigatePath = `${teamPath}/onboarding-complete?contactId=${finalContactId}`;
            console.log(`Navigating to: ${navigatePath}`);
            navigate(navigatePath);
          } catch (navError) {
            console.error("Navigation error:", navError);
            // Fallback navigation if the path with teamSlug fails
            navigate(`/onboarding-complete?contactId=${finalContactId}`);
          }
        }, 500);
      } else {
        console.log("Join team returned false, not navigating");
      }
    } catch (error) {
      console.error("Error in handleJoinTeam:", error);
      toast.error("An error occurred while joining the team");
    }
  };

  const handleSkip = () => {
    toast.info("Skipped joining a team");
    try {
      // Preserve team slug in path if it exists
      const teamPath = teamSlug ? `/${teamSlug}` : '';
      const contactParam = contactId ? `?contactId=${contactId}` : '';
      const navigatePath = `${teamPath}/onboarding-complete${contactParam}`;
      console.log(`Skipping team join, navigating to: ${navigatePath}`);
      navigate(navigatePath);
    } catch (navError) {
      console.error("Navigation error during skip:", navError);
      // Fallback navigation
      navigate('/onboarding-complete');
    }
  };

  const handleBack = () => {
    console.log("Going back to previous page");
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100/40 via-transparent to-transparent opacity-70" />
      
      <div className="relative w-full max-w-md flex flex-col items-center z-10">
        {/* Header section */}
        <TeamHeader 
          title="Join Your Team" 
          subtitle="Connect and leverage your shared network" 
        />

        {/* Team confirmation card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {loading ? (
              <LoadingTeamState />
            ) : team ? (
              <TeamDetails
                team={team}
                joining={joining}
                onJoin={handleJoinTeam}
                onSkip={handleSkip}
                onBack={handleBack}
              />
            ) : (
              <TeamNotFound 
                onSkip={handleSkip}
                onBack={handleBack}
              />
            )}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            Joining a team will allow you to share your network with your team and for them to also have access to your network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamConfirmation;
