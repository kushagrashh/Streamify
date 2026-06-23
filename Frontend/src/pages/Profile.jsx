import { useState, useEffect, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import { userAPI, dashboardAPI } from '../api'
import { AuthContext } from '../context/AuthContext'
import './Profile.css'

function Profile() {
  const { username } = useParams()
  const { user: currentUser } = useContext(AuthContext)
  const [profile, setProfile] = useState(null)
  const [videos, setVideos] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProfile()
  }, [username])

  useEffect(() => {
    if (currentUser && currentUser.username === username) {
      fetchDashboardStats()
    }
  }, [username, currentUser])

  const fetchProfile = async () => {
    setLoading(true)
    try {
      const response = await userAPI.getUserChannelProfile(username)
      setProfile(response.data)
      setVideos(response.data.videos || [])
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      const statsResponse = await dashboardAPI.getChannelStats()
      setStats(statsResponse.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading profile...</div>
  }

  if (!profile) {
    return <div className="error-message">Profile not found</div>
  }

  const isOwnProfile = currentUser && currentUser.username === username

  return (
    <div className="profile-page">
      <div className="cover-section">
        {profile.coverImage && (
          <img src={profile.coverImage} alt="Cover" className="cover-image" />
        )}
      </div>

      <div className="profile-header">
        <img src={profile.avatar} alt={profile.fullName} className="avatar" />
        <div className="profile-info">
          <h1>{profile.fullName}</h1>
          <p className="username">@{profile.username}</p>
          
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{videos.length}</span>
              <span className="stat-label">Videos</span>
            </div>
            <div className="stat">
              <span className="stat-value">{profile.subscribersCount || 0}</span>
              <span className="stat-label">Subscribers</span>
            </div>
            {isOwnProfile && stats && (
              <>
                <div className="stat">
                  <span className="stat-value">{stats.totalViews || 0}</span>
                  <span className="stat-label">Total Views</span>
                </div>
              </>
            )}
          </div>
        </div>

        {isOwnProfile && (
          <div className="profile-actions">
            <Link to="/upload" className="btn-upload">📤 Upload Video</Link>
            <Link to="/my-videos" className="btn-manage">⚙️ Manage Videos</Link>
          </div>
        )}
      </div>

      <div className="videos-section">
        <h2>Videos</h2>
        
        {videos.length === 0 ? (
          <p className="no-videos">No videos yet</p>
        ) : (
          <div className="videos-grid">
            {videos.map(video => (
              <Link key={video._id} to={`/video/${video._id}`} className="video-card">
                <div className="video-thumbnail">
                  <img src={video.thumbnail} alt={video.title} />
                </div>
                <div className="video-info">
                  <h3 className="video-title">{video.title}</h3>
                  <p className="video-meta">
                    {video.views} views • {formatDate(video.createdAt)}
                  </p>
                  {!video.isPublished && (
                    <span className="unpublished-badge">Unpublished</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export default Profile
