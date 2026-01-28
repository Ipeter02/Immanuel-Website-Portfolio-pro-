import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    const env = (import.meta as any).env;
    if (env && env[key]) {
      // Remove any surrounding quotes and whitespace that might have been pasted accidentally
      return env[key].replace(/["']/g, "").trim();
    }
  } catch (e) {
    // Ignore error
  }
  return defaultValue;
};

// --- CONFIGURATION START ---
const supabaseUrl = getEnvVar("VITE_SUPABASE_URL", "");
const supabaseKey = getEnvVar("VITE_SUPABASE_ANON_KEY", "");
// --- CONFIGURATION END ---

// Create the client if keys exist and look roughly valid
export const supabase = (supabaseUrl.startsWith("http") && supabaseKey.length > 20) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
    console.log("✅ Supabase initialized successfully");
} else {
    console.log("⚠️ Supabase keys missing or invalid. Running in LOCAL DEMO MODE.");
}