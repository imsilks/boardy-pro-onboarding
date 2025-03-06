
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
    const formattedPhone = formatPhoneNumber(phone);
    
    // Updated from 'contacts' to 'contact' to match the table name in Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/contact?phone=eq.${encodeURIComponent(formattedPhone)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_API_KEY,
        'Authorization': `Bearer ${SUPABASE_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch contact');
    }

    const contacts = await response.json();
    if (contacts && contacts.length > 0) {
      return contacts[0];
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
  
  // If phone doesn't have country code, add US default (+1)
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length > 10 && !digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else if (digitsOnly.length > 10 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  }
  
  // Return original digits if we can't determine format
  return digitsOnly;
};
