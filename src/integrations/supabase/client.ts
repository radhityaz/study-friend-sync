// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nekcpisjvxcpdxxckgui.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5la2NwaXNqdnhjcGR4eGNrZ3VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMTQ5MTQsImV4cCI6MjA1Nzg5MDkxNH0.iD7eIJBTxr94OX9xomiNZztXWpgRykhMNd9ay_44oko";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);