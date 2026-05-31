let currentUser = null;

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) alert(error.message);
  else alert("Account created");
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
  } else {
    currentUser = data.user;
    document.getElementById("upload-section").classList.remove("hidden");
    loadTracks();
  }
}

async function uploadTrack() {
  const file = document.getElementById("musicFile").files[0];
  const title = document.getElementById("trackTitle").value;

  if (!file) return alert("Select a file");

  const fileName = `${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("music")
    .upload(fileName, file);

  if (uploadError) return alert(uploadError.message);

  const { data } = supabase.storage
    .from("music")
    .getPublicUrl(fileName);

  await supabase.from("tracks").insert([
    {
      title,
      file_url: data.publicUrl
    }
  ]);

  alert("Track uploaded");
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
        <audio controls>
          <source src="${track.file_url}" type="audio/mpeg">
        </audio>
      </div>
    `;
  });
}

loadTracks();