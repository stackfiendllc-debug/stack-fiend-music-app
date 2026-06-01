import { supabase } from './supabase.js'

// Screens
const authScreen = document.getElementById("auth-screen")
const profileScreen = document.getElementById("profile-screen")
const musicScreen = document.getElementById("music-screen")

// Auth Inputs
const email = document.getElementById("email")
const password = document.getElementById("password")

// Profile Inputs
const fullname = document.getElementById("fullname")
const role = document.getElementById("role")

// Buttons
const signupBtn = document.getElementById("signup-btn")
const loginBtn = document.getElementById("login-btn")
const googleBtn = document.getElementById("google-login")
const createProfileBtn = document.getElementById("create-profile-btn")

// Sign Up
signupBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    alert("Account created")
  }
})

// Login
loginBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    showProfile()
  }
})

// Google Login
googleBtn?.addEventListener("click", async () => {
  await supabase.auth.signInWithOAuth({
    provider: "google"
  })
})

// Create Profile
createProfileBtn?.addEventListener("click", async () => {
  localStorage.setItem("stackfiend_name", fullname.value)
  localStorage.setItem("stackfiend_role", role.value)

  showMusic()
})

// Screen Functions
function showProfile() {
  authScreen.classList.add("hidden")
  profileScreen.classList.remove("hidden")
}

function showMusic() {
  authScreen.classList.add("hidden")
  profileScreen.classList.add("hidden")
  musicScreen.classList.remove("hidden")

  loadDashboard()
}

// Dashboard
async function loadDashboard() {
  const userRole = localStorage.getItem("stackfiend_role")

  musicScreen.innerHTML = `
    <div class="dashboard">
      <button id="signout-btn">Sign Out</button>
      <h1>STACK FIEND MUSIC</h1>

      <section class="featured-release">
        <h2>Featured Release</h2>
        <div id="featured-content"></div>
      </section>

      <section class="trending">
        <h2>Trending Tracks</h2>
        <div id="trending-list"></div>
      </section>

      ${
        userRole === "artist"
          ? `
        <section class="artist-upload">
          <h2>Upload Release</h2>

          <input id="track-title" placeholder="Track Title" />
          <input id="artist-name" placeholder="Artist Name" />

          <select id="release-type">
            <option value="Single">Single</option>
            <option value="EP">EP</option>
            <option value="Album">Album</option>
          </select>

          <input id="release-date" type="date" />
          <input id="cover-upload" type="file" accept="image/*" />
          <input id="track-upload" type="file" accept="audio/*" />

          <button id="upload-track-btn">Publish Release</button>
        </section>
      `
          : ""
      }
    </div>
  `

  document.getElementById("signout-btn").addEventListener("click", signOut)

  if (userRole === "artist") {
    document
      .getElementById("upload-track-btn")
      .addEventListener("click", uploadTrack)
  }

  loadTracks()
}

// Upload Track
async function uploadTrack() {
  const title = document.getElementById("track-title").value
  const artist = document.getElementById("artist-name").value
  const releaseType = document.getElementById("release-type").value
  const releaseDate = document.getElementById("release-date").value
  const trackFile = document.getElementById("track-upload").files[0]
  const coverFile = document.getElementById("cover-upload").files[0]

  if (!title || !artist || !trackFile || !coverFile) {
    alert("Complete all release fields")
    return
  }

  const trackPath = `${Date.now()}-${trackFile.name}`
  const coverPath = `${Date.now()}-${coverFile.name}`

  const { error: trackError } = await supabase.storage
    .from("tracks")
    .upload(trackPath, trackFile)

  if (trackError) {
    alert(trackError.message)
    return
  }

  const { error: coverError } = await supabase.storage
    .from("covers")
    .upload(coverPath, coverFile)

  if (coverError) {
    alert(coverError.message)
    return
  }

  const audio_url = supabase.storage
    .from("tracks")
    .getPublicUrl(trackPath).data.publicUrl

  const cover_url = supabase.storage
    .from("covers")
    .getPublicUrl(coverPath).data.publicUrl

  const { error } = await supabase
    .from("tracks")
    .insert([{
      title,
      artist,
      release_type: releaseType,
      release_date: releaseDate,
      audio_url,
      cover_url,
      streams: 0
    }])

  if (error) {
    alert(error.message)
    return
  }

  alert("Release published successfully")
  loadTracks()
}

// Load Tracks
async function loadTracks() {
  const { data } = await supabase
    .from("tracks")
    .select("*")
    .order("streams", { ascending: false })

  const trending = document.getElementById("trending-list")
  const featured = document.getElementById("featured-content")

  if (!data || data.length === 0) return

  featured.innerHTML = `
    <img src="${data[0].cover_url}" width="200">
    <h3>${data[0].title}</h3>
    <p>${data[0].artist}</p>
  `

  trending.innerHTML = data.map(track => `
    <div class="track-card">
      <img src="${track.cover_url}" width="100">
      <h4>${track.title}</h4>
      <p>${track.artist}</p>
      <audio controls src="${track.audio_url}"></audio>
      <p>${track.streams} streams</p>
    </div>
  `).join("")
}

// Sign Out
async function signOut() {
  await supabase.auth.signOut()
  location.reload()
}

// Session Check
supabase.auth.getSession().then(({ data }) => {
  if (data.session) {
    showMusic()
  }
})