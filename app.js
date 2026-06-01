import { supabase } from './supabase.js'

const authScreen = document.getElementById('auth-screen')
const profileScreen = document.getElementById('profile-screen')
const musicScreen = document.getElementById('music-screen')

const email = document.getElementById('email')
const password = document.getElementById('password')

function validatePassword(password) {
  const strongPassword =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
  return strongPassword.test(password)
}

document.getElementById('signup-btn').onclick = async () => {
  if (!validatePassword(password.value)) {
    alert(
      'Password must contain 1 uppercase letter, 1 number, 1 symbol, minimum 8 characters'
    )
    return
  }

  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    authScreen.classList.add('hidden')
    profileScreen.classList.remove('hidden')
  }
}

document.getElementById('login-btn').onclick = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  })

  if (error) {
    alert(error.message)
  } else {
    authScreen.classList.add('hidden')
    musicScreen.classList.remove('hidden')
  }
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

document.getElementById('apple-login').onclick = () => {
  alert('Apple Sign In Coming Soon')
}

document.getElementById('create-profile-btn').onclick = () => {
  profileScreen.classList.add('hidden')
  musicScreen.classList.remove('hidden')
}