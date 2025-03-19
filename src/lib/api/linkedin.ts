
/**
 * LinkedIn-related API functions
 */

import { toast } from "sonner";

/**
 * Upload LinkedIn connections CSV for a specific contact
 */
export const uploadLinkedInConnections = async (contactId: string, file: File): Promise<boolean> => {
  try {
    console.log(`Uploading LinkedIn connections for contact ID: ${contactId}`);
    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);
    
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('file', file);
    
    // Log FormData entries for debugging
    console.log("Form data entries:");
    for(let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1] instanceof File ? 'File object' : pair[1]}`);
    }
    
    // Direct call to the Railway API without authentication
    const response = await fetch(`https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin/${contactId}`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type here; browser will set it with boundary for multipart/form-data
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Upload failed with status ${response.status}:`, errorText);
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log("Successful upload response:", data);
    return true;
  } catch (error) {
    console.error("Error uploading LinkedIn connections:", error);
    throw error;
  }
};
