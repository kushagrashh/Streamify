import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardAPI, videoAPI } from '../api'
import './MyVideos.css'

function MyVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchVideos()
  }, [filter])

  const fetchVideos = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await dashboardAPI.getChannelVideos({ limit: 20 })
      let videos = response.data || []
      
      if (filter === 'published') {
        videos = videos.filter(v => v.isPublished)
      } else if (filter === 'unpublished') {
        videos = videos.filter(v => !v.isPublished)
      }
      
      setVideos(videos)
    } catch (err) {
      setError(err.message || 'Failed to load videos')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return

    try {
      await videoAPI.deleteVideo(videoId)
      setVideos(videos.filter(v => v._id !== videoId))
    } catch (error) {
      setError('Failed to delete video')
    }
  }

  const handleTogglePublish = async (videoId, isPublished) => {
    try {
      await videoAPI.togglePublishStatus(videoId)
      setVideos(videos.map(v => 
        v._id === videoId ? { ...v, isPublished: !isPublished } : v
      ))
    } catch (error) {
      setError('Failed to update video')
    }
  }

  if (loading) {
    return <div className="loading">Loading your videos...</div>
  }

  return (
    <div className="my-videos-page">
      <div className="page-header">
        <h1>My Videos</h1>
        <Link to="/upload" className="btn-new-video">📤 Upload New Video</Link>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Videos
        </button>
        <button
          className={`filter-btn ${filter === 'published' ? 'active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published
        </button>
        <button
          className={`filter-btn ${filter === 'unpublished' ? 'active' : ''}`}
          onClick={() => setFilter('unpublished')}
        >
          Unpublished
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="no-videos">
          <p>No videos yet</p>
          <Link to="/upload" className="btn-start">Start uploading</Link>
        </div>
      ) : (
        <div className="videos-table">
          <table>
            <thead>
              <tr>
                <th>Thumbnail</th>
                <th>Title</th>
                <th>Status</th>
                <th>Views</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map(video => (
                <tr key={video._id}>
                  <td className="thumbnail-cell">
                    <Link to={`/video/${video._id}`}>
                      <img src={video.thumbnail} alt={video.title} />
                    </Link>
                  </td>
                  <td className="title-cell">
                    <Link to={`/video/${video._id}`} className="video-title-link">
                      {video.title}
                    </Link>
                  </td>
                  <td className="status-cell">
                    <span className={`status-badge ${video.isPublished ? 'published' : 'unpublished'}`}>
                      {video.isPublished ? 'Published' : 'Unpublished'}
                    </span>
                  </td>
                  <td className="views-cell">{video.views}</td>
                  <td className="date-cell">{formatDate(video.createdAt)}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-action toggle"
                      onClick={() => handleTogglePublish(video._id, video.isPublished)}
                      title={video.isPublished ? 'Unpublish' : 'Publish'}
                    >
                      {video.isPublished ? '🔒' : '🔓'}
                    </button>
                    <Link
                      to={`/video/${video._id}`}
                      className="btn-action view"
                      title="View"
                    >
                      👁️
                    </Link>
                    <button
                      className="btn-action delete"
                      onClick={() => handleDelete(video._id)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export default MyVideos
