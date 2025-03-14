
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LINKEDIN_IMPORT_BASE_URL = "https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
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
      console.error('Missing contactId in request path');
      return new Response(
        JSON.stringify({ error: 'Contact ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing LinkedIn import for contact ID: ${contactId}`);

    // We need to get the file from the request
    let formData;
    try {
      formData = await req.formData();
    } catch (formError) {
      console.error('Error parsing form data:', formError);
      return new Response(
        JSON.stringify({ error: 'Invalid form data: ' + formError.message }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('No file found in request or invalid file');
      return new Response(
        JSON.stringify({ error: 'File is required and must be a valid file' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);

    // Verify file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.error('Invalid file type:', file.type);
      return new Response(
        JSON.stringify({ error: 'File must be a CSV file' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a new FormData to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    // Forward the request to the external API with timeout
    const importUrl = `${LINKEDIN_IMPORT_BASE_URL}/${contactId}`;
    console.log(`Forwarding to: ${importUrl}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch(importUrl, {
        method: 'POST',
        body: forwardFormData,
        signal: controller.signal
        // Note: We do not manually set Content-Type for multipart/form-data
      });

      clearTimeout(timeoutId);

      // Get the response from the external API
      const responseStatus = response.status;
      console.log(`External API response status: ${responseStatus}`);

      // Log response headers for debugging
      console.log("Response headers:");
      for (const [key, value] of response.headers.entries()) {
        console.log(`${key}: ${value}`);
      }

      // Forward the response back to the client
      let responseBody;
      let contentType = response.headers.get('content-type') || 'application/json';
      
      if (contentType.includes('application/json')) {
        try {
          responseBody = await response.json();
          console.log("Response body:", responseBody);
        } catch (e) {
          responseBody = { message: 'Invalid JSON in response', error: e.message };
          console.error("Error parsing JSON response:", e);
        }
      } else {
        // If the response isn't JSON, get the text instead
        responseBody = { message: await response.text() };
        console.log("Response text:", responseBody.message);
      }

      // Check if the response was successful
      if (responseStatus >= 200 && responseStatus < 300) {
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
      } else {
        console.error(`Error from external API: Status ${responseStatus}`, responseBody);
        return new Response(
          JSON.stringify({ 
            error: 'Error from external API', 
            details: responseBody,
            status: responseStatus 
          }),
          {
            status: 502, // Bad Gateway - upstream server returned an invalid response
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle fetch errors (network, timeout, etc.)
      if (fetchError.name === 'AbortError') {
        console.error("Request to external API timed out");
        return new Response(
          JSON.stringify({ error: 'Request to external API timed out' }),
          { 
            status: 504, // Gateway Timeout
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
      
      console.error("Fetch error:", fetchError);
      return new Response(
        JSON.stringify({ error: 'Network error when contacting external API', details: fetchError.message }),
        { 
          status: 502, // Bad Gateway
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("Error processing LinkedIn import:", error);
    return new Response(
      JSON.stringify({ error: error.message, stack: error.stack }),
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
