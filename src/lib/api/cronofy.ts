
/**
 * Cronofy calendar integration API functions
 */

import { toast } from "sonner";
import { CRONOFY_BASE_URL } from './config';

/**
 * Get Cronofy auth URL for calendar integration
 */
export const getCronofyAuthUrl = (contactId: string, teamSlug?: string | null): string => {
  try {
    if (!contactId || contactId.trim() === "") {
      console.error("getCronofyAuthUrl called with empty contactId");
      throw new Error("Contact ID is required for calendar connection");
    }
    
    console.log("Creating Cronofy URL with contactId:", contactId, "and teamSlug:", teamSlug);
    
    // Add redirect parameter to return to our app, including the teamSlug if it exists
    const successPath = teamSlug ? `/${teamSlug}/success` : "/success";
    const redirectUrl = encodeURIComponent(window.location.origin + successPath + "?fromCronofy=true&contactId=" + contactId);
    const url = `${CRONOFY_BASE_URL}/${contactId}?redirect=${redirectUrl}`;
    
    console.log("Generated Cronofy URL with redirect:", url);
    return url;
  } catch (error) {
    console.error("Error generating Cronofy URL:", error);
    // Return a fallback URL if there's an error
    const fallbackPath = teamSlug ? `/${teamSlug}/success` : "/success";
    toast.error("Unable to generate calendar connection URL. Please try again.");
    return `${fallbackPath}?contactId=${contactId}`;
  }
};

