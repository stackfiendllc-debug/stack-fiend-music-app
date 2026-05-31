const SUPABASE_URL = "https://wtetpifsildutbomreds.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZXRwaWZzaWxkdXRib21yZWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk4NTcsImV4cCI6MjA5NTgzNTg1N30.rMCPUyF-dVmKaUAtGSVKfbz4BhI4NxxEwXxgWe2Fg0w";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

function showSignupForm() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("signup-details").classList.remove("hidden");
}

async function completeSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Signup complete. Login now.");

  document.getElementById("signup-details").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("tracks-section").classList.remove("hidden");
  document.getElementById("upload-section").classList.remove("hidden");

  loadTracks();
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];
  const title = document.getElementById("trackTitle").value;

  if (!file) {
    alert("Select a music file");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Track uploaded");
  loadTracks();
}

async function loadTracks() {
  const { data } = await supabase.storage
    .from("music")
    .list();

  const trackList = document.getElementById("trackList");
  trackList.innerHTML = "";

  data.forEach(track => {
    const div = document