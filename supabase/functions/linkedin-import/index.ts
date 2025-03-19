
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LINKEDIN_IMPORT_BASE_URL = "https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'content-type',
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

    const response = await fetch(importUrl, {
      method: 'POST',
      body: forwardFormData,
    });

    const responseStatus = response.status;
    console.log(`External API response status: ${responseStatus}`);

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
