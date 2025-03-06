
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
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMTkzOTAsImV4cCI6MjA0NzY5NTM5MH0.F0oWS3trwHiyKkRIrETs3g6-544JMFWwylwdJP4QiYQ"; // This is the updated anon key

// Fetch contact by phone number
export const fetchContactByPhone = async (phone: string): Promise<Contact | null> => {
  try {
    // Format phone number in multiple ways to increase chances of a match
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log("Looking up contact with formatted phone:", formattedPhone);
    
    // Try with formatted phone number - using "Contact" with capital C to match the Prisma schema
    const response = await fetch(`${SUPABASE_URL}/rest/v1/Contact?phone=eq.${encodeURIComponent(formattedPhone)}`, {
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
    
    // Try a second lookup with just digits or different format - using correct table case
    if (digitsOnly.length >= 10) {
      const fallbackResponse = await fetch(`${SUPABASE_URL}/rest/v1/Contact?phone=ilike.*${encodeURIComponent(digitsOnly.slice(-10))}*`, {
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

// Format phone number to international format with "+" followed by country code and number
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Handle different common phone number formats
  if (digitsOnly.length === 10) {
    // US 10-digit number: assume US/Canada (+1)
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    // US 11-digit number with country code: +1XXXXXXXXXX
    return `+${digitsOnly}`;
  } else if (digitsOnly.length > 7) {
    // Could be an international number
    // If it already has a + or starts with a common country code, format accordingly
    if (phone.startsWith('+')) {
      // Already has a plus, just remove non-digits but keep the plus
      return `+${digitsOnly}`;
    } else if (digitsOnly.startsWith('00')) {
      // Some international formats use 00 instead of +
      return `+${digitsOnly.substring(2)}`;
    } else if (digitsOnly.length >= 11) {
      // Likely already has country code
      return `+${digitsOnly}`;
    } else {
      // Assume US/Canada for numbers that don't have a clear international format
      // but are long enough to be phone numbers
      return `+1${digitsOnly}`;
    }
  }
  
  // If we can't determine format but have digits, add a plus
  if (digitsOnly.length > 0) {
    return `+${digitsOnly}`;
  }
  
  // If all else fails, return the original input with a plus
  return `+${digitsOnly}`;
};
