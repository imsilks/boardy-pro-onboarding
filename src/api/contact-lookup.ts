
/**
 * API client for contact lookup
 * This file contains functions for interacting with the backend API
 */
import { toast } from "sonner";

export interface ContactLookupResponse {
  id: string;
  phone?: string;
  fullName?: string;
  success: boolean;
  message?: string;
}

/**
 * Fetch contact by phone number using secure backend API
 */
export const fetchContactByPhoneSecure = async (phone: string): Promise<ContactLookupResponse | null> => {
  try {
    console.log("🔍 Looking up contact with phone via secure API:", phone);
    
    // Provide more user feedback
    toast.info(`Looking up account for ${phone}...`);
    
    // Call our secure API endpoint instead of direct Supabase access
    const response = await fetch(`/api/contact-lookup?phone=${encodeURIComponent(phone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      console.error('❌ API error:', response.status, await response.text());
      throw new Error('Failed to fetch contact');
    }

    const data = await response.json();
    console.log("📋 API returned contact data:", data);
    
    if (data && data.success) {
      console.log("✅ Found contact with ID:", data.id);
      toast.success(`Found your account! Contact ID: ${data.id}`);
      return data;
    } else {
      console.log("❌ No contact found:", data.message);
      toast.error(data.message || "No account found with this phone number");
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    toast.error('Failed to find your contact information');
    return null;
  }
};
