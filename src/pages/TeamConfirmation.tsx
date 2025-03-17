
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GlassCard from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Users, X } from "lucide-react";
import { useFadeIn } from "@/lib/animations";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// API endpoint for fetching team information
const TEAM_API_ENDPOINT = "https://zprsisdofgrlsgcmtlgj.supabase.co/rest/v1/Team";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMTkzOTAsImV4cCI6MjA0NzY5NTM5MH0.F0oWS3trwHiyKkRIrETs3g6-544JMFWwylwdJP4QiYQ";

interface Team {
  id: string;
  name: string;
  description?: string;
}

const TeamConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [contactId, setContactId] = useState<string | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

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
      // Store in sessionStorage for subsequent pages
      sessionStorage.setItem("boardyContactId", id);
      console.log("Stored/updated contactId in sessionStorage:", id);
      fetchTeamData(id);
    } else {
      // Try to get from sessionStorage if not in URL
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
        fetchTeamData(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
        toast.error("Contact information is missing");
        setLoading(false);
      }
    }
  }, [location]);

  const fetchTeamData = async (contactId: string) => {
    try {
      console.log("Fetching team data for contact ID:", contactId);

      // Fetch team data associated with the contactId
      const response = await fetch(`${TEAM_API_ENDPOINT}?contact_id=eq.${encodeURIComponent(contactId)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch team data: ${response.status}`);
      }
      const teams = await response.json();
      console.log("Team data response:", teams);
      if (teams && teams.length > 0) {
        setTeam(teams[0]);
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
    // Ensure we always try to get the latest contactId from sessionStorage as fallback
    const idToUse = contactId || sessionStorage.getItem("boardyContactId");
    
    if (!idToUse || !team) {
      toast.error("Missing contact or team information");
      return;
    }
    
    setJoining(true);
    try {
      // Here we'd save the team membership to the database
      console.log(`Joining team: ${team.name} (${team.id}) for contact: ${idToUse}`);

      // Simulate API call to join the team
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`You've joined ${team.name}!`);

      // Navigate to dashboard
      setTimeout(() => {
        navigate("/dashboard");
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
    navigate("/dashboard");
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
                    
                    <Button variant="outline" className="w-full" onClick={handleSkip}>
                      <X size={16} className="mr-2" />
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
                  <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
                    Continue to Dashboard
                  </Button>
                  
                  <Button variant="ghost" className="w-full" onClick={handleBack}>
                    <ArrowLeft size={16} className="mr-2" />
                    Back
                  </Button>
                </div>
              </div>}
          </GlassCard>
          
          <p className="mt-6 text-center text-sm text-gray-500 animate-fade-in">
            Joining a team will allow you to collaborate with others
          </p>
        </div>
      </div>
    </div>;
};

export default TeamConfirmation;
