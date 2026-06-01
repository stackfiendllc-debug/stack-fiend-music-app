import { supabase } from './supabase.js'

const authScreen = document.getElementById('auth-screen')
const signupScreen = document.getElementById('signup-screen')
const dashboardScreen = document.getElementById('dashboard-screen')

function showScreen(screen) {
  authScreen.style.display = 'none'
  signupScreen.style.display = 'none'
  dashboardScreen.style.display = 'none'
  screen.style.display = 'flex'
}

showScreen(authScreen)

function validatePassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(password)
}

// Create account
document.getElementById('create-account-btn').onclick = () => {
  showScreen(signupScreen)
}

// Signup
document.getElementById('signup-submit').onclick = async () => {
  const name = document.getElementById('signup-name').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value
  const role = document.querySelector('input[name="role"]:checked')?.value

  if (!validatePassword(password)) {
    alert('Password needs capital letter, number, symbol.')
    return
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  })

  if (error) {
    alert(error.message)
  } else {
    alert('Account created. Check email.')
    showScreen(authScreen)
  }
}

// Login
document.getElementById('login-btn').onclick = async () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
  } else {
    showScreen(dashboardScreen)
  }
}

// Google
document.getElementById('google-login').onclick = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google'
  })
}

// Apple
document.getElementById('apple-login').onclick = () => {
  alert('Apple Sign-In Coming Soon 🚀')
}

// Phone
document.getElementById('phone-login').onclick = async () => {
  const phone = prompt('Enter phone number')

  if (!phone) return

  await supabase.auth.signInWithOtp({ phone })
}