
/**
 * API client for contact lookup
 * This file contains functions for interacting with the backend API
 */
import { toast } from "sonner";
import { fetchContactByPhone } from "@/lib/api";

export interface ContactLookupResponse {
  id: string;
  phone?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  success: boolean;
  message?: string;
}

/**
 * Fetch contact by phone number using external API endpoint with fallback to Supabase
 */
export const fetchContactByPhoneSecure = async (phone: string): Promise<ContactLookupResponse | null> => {
  try {
    console.log("🔍 Looking up contact with phone via API:", phone);
    
    // Provide user feedback
    toast.info(`Looking up account for ${phone}...`);
    
    // Normalize phone number to remove non-digit characters
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // First try the external API
    try {
      // Construct the API URL with the phone number
      const apiUrl = `https://boardy-server-v36-production.up.railway.app/contact?phone=${encodeURIComponent(phone)}`;
      console.log("🔗 Making API request to:", apiUrl);
      
      // Make the API request with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (response.ok) {
        // Parse the response
        const contactData = await response.json();
        console.log("📋 External API returned data:", contactData);
        
        if (contactData && contactData.id) {
          console.log("✅ Found contact with ID:", contactData.id);
          toast.success(`Found your account! ${contactData.fullName ? `Hello, ${contactData.fullName}!` : ''}`);
          return {
            success: true,
            id: contactData.id,
            phone: contactData.phone,
            fullName: contactData.fullName,
            firstName: contactData.firstName,
            lastName: contactData.lastName,
            email: contactData.email
          };
        }
      }
      
      console.log("🔄 External API failed, trying Supabase fallback...");
    } catch (error) {
      console.log("🔄 External API error, trying Supabase fallback...", error);
    }
    
    // If external API fails or returns no results, fall back to Supabase
    const supabaseResult = await fetchContactByPhone(phone);
    
    if (supabaseResult) {
      console.log("✅ Found contact in Supabase with ID:", supabaseResult.id);
      toast.success(`Found your account! ${supabaseResult.fullName ? `Hello, ${supabaseResult.fullName}!` : ''}`);
      
      return {
        success: true,
        id: supabaseResult.id,
        phone: supabaseResult.phone,
        fullName: supabaseResult.fullName
      };
    }
    
    // No contact found in either API or Supabase
    console.log("❌ No contact found for phone number:", phone);
    toast.error("No account found with this phone number");
    return null;
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    toast.error('Failed to find your contact information');
    return null;
  }
};
