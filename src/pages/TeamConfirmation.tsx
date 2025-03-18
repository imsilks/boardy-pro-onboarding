
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
    teamName: urlTeamName,
    loading: contactLoading
  } = useContactId();
  
  // Use teamSlug from URL params if available, otherwise fall back to the one extracted in useContactId
  const effectiveTeamName = teamSlug || urlTeamName || "Boardy";
  
  const { team, loading, joining, joinTeam } = useTeam(
    contactId, 
    effectiveTeamName
  );

  // Animation states
  const fadeInCard = useFadeIn("up", 300);

  const handleJoinTeam = async () => {
    if (!contactId) {
      toast.error("Missing contact information");
      return;
    }
    
    const success = await joinTeam(contactId);
    
    if (success) {
      // Navigate to onboarding complete page with path preserving team slug if it exists
      setTimeout(() => {
        const teamPath = teamSlug ? `/${teamSlug}` : '';
        navigate(`${teamPath}/onboarding-complete?contactId=${contactId}`);
      }, 500);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped joining a team");
    // Preserve team slug in path if it exists
    const teamPath = teamSlug ? `/${teamSlug}` : '';
    navigate(`${teamPath}/onboarding-complete${contactId ? `?contactId=${contactId}` : ''}`);
  };

  const handleBack = () => {
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
