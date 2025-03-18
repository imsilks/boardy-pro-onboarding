
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  description?: string;
}

export function useTeam(contactId: string | null, slug: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  useEffect(() => {
    if (slug) {
      fetchTeamData(slug);
    } else {
      setLoading(false);
    }
  }, [slug]);

  const fetchTeamData = async (slug: string) => {
    try {
      console.log("Fetching team data for slug:", slug);
      setLoading(true);

      // Call the Make.com webhook with the team slug
      const response = await fetch("https://hook.us1.make.com/g87troduox4zhgp2fu8x9envk628hpd6", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          slug: slug
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
          name: teamData.name || slug,
          description: teamData.description || "Join your team to collaborate and share your network."
        });
      } else {
        console.log("No team found for this slug");
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team information");
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (contactId: string) => {
    if (!team) {
      return false;
    }
    
    setJoining(true);
    try {
      console.log(`Joining team: ${team.name} (${team.id}) for contact: ${contactId}`);

      // Call the Make.com webhook to update the user's contact record with the teamId
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
      return true;
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error("Failed to join team. Please try again.");
      return false;
    } finally {
      setJoining(false);
    }
  };

  return {
    team,
    loading,
    joining,
    joinTeam
  };
}
