
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LINKEDIN_IMPORT_BASE_URL = "https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract the contactId from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const contactId = pathParts[pathParts.length - 1];

    if (!contactId) {
      throw new Error('Contact ID is required');
    }

    console.log(`Processing LinkedIn import for contact ID: ${contactId}`);

    // Get authorization header from the request
    const authHeader = req.headers.get('Authorization');
    console.log(`Authorization header present: ${!!authHeader}`);
    
    if (!authHeader) {
      console.error("No Authorization header provided");
      return new Response(
        JSON.stringify({ error: "Authentication required", code: 401, message: "Invalid JWT" }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('File is required and must be a valid file');
    }

    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);

    // Create a new FormData to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    // Forward the request to the external API
    const importUrl = `${LINKEDIN_IMPORT_BASE_URL}/${contactId}`;
    console.log(`Forwarding to: ${importUrl}`);
    console.log(`Using auth header: ${authHeader}`);

    // Include the authorization header in the request to the external API
    const headers: HeadersInit = {
      'Authorization': authHeader,
    };
    
    // Important: Don't manually set Content-Type for multipart/form-data requests
    const response = await fetch(importUrl, {
      method: 'POST',
      body: forwardFormData,
      headers
    });

    const responseStatus = response.status;
    console.log(`External API response status: ${responseStatus}`);

    // If we get a 401, provide a clear error message about authentication
    if (responseStatus === 401) {
      console.error("Authentication failed with external API");
      return new Response(
        JSON.stringify({ 
          error: "Authentication error", 
          code: 401, 
          message: "Authentication failed with the service. Please log in again."
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Try to parse the response as JSON first
    let responseBody;
    try {
      responseBody = await response.json();
      console.log("Response body:", responseBody);
    } catch (e) {
      // If JSON parsing fails, get the response as text
      const responseText = await response.text();
      console.log("Response text:", responseText);
      responseBody = { message: responseText };
    }

    return new Response(
      JSON.stringify(responseBody),
      {
        status: responseStatus,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error) {
    console.error("Error processing LinkedIn import:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
