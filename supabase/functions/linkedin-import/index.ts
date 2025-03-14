
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
      console.error("No contactId provided in URL");
      throw new Error('Contact ID is required');
    }

    console.log(`Processing LinkedIn import for contact ID: ${contactId}`);

    // We need to get the file from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      console.error("Missing or invalid file in request");
      throw new Error('File is required and must be a valid file');
    }

    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);
    
    // Verify the file is a CSV
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      console.error("File is not a CSV");
      throw new Error('Please upload a CSV file');
    }

    // Create a new FormData to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', file);

    // Forward the request to the external API with contactId in the URL
    const importUrl = `${LINKEDIN_IMPORT_BASE_URL}/${contactId}`;
    console.log(`Forwarding to: ${importUrl}`);

    // Set up fetch with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout
    
    const response = await fetch(importUrl, {
      method: 'POST',
      body: forwardFormData,
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    // Get the response from the external API
    const responseStatus = response.status;
    console.log(`External API response status: ${responseStatus}`);

    // Forward the response back to the client
    let responseBody;
    try {
      responseBody = await response.json();
      console.log("Response body:", responseBody);
    } catch (e) {
      // If the response isn't JSON, get the text instead
      const text = await response.text();
      responseBody = { message: text || "No response body" };
      console.log("Response text:", text);
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
    
    // Handle abort error (timeout)
    if (error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: "Request timed out. The server might be busy." }),
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
      JSON.stringify({ error: error.message || "Unknown error occurred" }),
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
