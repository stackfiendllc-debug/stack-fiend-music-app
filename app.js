const SUPABASE_URL = "https://wtetpifsildutbomreds.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZXRwaWZzaWxkdXRib21yZWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk4NTcsImV4cCI6MjA5NTgzNTg1N30.rMCPUyF-dVmKaUAtGSVKfbz4BhI4NxxEwXxgWe2Fg0w";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Stack Fiend loaded");

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
    alert("Password must include uppercase, number, symbol.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://stackfiendllc-debug.github.io/stack-fiend-music-app/"
    }
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

  alert("Account created. Check email to confirm.");
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
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://stackfiendllc-debug.github.io/stack-fiend-music-app/"
    }
  });

  if (error) alert(error.message);
}

async function appleLogin() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo:
        "https://stackfiendllc-debug.github.io/stack-fiend-music-app/"
    }
  });

  if (error) alert(error.message);
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];

  if (!file) {
    alert("Select a file");
    return;
  }

  const fileName = Date.now() + "-" + file.name;

  const { error } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (error) {
    alert(error.message);
    return;
  }

  loadTracks();
}

async function loadTracks() {
  const { data, error } = await supabase.storage
    .from("music")
    .list();

  if (error) return;

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