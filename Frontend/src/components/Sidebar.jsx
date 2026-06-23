import { Link } from 'react-router-dom'
import './Sidebar.css'

function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <div className="sidebar-content">
        <Link to="/" className="sidebar-item">
          <span className="icon">🏠</span>
          <span className="label">Home</span>
        </Link>

        <Link to="/?sort=-createdAt" className="sidebar-item">
          <span className="icon">🔥</span>
          <span className="label">Trending</span>
        </Link>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <h3>You</h3>
          <Link to="/my-videos" className="sidebar-item">
            <span className="icon">📹</span>
            <span className="label">My Videos</span>
          </Link>
          <Link to="/?liked=true" className="sidebar-item">
            <span className="icon">👍</span>
            <span className="label">Liked Videos</span>
          </Link>
          <Link to="/?history=true" className="sidebar-item">
            <span className="icon">⏱️</span>
            <span className="label">Watch History</span>
          </Link>
        </div>

        <hr className="sidebar-divider" />

        <div className="sidebar-section">
          <h3>Subscriptions</h3>
          <p className="sidebar-note">Your subscribed channels will appear here</p>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
