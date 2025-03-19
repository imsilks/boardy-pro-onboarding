
/**
 * Contact-related API functions
 */

import { toast } from "sonner";
import { SUPABASE_URL } from './config';
import { formatPhoneNumber } from './utils';
import { Contact } from './types';
import { supabase } from "@/integrations/supabase/client";

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
    
    // Use the supabase client instead of direct API calls
    // This uses the public anon key which has limited permissions via RLS
    const { data: contacts, error } = await supabase
      .from('Contact')
      .select('*')
      .eq('phone', formattedPhone)
      .limit(1);
      
    if (error) {
      console.error('❌ Supabase API error:', error);
      throw new Error('Failed to fetch contact');
    }

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
    
    // Try a second lookup with just digits or different format
    if (digitsOnly.length >= 10) {
      const { data: fallbackContacts, error: fallbackError } = await supabase
        .from('Contact')
        .select('*')
        .ilike('phone', `%${digitsOnly.slice(-10)}%`)
        .limit(1);
      
      if (fallbackError) {
        console.error('❌ Fallback lookup error:', fallbackError);
      } else if (fallbackContacts && fallbackContacts.length > 0) {
        console.log("✅ Found contact with fallback method, ID:", fallbackContacts[0].id);
        toast.success(`Found your account with alternative lookup! Contact ID: ${fallbackContacts[0].id}`);
        return fallbackContacts[0];
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
