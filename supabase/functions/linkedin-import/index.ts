
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the contact ID from the URL
    const url = new URL(req.url)
    const contactId = url.pathname.split('/').pop()

    if (!contactId) {
      throw new Error('Contact ID is required')
    }

    // Get the CSV file from the request
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      throw new Error('No file uploaded')
    }

    // Read the file content
    const csvContent = await file.text()
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Process CSV content and create relationships
    const lines = csvContent.split('\n')
    const headers = lines[0].split(',')
    
    // Find indices for relevant columns
    const emailIndex = headers.findIndex(h => h.includes('Email'))
    const firstNameIndex = headers.findIndex(h => h.includes('First Name'))
    const lastNameIndex = headers.findIndex(h => h.includes('Last Name'))
    
    const contacts = []
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',')
      if (values.length >= Math.max(emailIndex, firstNameIndex, lastNameIndex)) {
        contacts.push({
          email: values[emailIndex]?.trim()?.replace(/"/g, ''),
          firstName: values[firstNameIndex]?.trim()?.replace(/"/g, ''),
          lastName: values[lastNameIndex]?.trim()?.replace(/"/g, ''),
          fullName: `${values[firstNameIndex]?.trim()} ${values[lastNameIndex]?.trim()}`.trim().replace(/"/g, '')
        })
      }
    }

    // Create contacts and relationships
    for (const contact of contacts) {
      if (contact.email || contact.fullName) {
        // Create or get existing contact
        const { data: existingContact } = await supabaseClient
          .from('Contact')
          .select('id')
          .or(`email.eq.${contact.email},fullName.eq.${contact.fullName}`)
          .maybeSingle()

        let linkedContactId
        if (existingContact) {
          linkedContactId = existingContact.id
        } else {
          const { data: newContact } = await supabaseClient
            .from('Contact')
            .insert({
              email: contact.email,
              firstName: contact.firstName,
              lastName: contact.lastName,
              fullName: contact.fullName,
              createdVia: 'LINKEDIN_IMPORT'
            })
            .select('id')
            .single()
          
          linkedContactId = newContact.id
        }

        // Create relationship
        await supabaseClient
          .from('ContactRelationship')
          .insert({
            contactAId: contactId,
            contactBId: linkedContactId,
            relationship: 'LINKEDIN_CONNECTION'
          })
          .select()
      }
    }

    return new Response(
      JSON.stringify({ message: 'Import successful' }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  }
})
