
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LINKEDIN_IMPORT_BASE_URL = "https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Extract the contactId from the URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const contactId = pathParts[pathParts.length - 1];

    if (!contactId) {
      console.error('Contact ID is missing');
      return new Response(
        JSON.stringify({ error: 'Contact ID is required' }),
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log(`Processing LinkedIn import for contact ID: ${contactId}`);

    // We need to get the file from the request
    let formData;
    try {
      formData = await req.formData();
    } catch (e) {
      console.error('Error parsing form data:', e);
      return new Response(
        JSON.stringify({ error: 'Invalid form data' }),
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error('File is missing or invalid');
      return new Response(
        JSON.stringify({ error: 'File is required and must be a valid file' }),
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);

    // Make sure file is CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.error('File is not a CSV');
      return new Response(
        JSON.stringify({ error: 'File must be a CSV' }),
        { 
          status: 400, 
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }

    // Create a new FormData to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    // Forward the request to the external API
    const importUrl = `${LINKEDIN_IMPORT_BASE_URL}/${contactId}`;
    console.log(`Forwarding to: ${importUrl}`);

    try {
      // Add timeout to the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout
      
      const response = await fetch(importUrl, {
        method: 'POST',
        body: forwardFormData,
        signal: controller.signal,
        // Explicitly don't set content-type - browser will set with boundary
      });
      
      clearTimeout(timeoutId);

      // Get the response from the external API
      const responseStatus = response.status;
      console.log(`External API response status: ${responseStatus}`);

      // Handle different status codes
      if (responseStatus >= 400) {
        console.error(`Error response from external API: ${responseStatus}`);
        
        // Try to get error details
        let errorDetails;
        try {
          errorDetails = await response.json();
        } catch (e) {
          errorDetails = { message: await response.text() };
        }
        
        console.error("Error details:", errorDetails);
        
        return new Response(
          JSON.stringify({ 
            error: 'Error from LinkedIn import service', 
            details: errorDetails,
            status: responseStatus
          }),
          { 
            status: 502, // Bad Gateway to indicate external service error
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }

      // Forward the successful response back to the client
      let responseBody;
      try {
        responseBody = await response.json();
        console.log("Success response body:", responseBody);
      } catch (e) {
        // If the response isn't JSON, get the text instead
        const text = await response.text();
        console.log("Success response text:", text);
        responseBody = { message: text };
      }

      return new Response(
        JSON.stringify(responseBody),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
      
    } catch (fetchError) {
      console.error("Error in fetch to external API:", fetchError);
      
      // Special handling for timeout/abort errors
      if (fetchError instanceof DOMException && fetchError.name === 'AbortError') {
        return new Response(
          JSON.stringify({ error: 'Connection to LinkedIn import service timed out' }),
          { 
            status: 504, // Gateway Timeout
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Error connecting to LinkedIn import service', 
          message: fetchError.message 
        }),
        { 
          status: 502, // Bad Gateway
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json'
          }
        }
      );
    }
  } catch (error) {
    console.error("Unexpected error in LinkedIn import function:", error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        message: error.message 
      }),
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
