
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Team {
  id: string;
  name: string;
  description?: string;
}

export function useTeam(contactId: string | null, teamName: string) {
  const [team, setTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  
  useEffect(() => {
    if (contactId) {
      fetchTeamData(contactId);
    } else {
      setLoading(false);
    }
  }, [contactId, teamName]);

  const fetchTeamData = async (contactId: string) => {
    try {
      console.log("Fetching team data for contact ID:", contactId);
      console.log("Using team name:", teamName);
      setLoading(true);

      // Call the Make.com webhook to fetch team information
      const response = await fetch("https://hook.us1.make.com/g87troduox4zhgp2fu8x9envk628hpd6", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contactId: contactId,
          teamName: teamName
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
          name: teamData.name || teamName,
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

  const joinTeam = async (contactId: string) => {
    if (!team) {
      return false;
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
          teamName: teamName,
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
