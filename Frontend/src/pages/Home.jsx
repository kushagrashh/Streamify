import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { videoAPI } from '../api'
import './Home.css'

function Home() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true)
      setError('')
      try {
        const params = {
          isPublished: true,
          limit: 12,
          page: searchParams.get('page') || 1,
        }

        if (searchParams.get('search')) {
          params.searchQuery = searchParams.get('search')
        }

        const response = await videoAPI.getAllVideos(params)
        setVideos(response.data?.videos || [])
      } catch (err) {
        setError(err.message || 'Failed to load videos')
        setVideos([])
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [searchParams])

  if (loading) {
    return <div className="loading">Loading videos...</div>
  }

  return (
    <div className="home-page">
      <h1 className="page-title">Videos</h1>

      {error && <div className="error-message">{error}</div>}

      {videos.length === 0 ? (
        <div className="no-videos">
          <p>No videos found</p>
        </div>
      ) : (
        <div className="videos-grid">
          {videos.map(video => (
            <Link key={video._id} to={`/video/${video._id}`} className="video-card">
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <span className="video-duration">{formatDuration(video.duration)}</span>
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

function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
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

export default Home
