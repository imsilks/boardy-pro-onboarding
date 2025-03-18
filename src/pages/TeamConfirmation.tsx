
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Users, X } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { useContactId } from "@/hooks/useContactId";

interface Team {
  id: string;
  name: string;
  description?: string;
}

const TeamConfirmation = () => {
  const navigate = useNavigate();
  const {
    contactId,
    teamName: urlTeamName,
    loading: contactLoading
  } = useContactId();
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  // Animation states
  const fadeInTitle = useFadeIn("down", 100);
  const fadeInCard = useFadeIn("up", 300);

  useEffect(() => {
    if (contactId && !contactLoading) {
      fetchTeamData(contactId);
    } else if (!contactLoading) {
      setLoading(false);
    }
  }, [contactId, contactLoading]);

  const fetchTeamData = async (contactId: string) => {
    try {
      console.log("Fetching team data for contact ID:", contactId);
      setLoading(true);

      // Call the Make.com webhook to fetch team information
      const response = await fetch("https://hook.us1.make.com/g87troduox4zhgp2fu8x9envk628hpd6", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId,
          teamName: urlTeamName || "Boardy" // Use team name from URL path or default
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch team data: ${response.status}`);
      }

      const teamData = await response.json();
      console.log("Team data response:", teamData);

      if (teamData && teamData.id) {
        setTeam({
          id: teamData.id,
          name: teamData.name || urlTeamName || "Your Team",
          description: teamData.description || "Join your team to collaborate and share your network."
        });
      } else {
        console.log("No team found for this contact");
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team information");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async () => {
    if (!contactId || !team) {
      toast.error("Missing contact or team information");
      return;
    }
    
    setJoining(true);
    try {
      console.log(`Joining team: ${team.name} (${team.id}) for contact: ${contactId}`);

      // First call the Make.com webhook to indicate join action
      const joinResponse = await fetch("https://hook.us1.make.com/g87troduox4zhgp2fu8x9envk628hpd6", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId,
          teamName: team.name,
          action: "join" // Additional parameter to indicate join action
        })
      });

      if (!joinResponse.ok) {
        throw new Error(`Failed to join team: ${joinResponse.status}`);
      }

      // Second, call the new API endpoint to update the user's contact record with the teamId
      console.log(`Adding team ID ${team.id} to contact record for ${contactId}`);
      const updateResponse = await fetch("https://hook.us1.make.com/cpph5cd694479su4mdho8wju163tau6e", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId,
          teamId: team.id
        })
      });

      if (!updateResponse.ok) {
        throw new Error(`Failed to update contact with team ID: ${updateResponse.status}`);
      }

      const updateData = await updateResponse.json();
      console.log("Contact record updated with team ID:", updateData);

      toast.success(`You've joined ${team.name}!`);

      // Navigate to onboarding complete page with path preserving team slug if it exists
      setTimeout(() => {
        const teamPath = urlTeamName ? `/${urlTeamName}` : '';
        navigate(`${teamPath}/onboarding-complete?contactId=${contactId}`);
      }, 500);
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handleSkip = () => {
    toast.info("Skipped joining a team");
    // Preserve team slug in path if it exists
    const teamPath = urlTeamName ? `/${urlTeamName}` : '';
    navigate(`${teamPath}/onboarding-complete${contactId ? `?contactId=${contactId}` : ''}`);
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
            Join Your Team
          </h1>
          <p className="text-lg text-gray-600">Connect and leverage your shared network</p>
        </div>

        {/* Team confirmation card */}
        <div className="w-full" style={fadeInCard}>
          <GlassCard className="p-6 sm:p-8 w-full" intensity="heavy" blur="lg">
            {loading ? <div className="py-16 flex flex-col items-center justify-center">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500">Loading team information...</p>
              </div> : team ? <div className="py-6 flex flex-col items-center justify-center space-y-6">
                <div className="text-blue-500 mb-2">
                  <Users size={64} className="mx-auto" />
                </div>
                
                <div className="w-full space-y-4">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold">{team.name}</h2>
                    {team.description && <p className="text-gray-600">{team.description}</p>}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
                      <p className="text-blue-800">
                        Do you want to join {team.name} team? This will allow you to share your network with your team and to get access to your team's network too.
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4 w-full space-y-3">
                    {joining ? <Button className="w-full" disabled>
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Joining...
                      </Button> : <Button className="w-full" onClick={handleJoinTeam}>
                        <Users size={18} className="mr-2" />
                        Join Team
                      </Button>}
                    
                    <Button variant="outline" onClick={handleSkip} className="w-full bg-slate-400 hover:bg-slate-300 text-slate-50">
                      Skip this step
                    </Button>
                    
                    <Button variant="ghost" className="w-full" onClick={handleBack}>
                      <ArrowLeft size={16} className="mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </div> : <div className="py-6 flex flex-col items-center justify-center space-y-6">
                <div className="text-gray-400 mb-2">
                  <Users size={64} className="mx-auto" />
                </div>
                
                <div className="text-center">
                  <h2 className="text-xl font-medium text-gray-700 mb-2">No Team Found</h2>
                  <p className="text-gray-500">
                    We couldn't find any team associated with your account.
                  </p>
                </div>
                
                <div className="pt-4 w-full space-y-3">
                  <Button variant="outline" onClick={handleSkip} className="w-full bg-slate-400 hover:bg-slate-300 text-slate-50">
                    Skip this step
                  </Button>
                  
                  <Button variant="ghost" className="w-full" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                </div>
              </div>}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">Joining a team will allow you to share your network with your team and for them to also have access to your network.</p>
        </div>
      </div>
    </div>;
};

export default TeamConfirmation;
