
/**
 * Contact-related API functions
 */

import { toast } from "sonner";
import { SUPABASE_URL, SUPABASE_API_KEY } from './config';
import { formatPhoneNumber } from './utils';
import { Contact } from './types';

/**
 * Fetch contact by phone number
 */
export const fetchContactByPhone = async (phone: string): Promise<Contact | null> => {
  try {
    // Format phone number in multiple ways to increase chances of a match
    const formattedPhone = formatPhoneNumber(phone);
    
    console.log("🔍 Looking up contact with phone:", phone);
    console.log("🔄 Formatted phone for lookup:", formattedPhone);
    
    // Provide more user feedback
    toast.info(`Looking up account for ${formattedPhone}...`);
    
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
      console.error('❌ Supabase API error:', response.status, await response.text());
      throw new Error('Failed to fetch contact');
    }

    const contacts = await response.json();
    console.log("📋 Supabase returned contacts:", contacts);
    
    if (contacts && contacts.length > 0) {
      console.log("✅ Found contact with ID:", contacts[0].id);
      toast.success(`Found your account! Contact ID: ${contacts[0].id}`);
      return contacts[0];
    }
    
    // If not found with formatted phone, try a fallback approach with just the digits
    const digitsOnly = phone.replace(/\D/g, '');
    console.log("🔄 Trying fallback with digits only:", digitsOnly);
    toast.info("First lookup failed, trying alternative format...");
    
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
        console.log("🔍 Fallback search returned:", fallbackContacts);
        
        if (fallbackContacts && fallbackContacts.length > 0) {
          console.log("✅ Found contact with fallback method, ID:", fallbackContacts[0].id);
          toast.success(`Found your account with alternative lookup! Contact ID: ${fallbackContacts[0].id}`);
          return fallbackContacts[0];
        }
      }
    }
    
    console.log("❌ No contact found for phone number:", phone);
    toast.error("No account found with this phone number");
    return null;
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    toast.error('Failed to find your contact information');
    return null;
  }
};
