import { supabase } from './supabase.js'

const authScreen = document.getElementById('auth-screen')
const profileScreen = document.getElementById('profile-screen')
const musicScreen = document.getElementById('music-screen')

const email = document.getElementById('email')
const password = document.getElementById('password')

// Check session after OAuth redirect
async function checkSession() {
  const {
    data: { session }
  } = await supabase.auth.getSession()

  if (session) {
    authScreen.classList.add('hidden')
    profileScreen.classList.add('hidden')
    musicScreen.classList.remove('hidden')
  }
}

checkSession()

function validatePassword(passwordValue) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(passwordValue)
}

// Create account
document.getElementById('signup-btn').onclick = async () => {
  if (!validatePassword(password.value)) {
    alert(
      'Password must include:\n• 1 uppercase letter\n• 1 number\n• 1 symbol\n• minimum 8 characters'
    )
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
    return
  }

  authScreen.classList.add('hidden')
  profileScreen.classList.remove('hidden')
}

// Login
document.getElementById('login-btn').onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
    return
  }

  authScreen.classList.add('hidden')
  musicScreen.classList.remove('hidden')
}

// Google OAuth
document.getElementById('google-login').onclick = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://stackfiendllc-debug.github.io/stack-fiend-music-app/'
    }
  })

  if (error) {
    alert(error.message)
  }
}

// Apple placeholder
document.getElementById('apple-login').onclick = () => {
  alert('Apple Sign In Coming Soon')
}

// Profile setup
document.getElementById('create-profile-btn').onclick = async () => {
  authScreen.classList.add('hidden')
  profileScreen.classList.add('hidden')
  musicScreen.classList.remove('hidden')
}

// Listen for auth changes
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    authScreen.classList.add('hidden')
    profileScreen.classList.add('hidden')
    musicScreen.classList.remove('hidden')
  }
})