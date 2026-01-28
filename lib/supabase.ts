import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables
// We access import.meta.env directly here to ensure Vite can perform static replacement during build
const env = (import.meta as any).env || {};

const clean = (value: string | undefined) => {
  if (!value) return "";
  return value.replace(/["']/g, "").trim();
};

// --- CONFIGURATION START ---
// IMPORTANT: Access these directly! Do not use dynamic keys (e.g. env[key]) 
// because Vite/Rollup static analysis will miss them during the build.
const supabaseUrl = clean(env.VITE_SUPABASE_URL);
const supabaseKey = clean(env.VITE_SUPABASE_ANON_KEY);
// --- CONFIGURATION END ---

// Create the client if keys exist and look roughly valid
export const supabase = (supabaseUrl.startsWith("http") && supabaseKey.length > 20) 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

if (supabase) {
    console.log("✅ Supabase initialized successfully");
} else {
    console.log("⚠️ Supabase keys missing or invalid. Running in LOCAL DEMO MODE.");
    console.log("DEBUG: URL Length:", supabaseUrl.length, "Key Length:", supabaseKey.length);
}