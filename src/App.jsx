
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Home from './pages/Home'
import Jobs from './pages/Jobs'
import Market from './pages/Market'
import Profile from './pages/Profile'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'
import useAuthStore from './store/authStore'
import PostNew from './pages/PostNew'
import Footer from './components/layout/Footer'
import JobDetail from './pages/JobDetail'
import ProductDetail from './pages/ProductDetail'
import Search from './pages/Search'

// App funksiyasi ichiga:
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}


function App() {
  const { setUser } = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/market" element={<Market />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/new" element={<PostNew />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/market/:id" element={<ProductDetail />} />
        <Route path="/search" element={<Search />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App