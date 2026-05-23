import { create } from 'zustand'
import { login, register, logout, getCurrentUser, loginWithGoogle } from '../services/authService'

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true, error: null })
    try {
      const data = await login(email, password)
      set({ user: data.user, loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  loginWithGoogle: async () => {
    set({ loading: true, error: null })
    try {
      await loginWithGoogle()
      set({ loading: false })
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  register: async (email, password, fullName) => {
    set({ loading: true, error: null })
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      })
      if (error) throw error
      
      // Ro'yxatdan o'tgandan keyin avtomatik login
      if (data.user) {
        set({ user: data.user, loading: false })
      }
    } catch (error) {
      set({ error: error.message, loading: false })
    }
  },

  logout: async () => {
    await logout()
    set({ user: null })
  },

  init: async () => {
    const user = await getCurrentUser()
    set({ user })
  }
}))

export default useAuthStore