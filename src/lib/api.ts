
import { toast } from "sonner";

// Types for our API
export interface Contact {
  id: string;
  phone: string;
  // Add other fields as needed
}

// Base URLs for our APIs
const SUPABASE_URL = "https://zprsisdofgrlsgcmtlgj-rr-us-east-1-jkjqy.supabase.co";
const CRONOFY_BASE_URL = "https://boardy-server-v36-production.up.railway.app/api/cronofy/auth";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqLXJyLXVzLWVhc3QtMS1qa2pxeSIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzE5MTEzNDQ2LCJleHAiOjIwMzQ2ODk0NDZ9.Xa2Zd-qxMX_T34u_AuYWgbB61R1-qx8TkAVb2aJDY0E"; // This is a public anon key

// Fetch contact by phone number
export const fetchContactByPhone = async (phone: string): Promise<Contact | null> => {
  try {
    // Format phone number in multiple ways to increase chances of a match
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log("Looking up contact with formatted phone:", formattedPhone);
    
    // Try with formatted phone number
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact?phone=eq.${encodeURIComponent(formattedPhone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      },
    });

    if (!response.ok) {
      console.error('Supabase API error:', response.status, await response.text());
      throw new Error('Failed to fetch contact');
    }

    const contacts = await response.json();
    console.log("Supabase returned contacts:", contacts);
    
    if (contacts && contacts.length > 0) {
      return contacts[0];
    }
    
    // If not found with formatted phone, try a fallback approach with just the digits
    const digitsOnly = phone.replace(/\D/g, '');
    console.log("Trying fallback with digits only:", digitsOnly);
    
    // Try a second lookup with just digits or different format
    if (digitsOnly.length >= 10) {
      const fallbackResponse = await fetch(`${SUPABASE_URL}/rest/v1/contact?phone=ilike.*${encodeURIComponent(digitsOnly.slice(-10))}*`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_API_KEY,
          'Authorization': `Bearer ${SUPABASE_API_KEY}`,
        },
      });
      
      if (fallbackResponse.ok) {
        const fallbackContacts = await fallbackResponse.json();
        console.log("Fallback search returned:", fallbackContacts);
        if (fallbackContacts && fallbackContacts.length > 0) {
          return fallbackContacts[0];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching contact:', error);
    toast.error('Failed to find your contact information');
    return null;
  }
};

// Get Cronofy auth URL
export const getCronofyAuthUrl = (contactId: string): string => {
  return `${CRONOFY_BASE_URL}/${contactId}`;
};

// Format phone number to E.164 format
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Handle different common phone number formats
  if (digitsOnly.length === 10) {
    // US 10-digit number: +1XXXXXXXXXX
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    // US 11-digit number with country code: +1XXXXXXXXXX
    return `+${digitsOnly}`;
  } else if (digitsOnly.length > 10) {
    // International number with country code
    return `+${digitsOnly}`;
  }
  
  // Return original digits if we can't determine format
  return `+${digitsOnly}`;
};
