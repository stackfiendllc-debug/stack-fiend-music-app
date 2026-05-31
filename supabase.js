const SUPABASE_URL = "https://wtetpifsildutbomreds.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZXRwaWZzaWxkdXRib21yZWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk4NTcsImV4cCI6MjA5NTgzNTg1N30.rMCPUyF-dVmKaUAtGSVKfbz4BhI4NxxEwXxgWe2Fg0w";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);