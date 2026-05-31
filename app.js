let pendingEmail = "";
let pendingPassword = "";
let currentUser = null;

function showSignupForm() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password first");
    return;
  }

  pendingEmail = email;
  pendingPassword = password;

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("signup-details").classList.remove("hidden");
}

async function completeSignup() {
  const fullName = document.getElementById("fullName").value.trim();
  const username = document.getElementById("username").value.trim();
  const role = document.getElementById("role").value;

  if (!fullName || !username) {
    alert("Fill out all profile details");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email: pendingEmail,
    password: pendingPassword
  });

  if (error) {
    alert(error.message);
    return;
  }

  await supabase.from("profiles").insert([
    {
      id: data.user.id,
      full_name: fullName,
      username,
      role
    }
  ]);

  alert("Account created. Login now.");

  document.getElementById("signup-details").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
}

async function signIn() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  currentUser = data.user;

  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("upload-section").classList.remove("hidden");
  document.getElementById("tracks-section").classList.remove("hidden");

  loadTracks();
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];
  const title = document.getElementById("trackTitle").value.trim();

  if (!file || !title) return alert("Add title and file");

  const fileName = `${Date.now()}-${file.name}`;

  await supabase.storage.from("music").upload(fileName, file);

  const { data } = supabase.storage.from("music").getPublicUrl(fileName);

  await supabase.from("tracks").insert([
    { title, file_url: data.publicUrl }
  ]);

  loadTracks();
}

async function loadTracks() {
  const { data } = await supabase
    .from("tracks")
    .select("*")
    .order("id", { ascending: false });

  const trackList = document.getElementById("trackList");
  trackList.innerHTML = "";

  data.forEach(track => {
    trackList.innerHTML += `
      <div class="track">
        <h3>${track.title}</h3>
        <audio controls src="${track.file_url}"></audio>
      </div>
    `;
  });
}