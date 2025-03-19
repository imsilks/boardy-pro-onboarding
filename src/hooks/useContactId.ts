
import { useState, useEffect, useCallback } from 'react';
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
    // Store the current path in sessionStorage to track entry point
    const currentPath = location.pathname;
    const storedEntryPath = sessionStorage.getItem("boardyEntryPath");
    
    if (!storedEntryPath) {
      // This is the first page the user is visiting
      sessionStorage.setItem("boardyEntryPath", currentPath);
      console.log("Stored initial entry path:", currentPath);
    }
    
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

    // Get contactId from URL query params first
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("contactId");
    
    // Next try to get from sessionStorage if not in URL
    const storedId = sessionStorage.getItem("boardyContactId");
    
    console.log(`ContactId in URL: ${id}, in sessionStorage: ${storedId}`);
    
    if (id) {
      console.log("Found contactId in URL, updating state and storage:", id);
      setContactId(id);
      // Store in sessionStorage for subsequent pages or after redirects
      sessionStorage.setItem("boardyContactId", id);
    } else if (storedId) {
      console.log("Retrieved contactId from sessionStorage:", storedId);
      setContactId(storedId);
    } else {
      console.log("No contactId found in URL or sessionStorage");
      
      // Determine if we're on a page that should NOT show the error toast
      const isInitialPhonePage = 
        location.pathname === '/' || 
        location.pathname === '/index' || 
        location.pathname === '' ||
        // Check if the pathname is just a team slug (e.g., /creandum)
        (location.pathname.split('/').filter(Boolean).length === 1 && !location.pathname.includes('success'));
      
      // Only show toast error on pages that require a contactId and aren't entry points
      if (!isInitialPhonePage && 
          location.pathname !== '/success' && 
          !location.pathname.endsWith('/join-team')) {
        toast.error("Contact information is missing");
      }
    }
    
    setLoading(false);
  }, [location, params]);

  // Function to get the current contactId (from state or session storage)
  const getContactId = useCallback((): string | null => {
    // Always prioritize session storage for most reliable value
    const storedId = sessionStorage.getItem("boardyContactId");
    if (storedId) return storedId;
    return contactId;
  }, [contactId]);

  // Function to update the contactId in both state and session storage
  const updateContactId = useCallback((id: string) => {
    if (id) {
      setContactId(id);
      sessionStorage.setItem("boardyContactId", id);
      console.log("Updated contactId in both state and sessionStorage:", id);
    }
  }, []);

  // Function to get the current teamSlug (from state or session storage)
  const getTeamSlug = useCallback((): string | null => {
    // Always prioritize session storage for most reliable value
    const storedSlug = sessionStorage.getItem("boardyTeamSlug");
    if (storedSlug) return storedSlug;
    return teamName;
  }, [teamName]);

  // Function to update the teamSlug in both state and session storage
  const updateTeamSlug = useCallback((slug: string) => {
    if (slug) {
      setTeamName(slug);
      sessionStorage.setItem("boardyTeamSlug", slug);
      console.log("Updated teamSlug in both state and sessionStorage:", slug);
    }
  }, []);

  // Get the original entry path (useful for knowing where the user started)
  const getEntryPath = useCallback((): string | null => {
    return sessionStorage.getItem("boardyEntryPath");
  }, []);

  return {
    contactId,
    teamName,
    loading,
    getContactId,
    updateContactId,
    getTeamSlug,
    updateTeamSlug,
    getEntryPath
  };
}
