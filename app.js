import { supabase } from "./supabase.js";

// Elements
const authScreen = document.getElementById("auth-screen");
const profileScreen = document.getElementById("profile-screen");
const musicScreen = document.getElementById("music-screen");

const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleBtn = document.getElementById("google-login");
const createProfileBtn = document.getElementById("create-profile-btn");

const email = document.getElementById("email");
const password = document.getElementById("password");
const fullname = document.getElementById("fullname");
const role = document.getElementById("role");

// ---------- Signup ----------
signupBtn.onclick = async function () {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  profileScreen.classList.remove("hidden");
  authScreen.classList.add("hidden");
};

// ---------- Login ----------
loginBtn.onclick = async function () {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  checkProfile(data.user.id);
};

// ---------- Google ----------
googleBtn.onclick = async function () {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.href
    }
  });
};

// ---------- Create Profile ----------
createProfileBtn.onclick = async function () {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("profiles").insert({
    id: user.id,
    fullname: fullname.value,
    role: role.value
  });

  if (error) {
    alert(error.message);
    return;
  }

  showMusic(role.value);
};

// ---------- Profile Check ----------
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

// ---------- Show Music ----------
function showMusic(userRole) {
  authScreen.classList.add("hidden");
  profileScreen.classList.add("hidden");
  musicScreen.classList.remove("hidden");

  const artistTools = document.getElementById("artist-tools");

  if (userRole === "artist") {
    artistTools.classList.remove("hidden");
  }
}