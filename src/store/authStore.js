import { create } from 'zustand'
import { login, register, logout, getCurrentUser } from '../services/authService'

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

  register: async (email, password, fullName) => {
    set({ loading: true, error: null })
    try {
      const data = await register(email, password, fullName)
      set({ user: data.user, loading: false })
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