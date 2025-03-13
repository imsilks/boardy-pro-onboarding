
import React from "react";

interface HeaderSectionProps {
  fadeInTitle: React.CSSProperties;
  fadeInSubtitle: React.CSSProperties;
}

const HeaderSection = ({
  fadeInTitle,
  fadeInSubtitle
}: HeaderSectionProps) => {
  return (
    <div className="text-center mb-12" style={fadeInTitle}>
      <div className="inline-flex items-center justify-center p-2 mb-4">
        <img src="/lovable-uploads/2c9ac40a-e01b-418a-91b7-724008309d66.png" alt="Boardy Pro Logo" className="h-16 w-16 object-contain" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-3">Boardy Pro</h1>
    </div>
  );
};

export default HeaderSection;
