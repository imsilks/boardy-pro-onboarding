
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// We're using the anon key that's specifically designed to be public
// Any sensitive operations must use Row Level Security or Edge Functions
const SUPABASE_URL = "https://zprsisdofgrlsgcmtlgj.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwcnNpc2RvZmdybHNnY210bGdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMTkzOTAsImV4cCI6MjA0NzY5NTM5MH0.F0oWS3trwHiyKkRIrETs3g6-544JMFWwylwdJP4QiYQ";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
