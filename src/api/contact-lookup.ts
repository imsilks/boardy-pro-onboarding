
/**
 * API client for contact lookup
 * This file contains functions for interacting with the backend API
 */
import { toast } from "sonner";

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

// Mock data for development mode
const mockContacts: ContactLookupResponse[] = [
  {
    id: "mock-contact-1",
    phone: "+14168217689",
    fullName: "John Doe",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    success: true
  },
  {
    id: "mock-contact-2",
    phone: "+12345678901",
    fullName: "Jane Smith",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    success: true
  }
];

/**
 * Fetch contact by phone number using external API endpoint
 */
export const fetchContactByPhoneSecure = async (phone: string): Promise<ContactLookupResponse | null> => {
  try {
    console.log("🔍 Looking up contact with phone via API:", phone);
    
    // Provide user feedback
    toast.info(`Looking up account for ${phone}...`);
    
    // Normalize phone number to remove non-digit characters for checking
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Construct the API URL with the phone parameter
    // Use the original phone format in the URL parameter as the server expects it
    const apiUrl = `https://boardy-server-v36-production.up.railway.app/contact?phone=${encodeURIComponent(phone)}`;
    console.log("🔗 Making API request to:", apiUrl);
    
    // Make the API request with additional options to handle CORS
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });
    
    if (!response.ok) {
      console.error(`❌ API error: ${response.status} ${response.statusText}`);
      toast.error('API error. Please try again.');
      return null;
    }
    
    // Parse the response
    const contactData = await response.json();
    console.log("📋 API returned data:", contactData);
    
    if (contactData && contactData.id) {
      console.log("✅ Found contact with ID:", contactData.id);
      toast.success(`Found your account! ${contactData.fullName ? `Hello, ${contactData.fullName}!` : ''}`);
      return {
        success: true,
        id: contactData.id,
        phone: contactData.phone || phone, // Use the provided phone if not returned
        fullName: contactData.fullName,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        email: contactData.email
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
