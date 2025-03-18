
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook to manage contactId persistence across the application
 * Gets contactId from URL params or sessionStorage and keeps it in sync
 * Also extracts team name from URL path if available
 */
export function useContactId() {
  const location = useLocation();
  const [contactId, setContactId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Extract team name from path if it exists
    // Format: /creandum/join-team or /creandum/whatever
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0 && !['join-team', 'booking-link', 'onboarding-complete', 'success'].includes(pathSegments[0])) {
      // First segment is likely a team name
      setTeamName(pathSegments[0]);
      console.log("Extracted team name from URL path:", pathSegments[0]);
    }

    // Get contactId from URL query params
    const params = new URLSearchParams(location.search);
    const id = params.get("contactId");
    
    if (id) {
      console.log("Found contactId in URL:", id);
      setContactId(id);
      // Store in sessionStorage for subsequent pages
      sessionStorage.setItem("boardyContactId", id);
      console.log("Stored/updated contactId in sessionStorage:", id);
    } else {
      // Try to get from sessionStorage if not in URL
      const storedId = sessionStorage.getItem("boardyContactId");
      if (storedId) {
        console.log("Retrieved contactId from sessionStorage:", storedId);
        setContactId(storedId);
      } else {
        console.warn("No contactId found in URL or sessionStorage");
        // Only show toast error if we're not on the homepage or success page
        if (location.pathname !== '/' && location.pathname !== '/success') {
          toast.error("Contact information is missing");
        }
      }
    }
    
    setLoading(false);
  }, [location]);

  // Function to get the current contactId (from state or session storage)
  const getContactId = (): string | null => {
    if (contactId) return contactId;
    return sessionStorage.getItem("boardyContactId");
  };

  // Function to update the contactId in both state and session storage
  const updateContactId = (id: string) => {
    if (id) {
      setContactId(id);
      sessionStorage.setItem("boardyContactId", id);
      console.log("Updated contactId:", id);
    }
  };

  return {
    contactId,
    teamName,
    loading,
    getContactId,
    updateContactId
  };
}
