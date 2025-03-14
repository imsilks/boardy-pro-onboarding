
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
    
    if (!phone) {
      return {
        status: 400,
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
    
    // Normalize the phone number for comparison
    const normalizedPhone = phone.replace(/\D/g, '');
    
    // Find a matching contact
    const matchingContact = mockContacts.find(contact => {
      const contactPhone = contact.phone.replace(/\D/g, '');
      return contactPhone.endsWith(normalizedPhone.slice(-10));
    });
    
    if (matchingContact) {
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
      return mockContactLookup(url);
    }
    
    // For all other requests, use the original fetch
    return originalFetch.apply(this, arguments);
  };
  
  console.log('Mock API endpoints installed for development');
});
