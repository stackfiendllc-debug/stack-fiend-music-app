import { supabase } from "./supabase.js";

// Screens
const authScreen = document.getElementById("auth-screen");
const profileScreen = document.getElementById("profile-screen");
const musicScreen = document.getElementById("music-screen");

// Buttons
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-login");
const createProfileBtn = document.getElementById("create-profile-btn");
const signoutBtn = document.getElementById("signout-btn");

// Inputs
const email = document.getElementById("email");
const password = document.getElementById("password");
const fullname = document.getElementById("fullname");
const role = document.getElementById("role");

// ---------------- SIGN UP ----------------
signupBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Account created successfully. Check your email to verify.");
  }
});

// ---------------- LOGIN ----------------
loginBtn?.addEventListener("click", async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  await checkProfile(data.user.id);
});

// ---------------- GOOGLE LOGIN ----------------
googleBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://stackfiendllc-debug.github.io/stack-fiend-music-app/"
    }
  });

  if (error) {
    console.error(error);
    alert(error.message);
  }
});

// ---------------- PROFILE CHECK ----------------
async function checkProfile(userId) {
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (data) {
    showMusicScreen(data.role);
  } else {
    authScreen.classList.add("hidden");
    profileScreen.classList.remove("hidden");
  }
}

// ---------------- CREATE PROFILE ----------------
createProfileBtn?.addEventListener("click", async () => {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User session not found.");
    return;
  }

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    fullname: fullname.value,
    role: role.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  showMusicScreen(role.value);
});

// ---------------- SHOW MUSIC SCREEN ----------------
function showMusicScreen(userRole) {
  authScreen.classList.add("hidden");
  profileScreen.classList.add("hidden");
  musicScreen.classList.remove("hidden");

  const artistTools = document.getElementById("artist-tools");

  if (userRole === "artist") {
    artistTools?.classList.remove("hidden");
  } else {
    artistTools?.classList.add("hidden");
  }
}

// ---------------- SIGN OUT ----------------
signoutBtn?.addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.reload();
});

// ---------------- SESSION INIT ----------------
async function init() {
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (session?.user) {
    await checkProfile(session.user.id);
  }
}

init();