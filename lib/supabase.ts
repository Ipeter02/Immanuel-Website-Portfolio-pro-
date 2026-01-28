import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
// We access import.meta.env directly here to ensure Vite can perform static replacement during build
const env = (import.meta as any).env || {};

const clean = (value: string | undefined) => {
  if (!value) return "";
  return value.replace(/["']/g, "").trim();
};

// --- CONFIGURATION ---
const supabaseUrl = clean(env.VITE_SUPABASE_URL);
const supabaseKey = clean(env.VITE_SUPABASE_ANON_KEY);

// Validation
const isValid = supabaseUrl.startsWith("http") && supabaseKey.length > 0;

// Create the client
export const supabase = isValid 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Console Diagnostics
if (isValid) {
    console.log("✅ Supabase Client Initialized");
} else {
    console.warn("⚠️ Supabase Credentials Missing. App running in LOCAL/OFFLINE mode.");
    console.log("To connect a database:");
    console.log("1. Create project at https://supabase.com");
    console.log("2. Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY");
}
