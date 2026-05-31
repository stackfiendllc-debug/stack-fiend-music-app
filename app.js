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
}

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password);
}

async function completeSignup() {
  const email = email.value;
  const password = document.getElementById("password").value;

  if (!validatePassword(password)) {
    alert("Password needs capital, number, symbol.");
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
      full_name: fullName.value,
      username: username.value,
      role: selectedRole,
      approved: selectedRole === "listener"
    }
  ]);

  alert("Check email to confirm account.");
}

async function signIn() {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  auth-section.classList.add("hidden");
  signup-details.classList.add("hidden");
  tracks-section.classList.remove("hidden");

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
  const file = musicFile.files[0];

  if (!file) return;

  await supabase.storage
    .from("music")
    .upload(Date.now() + file.name, file);

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