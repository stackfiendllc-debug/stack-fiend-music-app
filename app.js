import { supabase } from "./supabase.js";

const authScreen = document.getElementById("auth-screen");
const profileScreen = document.getElementById("profile-screen");
const musicScreen = document.getElementById("music-screen");

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-login");
const createProfileBtn = document.getElementById("create-profile-btn");
const signoutBtn = document.getElementById("signout-btn");

const email = document.getElementById("email");
const password = document.getElementById("password");
const fullname = document.getElementById("fullname");
const role = document.getElementById("role");

// ---------------- CREATE ACCOUNT ----------------
signupBtn.onclick = async () => {
  const { data, error } = await supabase.auth.signUp({
    email: email.value.trim(),
    password: password.value.trim()
  });

  if (error) return alert(error.message);

  if (data.user) {
    authScreen.classList.add("hidden");
    profileScreen.classList.remove("hidden");
  }
};

// ---------------- LOGIN ----------------
loginBtn.onclick = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value.trim(),
    password: password.value.trim()
  });

  if (error) return alert(error.message);

  await checkProfile(data.user.id);
};

// ---------------- GOOGLE LOGIN ----------------
googleBtn.onclick = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        "https://stackfiendllc-debug.github.io/stack-fiend-music-app/"
    }
  });

  if (error) alert(error.message);
};

// ---------------- PROFILE CHECK ----------------
async function checkProfile(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (data) {
    showMusic(data.role);
  } else {
    authScreen.classList.add("hidden");
    profileScreen.classList.remove("hidden");
  }
}

// ---------------- CREATE PROFILE ----------------
createProfileBtn.onclick = async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    fullname: fullname.value,
    role: role.value
  });

  if (error) return alert(error.message);

  showMusic(role.value);
};

// ---------------- SHOW MUSIC ----------------
function showMusic(userRole) {
  authScreen.classList.add("hidden");
  profileScreen.classList.add("hidden");
  musicScreen.classList.remove("hidden");

  const artistTools = document.getElementById("artist-tools");

  if (userRole === "artist") {
    artistTools.classList.remove("hidden");
  }
}

// ---------------- SIGN OUT ----------------
signoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  window.location.href =
    "https://stackfiendllc-debug.github.io/stack-fiend-music-app/";
});

// ---------------- FIXED SESSION INIT ----------------
async function init() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) return;

  await checkProfile(session.user.id);
}

init();