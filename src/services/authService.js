import { supabase } from '../lib/supabase'


// Ro'yxatdan o'tish
export const register = async (email, password, fullName) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: window.location.origin,
      data: { full_name: fullName }
    }
  })
  if (error) throw error
  return data
}

// Kirish
export const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

// Chiqish
export const logout = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Joriy user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Google bilan kirish
export const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
  if (error) throw error
  return data
}