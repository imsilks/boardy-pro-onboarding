
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";

interface TeamNotFoundProps {
  onSkip: () => void;
  onBack: () => void;
}

const TeamNotFound = ({ onSkip, onBack }: TeamNotFoundProps) => {
  return (
    <div className="py-6 flex flex-col items-center justify-center space-y-6">
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
        <Button variant="outline" onClick={onSkip} className="w-full bg-slate-400 hover:bg-slate-300 text-slate-50">
          Skip this step
        </Button>
        
        <Button variant="ghost" className="w-full" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
      </div>
    </div>
  );
};

export default TeamNotFound;
