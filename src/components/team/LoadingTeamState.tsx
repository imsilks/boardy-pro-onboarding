
import React from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

const LoadingTeamState = () => {
  return (
    <div className="py-16 flex flex-col items-center justify-center">
      <LoadingSpinner size="md" className="mb-4" />
      <p className="text-gray-500">Loading team information...</p>
    </div>
  );
};

export default LoadingTeamState;
