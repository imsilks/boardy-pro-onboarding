
import React from "react";
import { useFadeIn } from "@/lib/animations";

interface TeamHeaderProps {
  title: string;
  subtitle?: string;
}

const TeamHeader = ({ title, subtitle }: TeamHeaderProps) => {
  const fadeInTitle = useFadeIn("down", 100);
  
  return (
    <div className="text-center mb-12" style={fadeInTitle}>
      <div className="inline-flex items-center justify-center p-2 mb-4">
        <img src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" alt="Boardy Pro Logo" className="h-16 w-16 object-contain" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">
        {title}
      </h1>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </div>
  );
};

export default TeamHeader;
