import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoDetail from './pages/VideoDetail'
import Upload from './pages/Upload'
import Profile from './pages/Profile'
import MyVideos from './pages/MyVideos'
import Playlist from './pages/Playlist'
import { AuthContext } from './context/AuthContext'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/user/current-user', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data) {
            setUser(data.data)
          }
        }
      } catch (error) {
        console.log('Not logged in')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    setUser(null)
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogout }}>
      <Router>
        {/* BUG FIX: Navbar and Sidebar were imported but never rendered.
            They must be placed inside <Router> so that Link components work. */}
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <div style={{ display: 'flex' }}>
          <Sidebar isOpen={sidebarOpen} />

          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/"                   element={<Home />} />
              <Route path="/login"              element={!user ? <Login />    : <Navigate to="/" />} />
              <Route path="/register"           element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/upload"             element={user  ? <Upload />   : <Navigate to="/login" />} />
              <Route path="/video/:videoId"     element={<VideoDetail />} />
              <Route path="/profile/:username"  element={<Profile />} />
              <Route path="/my-videos"          element={user  ? <MyVideos /> : <Navigate to="/login" />} />
              <Route path="/playlist/:playlistId" element={<Playlist />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthContext.Provider>
  )
}

export default App
