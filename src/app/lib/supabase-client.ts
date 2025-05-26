import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nhqenzofxxwnyoglxstq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ocWVuem9meHh3bnlvZ2x4c3RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjE5MjAsImV4cCI6MjA2MzgzNzkyMH0.7fpoeiH6VSXyA3d5vc-4vDW_Jj4BuLqenmJHZYcfEYg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);