import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = 'https://wtetpifsildutbomreds.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind0ZXRwaWZzaWxkdXRib21yZWRzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTk4NTcsImV4cCI6MjA5NTgzNTg1N30.rMCPUyF-dVmKaUAtGSVKfbz4BhI4NxxEwXxgWe2Fg0w'

const supabase = createClient(supabaseUrl, supabaseKey)

// Screens
const authScreen = document.getElementById('auth-screen')
const signupScreen = document.getElementById('signup-screen')
const dashboardScreen = document.getElementById('dashboard-screen')

// Screen Switcher
function showScreen(screen) {
  authScreen.style.display = 'none'
  signupScreen.style.display = 'none'
  dashboardScreen.style.display = 'none'
  screen.style.display = 'flex'
}

// Password Validation
function validatePassword(password) {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/
  return regex.test(password)
}

// =========================
// CREATE ACCOUNT
// =========================
document.getElementById('create-account-btn').addEventListener('click', () => {
  showScreen(signupScreen)
})

// =========================
// SIGNUP SUBMIT
// =========================
document.getElementById('signup-submit').addEventListener('click', async () => {
  const name = document.getElementById('signup-name').value
  const email = document.getElementById('signup-email').value
  const password = document.getElementById('signup-password').value
  const role = document.querySelector('input[name="role"]:checked')?.value

  if (!name || !email || !password || !role) {
    alert('Fill out all fields')
    return
  }

  if (!validatePassword(password)) {
    alert('Password must include:\n• 1 capital letter\n• 1 number\n• 1 symbol\n• 8+ characters')
    return
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        role: role
      },
      emailRedirectTo: 'https://stackfiendllc-debug.github.io/stack-fiend-music-app/'
    }
  })

  if (error) {
    alert(error.message)
    return
  }

  alert('Check your email to confirm your account.')
  showScreen(authScreen)
})

// =========================
// GOOGLE LOGIN
// =========================
document.getElementById('google-login').addEventListener('click', async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'https://stackfiendllc-debug.github.io/stack-fiend-music-app/'
    }
  })

  if (error) alert(error.message)
})

// =========================
// APPLE LOGIN (COMING SOON)
// =========================
document.getElementById('apple-login').addEventListener('click', () => {
  alert('Apple Sign-In Coming Soon 🚀')
})

// =========================
// PHONE LOGIN
// =========================
document.getElementById('phone-login').addEventListener('click', async () => {
  const phone = prompt('Enter your phone number')

  if (!phone) return

  const { error } = await supabase.auth.signInWithOtp({
    phone
  })

  if (error) {
    alert(error.message)
  } else {
    alert('OTP sent to your phone.')
  }
})

// =========================
// EMAIL LOGIN
// =========================
document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value
  const password = document.getElementById('login-password').value

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    alert(error.message)
    return
  }

  showScreen(dashboardScreen)
})

// =========================
// AUTH STATE CHECK
// =========================
supabase.auth.onAuthStateChange((event, session) => {
  if (session) {
    showScreen(dashboardScreen)
  } else {
    showScreen(authScreen)
  }
})

// =========================
// INITIAL LOAD
// =========================
async function init() {
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    showScreen(dashboardScreen)
  } else {
    showScreen(authScreen)
  }
}

init()