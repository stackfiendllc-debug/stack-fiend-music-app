let currentUser = null;

document.addEventListener("DOMContentLoaded", async () => {
  checkSession();
});

async function checkSession() {
  const { data } = await supabase.auth.getSession();

  if (data.session) {
    currentUser = data.session.user;
    showLoggedInView();
  }
}

function showLoggedInView() {
  document.getElementById("auth-section").style.display = "none";
  document.getElementById("upload-section").classList.remove("hidden");
  document.getElementById("tracks-section").classList.remove("hidden");
  loadTracks();
}

async function signUp() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Signup successful. Now login.");
  }
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
  showLoggedInView();
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];
  const title = document.getElementById("trackTitle").value.trim();

  if (!file || !title) {
    alert("Add title and file");
    return;
  }

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) {
    alert(uploadError.message);
    return;
  }

  const { data } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("tracks")
    .insert([
      {
        title,
        file_url: data.publicUrl
      }
    ]);

  if (error) {
    alert(error.message);
    return;
  }

  alert("Track uploaded");
  loadTracks();
}

async function loadTracks() {
  const { data, error } = await supabase
    .from("tracks")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.log(error);
    return;
  }

  const trackList = document.getElementById("trackList");
  trackList.innerHTML = "";

  data.forEach(track => {
    trackList.innerHTML += `
      <div class="track">
        <h3>${track.title}</h3>
        <audio controls>
          <source src="${track.file_url}">
        </audio>
      </div>
    `;
  });
}