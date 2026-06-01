import { supabase } from './supabase.js'

// Screens
const authScreen = document.getElementById("auth-screen")
const profileScreen = document.getElementById("profile-screen")
const musicScreen = document.getElementById("music-screen")

// Auth
const email = document.getElementById("email")
const password = document.getElementById("password")

// Profile
const fullname = document.getElementById("fullname")
const role = document.getElementById("role")

// Buttons
const signupBtn = document.getElementById("signup-btn")
const loginBtn = document.getElementById("login-btn")
const googleBtn = document.getElementById("google-login")
const createProfileBtn = document.getElementById("create-profile-btn")

signupBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) alert(error.message)
  else alert("Account created")
})

loginBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) alert(error.message)
  else showProfile()
})

googleBtn?.addEventListener("click", async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: "https://stackfiendllc-debug.github.io/stack-fiend-music/"
    }
  })

  if (error) alert(error.message)
})

createProfileBtn?.addEventListener("click", () => {
  localStorage.setItem("stackfiend_name", fullname.value)
  localStorage.setItem("stackfiend_role", role.value)
  showMusic()
})

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

async function loadDashboard() {
  const userRole = localStorage.getItem("stackfiend_role")

  musicScreen.innerHTML = `
    <div class="dashboard">
      <button id="signout-btn">Sign Out</button>
      <h1>STACK FIEND MUSIC</h1>

      <section id="featured-content"></section>
      <section id="trending-list"></section>

      ${userRole === "artist" ? `
      <input id="track-title" placeholder="Track Title">
      <input id="artist-name" placeholder="Artist Name">

      <select id="release-type">
        <option>Single</option>
        <option>EP</option>
        <option>Album</option>
      </select>

      <input id="release-date" type="date">
      <input id="cover-upload" type="file">
      <input id="track-upload" type="file">

      <button id="upload-track-btn">Publish Release</button>
      ` : ""}
    </div>
  `

  document.getElementById("signout-btn").addEventListener("click", signOut)

  if (userRole === "artist") {
    document.getElementById("upload-track-btn")
      .addEventListener("click", uploadTrack)
  }

  loadTracks()
}

async function uploadTrack() {
  const title = document.getElementById("track-title").value
  const artist = document.getElementById("artist-name").value
  const releaseType = document.getElementById("release-type").value
  const releaseDate = document.getElementById("release-date").value
  const trackFile = document.getElementById("track-upload").files[0]
  const coverFile = document.getElementById("cover-upload").files[0]

  const trackPath = `${Date.now()}-${trackFile.name}`
  const coverPath = `${Date.now()}-${coverFile.name}`

  await supabase.storage.from("tracks").upload(trackPath, trackFile)
  await supabase.storage.from("covers").upload(coverPath, coverFile)

  const audio_url = supabase.storage.from("tracks").getPublicUrl(trackPath).data.publicUrl
  const cover_url = supabase.storage.from("covers").getPublicUrl(coverPath).data.publicUrl

  await supabase.from("tracks").insert([{
    title,
    artist,
    release_type: releaseType,
    release_date: releaseDate,
    audio_url,
    cover_url,
    streams: 0
  }])

  alert("Release Published")
  loadTracks()
}

async function loadTracks() {
  const { data } = await supabase
    .from("tracks")
    .select("*")
    .order("streams", { ascending: false })

  if (!data?.length) return

  document.getElementById("featured-content").innerHTML = `
    <img src="${data[0].cover_url}" width="200">
    <h2>${data[0].title}</h2>
    <p>${data[0].artist}</p>
  `

  document.getElementById("trending-list").innerHTML =
    data.map(track => `
      <div class="track-card">
        <img src="${track.cover_url}" width="100">
        <h3>${track.title}</h3>
        <audio controls src="${track.audio_url}"></audio>
      </div>
    `).join("")
}

async function signOut() {
  await supabase.auth.signOut()
  location.reload()
}

supabase.auth.onAuthStateChange((event, session) => {
  if (session) showProfile()
})