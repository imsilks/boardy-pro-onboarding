
/**
 * LinkedIn-related API functions
 */

import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload LinkedIn connections CSV for a specific contact
 */
export const uploadLinkedInConnections = async (contactId: string, file: File): Promise<boolean> => {
  try {
    console.log(`Uploading LinkedIn connections for contact ID: ${contactId}`);
    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);
    
    // Get current user session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session || !session.access_token) {
      console.error("No active session found");
      throw new Error("Authentication error: Please log in and try again");
    }
    
    console.log("Session found, access token available");
    
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Log FormData entries for debugging
    console.log("Form data entries:");
    for(let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1] instanceof File ? 'File object' : pair[1]}`);
    }
    
    // Call our secure Supabase Edge Function with the auth token
    const { data, error } = await supabase.functions.invoke('linkedin-import/' + contactId, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type here; browser will set it with boundary for multipart/form-data
      headers: { 
        'Authorization': `Bearer ${session.access_token}` 
      },
    });
    
    if (error) {
      console.error(`Upload failed:`, error);
      
      // Check for authentication errors
      if (error.message && (
          error.message.includes("JWT") || 
          error.message.includes("401") || 
          error.message.includes("auth") || 
          error.message.includes("Authentication")
      )) {
        throw new Error("Authentication error: Please log in and try again");
      }
      
      throw new Error(`Edge function error: ${error.message || 'Unknown error'}`);
    }
    
    console.log("Successful upload response:", data);
    return true;
  } catch (error) {
    console.error("Error uploading LinkedIn connections:", error);
    throw error;
  }
};
