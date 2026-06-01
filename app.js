import { supabase } from './supabase.js'

const authScreen = document.getElementById('auth-screen')
const profileScreen = document.getElementById('profile-screen')
const musicScreen = document.getElementById('music-screen')

const email = document.getElementById('email')
const password = document.getElementById('password')

function showScreen(screen) {
  authScreen.classList.add('hidden')
  profileScreen.classList.add('hidden')
  musicScreen.classList.add('hidden')

  screen.classList.remove('hidden')
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
  }
}

checkUser()

function validatePassword(passwordValue) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(passwordValue)
}

// EMAIL SIGNUP
document.getElementById('signup-btn').onclick = async () => {
  if (!validatePassword(password.value)) {
    alert('Password needs uppercase, number, symbol')
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    showScreen(profileScreen)
  }
}

// LOGIN
document.getElementById('login-btn').onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    checkUser()
  }
}

// GOOGLE
document.getElementById('google-login').onclick = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo:
        'https://stackfiendllc-debug.github.io/stack-fiend-music-app/'
    }
  })
}

// CREATE PROFILE
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
      role: role
    }
  ])

  if (error) {
    alert(error.message)
    return
  }

  showScreen(musicScreen)
}

supabase.auth.onAuthStateChange(() => {
  checkUser()
})