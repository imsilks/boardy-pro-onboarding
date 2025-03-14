/**
 * API client for contact lookup
 * This file contains functions for interacting with the backend API
 */
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface ContactLookupResponse {
  id: string;
  phone?: string;
  fullName?: string;
  success: boolean;
  message?: string;
}

/**
 * Fetch contact by phone number using Supabase database
 */
export const fetchContactByPhoneSecure = async (phone: string): Promise<ContactLookupResponse | null> => {
  try {
    console.log("🔍 Looking up contact with phone via Supabase API:", phone);
    
    // Provide more user feedback
    toast.info(`Looking up account for ${phone}...`);
    
    // Format phone number for lookup - just keep the digits
    const normalizedPhone = phone.replace(/\D/g, '');
    console.log("🔄 Normalized phone for lookup:", normalizedPhone);
    
    // First, try with the exact phone format
    let { data: contacts, error } = await supabase
      .from('Contact')
      .select('id, phone, fullName')
      .eq('phone', phone)
      .limit(1);
      
    if (error) {
      console.error('❌ Supabase error:', error);
      toast.error('Database error. Please try again.');
      return null;
    }
    
    // If no exact match, try with normalized phone number
    if (!contacts || contacts.length === 0) {
      console.log("📱 No exact match found, trying with normalized number");
      
      // For partial matches, we'll look for phone numbers where the end digits match
      const { data: fallbackContacts, error: fallbackError } = await supabase
        .from('Contact')
        .select('id, phone, fullName')
        .or(`phone.ilike.%${normalizedPhone}%,phone.ilike.%${normalizedPhone.slice(-10)}%`)
        .limit(1);
        
      if (fallbackError) {
        console.error('❌ Supabase fallback error:', fallbackError);
        toast.error('Database error during fallback lookup. Please try again.');
        return null;
      }
      
      contacts = fallbackContacts;
    }
    
    console.log("📋 Supabase returned contacts:", contacts);
    
    if (contacts && contacts.length > 0) {
      console.log("✅ Found contact with ID:", contacts[0].id);
      toast.success(`Found your account! Contact ID: ${contacts[0].id}`);
      return {
        success: true,
        id: contacts[0].id,
        phone: contacts[0].phone,
        fullName: contacts[0].fullName
      };
    } else {
      console.log("❌ No contact found for phone number:", phone);
      toast.error("No account found with this phone number");
      return null;
    }
  } catch (error) {
    console.error('❌ Error fetching contact:', error);
    toast.error('Failed to find your contact information');
    return null;
  }
};
