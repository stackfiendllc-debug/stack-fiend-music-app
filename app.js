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