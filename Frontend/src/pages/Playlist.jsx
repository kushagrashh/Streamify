import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { playlistAPI } from '../api'
import './Playlist.css'

function Playlist() {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlaylist()
  }, [playlistId])

  const fetchPlaylist = async () => {
    setLoading(true)
    try {
      const response = await playlistAPI.getPlaylistById(playlistId)
      setPlaylist(response.data)
      setVideos(response.data.videos || [])
    } catch (error) {
      console.error('Failed to load playlist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading playlist...</div>
  }

  if (!playlist) {
    return <div className="error-message">Playlist not found</div>
  }

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <h1>{playlist.name}</h1>
        <p className="playlist-description">{playlist.description}</p>
        <p className="video-count">{videos.length} videos</p>
      </div>

      {videos.length === 0 ? (
        <div className="no-videos">
          <p>This playlist is empty</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map(video => (
            <Link key={video._id} to={`/video/${video._id}`} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
              </div>
              <div className="video-info">
                <h3 className="video-title">{video.title}</h3>
                <p className="video-channel">@{video.owner?.username || 'Unknown'}</p>
                <p className="video-meta">
                  {video.views} views • {formatDate(video.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
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

export default Playlist
