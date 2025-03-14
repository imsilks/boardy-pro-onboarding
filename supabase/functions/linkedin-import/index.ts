
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const LINKEDIN_IMPORT_BASE_URL = "https://boardy-server-v36-production.up.railway.app/relationship/import/linkedin";

// Define proper CORS headers to allow requests from any origin
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
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

    // We need to get the file from the request
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      throw new Error('File is required and must be a valid file');
    }

    console.log(`File details: name=${file.name}, type=${file.type}, size=${file.size}bytes`);

    // Ensure the file is named "Connections.csv" as required by the endpoint
    const fileContent = await file.arrayBuffer();
    const renamedFile = new File(
      [fileContent], 
      "Connections.csv", 
      { type: "text/csv" }
    );

    // Create a new FormData to forward to the external API
    const forwardFormData = new FormData();
    forwardFormData.append('file', renamedFile);

    // Forward the request to the external API
    const importUrl = `${LINKEDIN_IMPORT_BASE_URL}/${contactId}`;
    console.log(`Forwarding to: ${importUrl}`);

    const response = await fetch(importUrl, {
      method: 'POST',
      body: forwardFormData,
      // No need to set Content-Type header when sending FormData, the browser sets it automatically
      // with the correct boundary parameter
    });

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
      responseBody = { message: await response.text() };
      console.log("Response text:", responseBody.message);
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
