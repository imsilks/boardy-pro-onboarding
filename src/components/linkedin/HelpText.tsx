
import React from "react";

const HelpText: React.FC = () => {
  return (
    <p className="text-center text-xs text-gray-500 mt-6">
      Need help exporting your LinkedIn connections? 
      <a href="https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data" target="_blank" rel="noopener noreferrer" className="text-primary ml-1 hover:underline">
        View LinkedIn guide
      </a>
    </p>
  );
};

export default HelpText;
