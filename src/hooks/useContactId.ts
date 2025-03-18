
import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'sonner';

/**
 * Hook to manage contactId and teamSlug persistence across the application
 * Gets contactId from URL params or sessionStorage and keeps it in sync
 * Also extracts team name from URL path if available
 */
export function useContactId() {
  const location = useLocation();
  const params = useParams();
  const [contactId, setContactId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for teamSlug in URL params first
    const urlTeamSlug = params.teamSlug;
    
    if (urlTeamSlug) {
      // Save teamSlug to sessionStorage
      sessionStorage.setItem("boardyTeamSlug", urlTeamSlug);
      console.log("Stored/updated teamSlug in sessionStorage:", urlTeamSlug);
      setTeamName(urlTeamSlug);
    } else {
      // Try to get from sessionStorage if not in URL
      const storedTeamSlug = sessionStorage.getItem("boardyTeamSlug");
      if (storedTeamSlug) {
        console.log("Retrieved teamSlug from sessionStorage:", storedTeamSlug);
        setTeamName(storedTeamSlug);
      } else {
        // Extract team name from path if it exists (legacy approach as fallback)
        // Format: /creandum/join-team or /creandum/whatever
        const pathSegments = location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0 && !['join-team', 'booking-link', 'onboarding-complete', 'success'].includes(pathSegments[0])) {
          // First segment is likely a team name
          setTeamName(pathSegments[0]);
          sessionStorage.setItem("boardyTeamSlug", pathSegments[0]);
          console.log("Extracted and stored team name from URL path:", pathSegments[0]);
        }
      }
    }

    // Get contactId from URL query params
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("contactId");
    
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
  }, [location, params]);

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

  // Function to get the current teamSlug (from state or session storage)
  const getTeamSlug = (): string | null => {
    if (teamName) return teamName;
    return sessionStorage.getItem("boardyTeamSlug");
  };

  // Function to update the teamSlug in both state and session storage
  const updateTeamSlug = (slug: string) => {
    if (slug) {
      setTeamName(slug);
      sessionStorage.setItem("boardyTeamSlug", slug);
      console.log("Updated teamSlug:", slug);
    }
  };

  return {
    contactId,
    teamName,
    loading,
    getContactId,
    updateContactId,
    getTeamSlug,
    updateTeamSlug
  };
}
