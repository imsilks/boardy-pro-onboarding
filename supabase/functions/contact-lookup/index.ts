
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Get phone number from the request
    const url = new URL(req.url);
    const phone = url.searchParams.get('phone');

    if (!phone) {
      return new Response(
        JSON.stringify({ error: 'Phone number is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Initialize Supabase client with the service role key
    // This key has full access to the database, but is only used in this secure edge function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Supabase configuration is missing' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Format phone number for lookup
    const formattedPhone = formatPhoneNumber(phone);
    
    // Query Supabase securely from the edge function
    const { data: contacts, error } = await supabase
      .from('Contact')
      .select('id, phone, fullName')
      .eq('phone', formattedPhone)
      .limit(1);
    
    if (error) {
      return new Response(
        JSON.stringify({ error: 'Database error', details: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    if (contacts && contacts.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          contact: contacts[0]
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Try fallback with just digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    if (digitsOnly.length >= 10) {
      const { data: fallbackContacts, error: fallbackError } = await supabase
        .from('Contact')
        .select('id, phone, fullName')
        .ilike('phone', `%${digitsOnly.slice(-10)}%`)
        .limit(1);
      
      if (!fallbackError && fallbackContacts && fallbackContacts.length > 0) {
        return new Response(
          JSON.stringify({
            success: true,
            contact: fallbackContacts[0]
          }),
          { 
            status: 200, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }
    }
    
    return new Response(
      JSON.stringify({ success: false, message: 'No account found with this phone number' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

// Helper function to format phone numbers consistently
function formatPhoneNumber(phone) {
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length === 10) {
    return `+1${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+${digitsOnly}`;
  } else if (digitsOnly.length > 0) {
    return `+${digitsOnly}`;
  }
  
  return phone;
}
