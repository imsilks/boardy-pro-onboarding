// This is a client-side mock implementation of the API endpoint
// In a production environment, this would be replaced by a real Next.js API endpoint

// This mock implementation simulates what a Next.js API route would do
// but runs in the browser instead of the server
document.addEventListener('DOMContentLoaded', () => {
  // Create a mock API endpoint for contact lookup
  const mockContactLookup = async (url) => {
    // Parse the URL to get the phone parameter
    const urlObj = new URL(url, window.location.origin);
    const phone = urlObj.searchParams.get('phone');
    
    console.log("🔍 Mock API received phone lookup request for:", phone);
    
    if (!phone) {
      return {
        status: 400,
        ok: false,
        json: async () => ({ success: false, message: 'Phone number is required' })
      };
    }
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This is where we would normally query the database
    // For demo purposes, let's create a mock response
    const mockContacts = [
      { id: 'contact_123', phone: '+15551234567', fullName: 'John Doe' },
      { id: 'contact_456', phone: '+14155551212', fullName: 'Jane Smith' }
    ];
    
    // Normalize the phone number for comparison - just keep the digits
    const normalizedInputPhone = phone.replace(/\D/g, '');
    
    console.log("🔄 Normalized input phone:", normalizedInputPhone);
    
    // Find a matching contact - log each attempt to debug
    const matchingContact = mockContacts.find(contact => {
      const contactPhone = contact.phone.replace(/\D/g, '');
      console.log(`Comparing: ${contactPhone} with ${normalizedInputPhone}`);
      
      // Check if the contactPhone ends with the normalized phone input
      // This handles cases where the input might be missing the country code
      const matches = contactPhone.endsWith(normalizedInputPhone) || 
                     normalizedInputPhone.endsWith(contactPhone);
                     
      console.log(`Match result for ${contact.id}: ${matches}`);
      return matches;
    });
    
    if (matchingContact) {
      console.log("✅ Mock API found matching contact:", matchingContact);
      return {
        status: 200,
        ok: true,
        json: async () => ({
          success: true,
          id: matchingContact.id,
          phone: matchingContact.phone,
          fullName: matchingContact.fullName
        })
      };
    }
    
    console.log("❌ Mock API found no matching contact");
    return {
      status: 404,
      ok: false,
      json: async () => ({ success: false, message: 'No account found with this phone number' })
    };
  };
  
  // Intercept fetch requests to our mock API endpoint
  const originalFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('/api/contact-lookup')) {
      console.log("🔄 Intercepting API call to:", url);
      return mockContactLookup(url);
    }
    
    // For all other requests, use the original fetch
    return originalFetch.apply(this, arguments);
  };
  
  console.log('Mock API endpoints installed for development');
});
