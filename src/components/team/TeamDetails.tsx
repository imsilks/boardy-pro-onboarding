
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description?: string;
}

interface TeamDetailsProps {
  team: Team;
  joining: boolean;
  onJoin: () => void;
  onSkip: () => void;
  onBack: () => void;
}

const TeamDetails = ({ team, joining, onJoin, onSkip, onBack }: TeamDetailsProps) => {
  // Ensure team name is capitalized
  const displayTeamName = team.name.charAt(0).toUpperCase() + team.name.slice(1);
  
  return (
    <div className="py-6 flex flex-col items-center justify-center space-y-6">
      <div className="text-blue-500 mb-2">
        <Users size={64} className="mx-auto" />
      </div>
      
      <div className="w-full space-y-4">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold">{displayTeamName}</h2>
          {team.description && <p className="text-gray-600">{team.description}</p>}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mt-4">
            <p className="text-blue-800">
              Do you want to join the {displayTeamName} team? This will allow you to share your network with your team and to get access to your team's network too.
            </p>
          </div>
        </div>
        
        <div className="pt-4 w-full space-y-3">
          {joining ? (
            <Button className="w-full" disabled>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Joining...
            </Button>
          ) : (
            <Button className="w-full" onClick={onJoin}>
              <Users size={18} className="mr-2" />
              Join Team
            </Button>
          )}
          
          <Button variant="outline" onClick={onSkip} className="w-full bg-slate-400 hover:bg-slate-300 text-slate-50">
            Skip this step
          </Button>
          
          <Button variant="ghost" className="w-full" onClick={onBack}>
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamDetails;
