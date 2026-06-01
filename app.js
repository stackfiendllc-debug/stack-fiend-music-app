import { supabase } from './supabase.js';

// Screens
const authScreen = document.getElementById("auth-screen");
const profileScreen = document.getElementById("profile-screen");
const musicScreen = document.getElementById("music-screen");

// Auth
const email = document.getElementById("email");
const password = document.getElementById("password");
const signupBtn = document.getElementById("signup-btn");
const loginBtn = document.getElementById("login-btn");
const googleLogin = document.getElementById("google-login");

// Profile
const fullname = document.getElementById("fullname");
const role = document.getElementById("role");
const profilePic = document.getElementById("profile-pic");
const createProfileBtn = document.getElementById("create-profile-btn");

// ---------- AUTH ----------

signupBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Account created. Login now.");
  }
});

loginBtn.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });

  if (error) {
    alert(error.message);
  } else {
    checkUser();
  }
});

googleLogin.addEventListener("click", async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin + window.location.pathname