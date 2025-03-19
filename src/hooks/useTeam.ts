
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
  
  // Helper function to capitalize team names
  const capitalizeTeamName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };
  
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

      // Get the response text first to debug
      const responseText = await response.text();
      console.log("Raw API response:", responseText);
      
      let teamData;
      try {
        // Try to parse the JSON response
        teamData = JSON.parse(responseText);
        console.log("Parsed team data:", teamData);
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        
        // If response is not JSON, try to extract data from plain text
        // The API is returning: "teamId: \nname: " format
        if (responseText.includes('teamId:') && responseText.includes('name:')) {
          const lines = responseText.split('\n');
          const teamId = lines[0].replace('teamId:', '').trim();
          const teamName = lines[1].replace('name:', '').trim();
          
          teamData = {
            id: teamId || slug,
            name: capitalizeTeamName(teamName || slug)
          };
          
          console.log("Extracted team data from text:", teamData);
        } else {
          // If we can't parse the response, create a fallback team object
          teamData = {
            id: slug,
            name: capitalizeTeamName(slug)
          };
        }
      }

      if (teamData && (teamData.id || teamData.name)) {
        setTeam({
          id: teamData.id || slug,
          name: capitalizeTeamName(teamData.name || slug),
          description: teamData.description || "Join your team to collaborate and share your network."
        });
      } else {
        console.log("No team found for this slug, using slug as fallback");
        setTeam({
          id: slug,
          name: capitalizeTeamName(slug),
          description: "Join your team to collaborate and share your network."
        });
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to load team information");
      
      // Create a fallback team object using the slug
      setTeam({
        id: slug,
        name: capitalizeTeamName(slug),
        description: "Join your team to collaborate and share your network."
      });
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (contactId: string) => {
    if (!team) {
      console.error("Cannot join team: No team data available");
      return false;
    }
    
    if (!contactId) {
      console.error("Cannot join team: No contact ID provided");
      return false;
    }
    
    console.log(`Starting join team process: ContactID=${contactId}, TeamID=${team.id}, TeamName=${team.name}`);
    setJoining(true);
    
    try {
      console.log("Sending API request to join team...");

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

      console.log(`API response status: ${updateResponse.status}`);
      
      // Get response text for debugging
      const responseText = await updateResponse.text();
      console.log("Raw API response:", responseText);

      if (!updateResponse.ok) {
        throw new Error(`Failed to update contact with team ID: ${updateResponse.status} - ${responseText}`);
      }

      let updateData;
      try {
        // Try to parse JSON response if available
        updateData = JSON.parse(responseText);
        console.log("Parsed API response:", updateData);
      } catch (parseError) {
        console.log("Response is not JSON format:", responseText);
      }

      console.log(`Successfully joined team: ${team.name}`);
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
