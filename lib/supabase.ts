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
const supabaseUrl = getEnvVar("VITE_SUPABASE_URL", "").trim();
const supabaseKey = getEnvVar("VITE_SUPABASE_ANON_KEY", "").trim();
// --- CONFIGURATION END ---

// Create the client if keys exist and look valid, otherwise null (triggers local demo mode)
// Minimal validation: URL must start with http, key must be reasonably long
export const supabase = (supabaseUrl.startsWith("http") && supabaseKey.length > 20) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
    console.log("✅ Supabase initialized successfully");
} else {
    console.log("⚠️ Supabase keys missing or invalid. Running in LOCAL DEMO MODE.");
}