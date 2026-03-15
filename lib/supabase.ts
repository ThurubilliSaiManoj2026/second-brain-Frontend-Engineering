import { createClient } from '@supabase/supabase-js';

// These two environment variables are prefixed with NEXT_PUBLIC_ which means
// Next.js will safely expose them to the browser. The Supabase anon key is
// designed to be public — Row Level Security on the database handles protection.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Single shared client instance — reused across the entire application
export const supabase = createClient(supabaseUrl, supabaseKey);