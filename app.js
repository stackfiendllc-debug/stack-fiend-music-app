import { supabase } from './supabase.js'

const authScreen = document.getElementById('auth-screen')
const profileScreen = document.getElementById('profile-screen')
const musicScreen = document.getElementById('music-screen')
const accountScreen = document.getElementById('account-screen')

const email = document.getElementById('email')
const password = document.getElementById('password')

function showScreen(screen) {
  authScreen.classList.add('hidden')
  profileScreen.classList.add('hidden')
  musicScreen.classList.add('hidden')
  accountScreen.classList.add('hidden')

  screen.classList.remove('hidden')
}

async function loadAccountInfo() {
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) return

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  document.getElementById('account-email').innerText = user.email
  document.getElementById('account-name').innerText =
    profile?.full_name || 'No name set'
  document.getElementById('account-role').innerText =
    profile?.role || 'Listener'
}

async function checkUser() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (!session) {
    showScreen(authScreen)
    return
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    showScreen(profileScreen)
  } else {
    showScreen(musicScreen)
    loadAccountInfo()
  }
}

checkUser()

function validatePassword(passwordValue) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(passwordValue)
}

document.getElementById('signup-btn').onclick = async () => {
  if (!validatePassword(password.value)) {
    alert('Password needs uppercase, number, symbol')
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) alert(error.message)
  else showScreen(profileScreen)
}

document.getElementById('login-btn').onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) alert(error.message)
  else checkUser()
}

document.getElementById('google-login').onclick = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo:
        'https://stackfiendllc-debug.github.io/stack-fiend-music-app/'
    }
  })
}

document.getElementById('create-profile-btn').onclick = async () => {
  const fullname = document.getElementById('fullname').value
  const role = document.getElementById('role').value

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { error } = await supabase.from('profiles').insert([
    {
      id: user.id,
      full_name: fullname,
      role
    }
  ])

  if (error) {
    alert(error.message)
    return
  }

  showScreen(musicScreen)
  loadAccountInfo()
}

document.getElementById('account-btn').onclick = () => {
  showScreen(accountScreen)
}

document.getElementById('home-btn').onclick = () => {
  showScreen(musicScreen)
}

document.getElementById('signout-btn').onclick = async () => {
  await supabase.auth.signOut()
  showScreen(authScreen)
}

supabase.auth.onAuthStateChange(() => {
  checkUser()
})
document.getElementById('account-btn').onclick = () => {
  loadAccountInfo()
  showScreen(accountScreen)
}

document.getElementById('back-home-btn').onclick = () => {
  showScreen(musicScreen)
}

document.getElementById('home-btn').onclick = () => {
  showScreen(musicScreen)
}

document.getElementById('signout-btn').onclick = async () => {
  await supabase.auth.signOut()
  showScreen(authScreen)
}

document.getElementById('upload-track-btn').onclick = async () => {
  alert('Track upload enabled. Connect Supabase storage next.')
}