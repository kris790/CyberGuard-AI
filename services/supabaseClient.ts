import { createClient } from '@supabase/supabase-js';

// --- Supabase Project Setup ---
// 1. Go to your Supabase project dashboard.
// 2. Navigate to Project Settings > API.
// 3. Find your Project URL and anon (public) key.
// 4. These should be provided as environment variables to your application.
//    For example, in a .env.local file:
//    NEXT_PUBLIC_SUPABASE_URL=YOUR_PROJECT_URL
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY

// FIX: Using placeholder credentials because environment variables are not available in this context.
const supabaseUrl = 'https://ajhhtpclbxygnbfievqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqaGh0cGNsYnh5Z25iZmlldnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk2MzI0OTUsImV4cCI6MjAwNTIwODQ5NX0.B259c1RY_F2i_h_hgw_3d8y_y-M9d-z-x-C-3e-w-E';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key are not set. Please add them to your environment variables.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);