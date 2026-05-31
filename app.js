const SUPABASE_URL = "https://wtetpifsildutbomreds.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZXRwaWZzaWxkdXRib21yZWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk4NTcsImV4cCI6MjA5NTgzNTg1N30.rMCPUyF-dVmKaUAtGSVKfbz4BhI4NxxEwXxgWe2Fg0w";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let selectedRole = "listener";

function showSignupForm() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("signup-details").classList.remove("hidden");
}

function selectRole(role) {
  selectedRole = role;
  alert(role + " selected");
}

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
}

async function completeSignup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const fullName = document.getElementById("fullName").value;
  const username = document.getElementById("username").value;

  if (!validatePassword(password)) {
    alert("Password needs uppercase, number, symbol.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.from("users").insert([
    {
      id: data.user.id,
      full_name: fullName,
      username,
      role: selectedRole,
      approved: selectedRole === "listener"
    }
  ]);

  alert("Signup complete. Confirm email.");
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
  document.getElementById("signup-details").classList.add("hidden");
  document.getElementById("tracks-section").classList.remove("hidden");

  loadTracks();
}

async function googleLogin() {
  await supabase.auth.signInWithOAuth({
    provider: "google"
  });
}

async function appleLogin() {
  await supabase.auth.signInWithOAuth({
    provider: "apple"
  });
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  await supabase.storage
    .from("music")
    .upload(Date.now() + "-" + file.name, file);

  loadTracks();
}

async function loadTracks() {
  const { data } = await supabase.storage
    .from("music")
    .list();

  const trackList = document.getElementById("trackList");

  trackList.innerHTML = "";

  data.forEach(track => {
    trackList.innerHTML += `
      <div class="track-card">
        <p>${track.name}</p>
        <audio controls src="${SUPABASE_URL}/storage/v1/object/public/music/${track.name}"></audio>
      </div>
    `;
  });
}