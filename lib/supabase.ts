import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
const getEnvVar = (key: string, defaultValue: string) => {
  try {
    // Safely access import.meta.env
    const env = (import.meta as any).env;
    if (env && env[key]) {
      return env[key];
    }
  } catch (e) {
    // Ignore if import.meta is not defined
  }
  return defaultValue;
};

// --- CONFIGURATION START ---
// Get these from your Supabase Project Settings > API
const supabaseUrl = getEnvVar("VITE_SUPABASE_URL", "");
const supabaseKey = getEnvVar("VITE_SUPABASE_ANON_KEY", "");
// --- CONFIGURATION END ---

// Create the client if keys exist, otherwise null (triggers local demo mode)
export const supabase = (supabaseUrl && supabaseKey) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
    console.log("✅ Supabase initialized successfully");
} else {
    console.log("⚠️ Supabase keys missing. Running in LOCAL DEMO MODE.");
}
