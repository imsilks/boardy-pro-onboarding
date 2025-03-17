/**
 * API utility functions
 */

import { toast } from "sonner";

/**
 * Format phone number to international format with "+" followed by country code and number
 */
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

/**
 * Check if URL is reachable
 */
export const isUrlReachable = async (url: string): Promise<boolean> => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(url, { 
      method: 'HEAD',
      mode: 'no-cors', // This is important for CORS issues
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return true;
  } catch (error) {
    console.error(`URL ${url} is not reachable:`, error);
    return false;
  }
};
