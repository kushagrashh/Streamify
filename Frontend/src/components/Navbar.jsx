import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { authAPI } from '../api'
import './Navbar.css'

function Navbar({ onMenuClick }) {
  const { user, setUser } = useContext(AuthContext)
  const [showDropdown, setShowDropdown] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    try {
      await authAPI.logout()
      setUser(null)
      setShowDropdown(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>☰</button>
        <Link to="/" className="logo">
          <span className="logo-text">Streamify</span>
        </Link>
      </div>

      <div className="navbar-center">
        <form className="search-form" onSubmit={(e) => {
          e.preventDefault()
          if (searchQuery.trim()) {
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
          }
        }}>
          <input
            type="text"
            placeholder="Search videos..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>

      <div className="navbar-right">
        {user ? (
          <div className="user-menu">
            <Link to="/upload" className="upload-btn">📤 Upload</Link>
            <div className="user-profile-dropdown">
              <button className="user-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <img src={user.avatar} alt={user.username} className="user-avatar" />
              </button>
              {showDropdown && (
                <div className="dropdown-menu">
                  <Link to={`/profile/${user.username}`} className="dropdown-item">
                    👤 Profile
                  </Link>
                  <Link to="/my-videos" className="dropdown-item">
                    🎥 My Videos
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/register" className="btn-register">Register</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
