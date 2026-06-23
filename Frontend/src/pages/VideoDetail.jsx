import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { videoAPI, commentAPI, likeAPI, subscriptionAPI } from '../api'
import { AuthContext } from '../context/AuthContext'
import './VideoDetail.css'

function VideoDetail() {
  const { videoId } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  useEffect(() => {
    fetchVideo()
    fetchComments()
  }, [videoId])

  const fetchVideo = async () => {
    try {
      const response = await videoAPI.getVideoById(videoId)
      setVideo(response.data)
    } catch (error) {
      console.error('Failed to load video:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const response = await commentAPI.getVideoComments(videoId, { limit: 10 })
      setComments(response.data || [])
    } catch (error) {
      console.error('Failed to load comments:', error)
    }
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) return

    try {
      await commentAPI.addComment(videoId, newComment)
      setNewComment('')
      fetchComments()
    } catch (error) {
      console.error('Failed to add comment:', error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return

    try {
      await commentAPI.deleteComment(commentId)
      fetchComments()
    } catch (error) {
      console.error('Failed to delete comment:', error)
    }
  }

  const handleToggleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await likeAPI.toggleVideoLike(videoId)
      setIsLiked(!isLiked)
    } catch (error) {
      console.error('Failed to toggle like:', error)
    }
  }

  const handleToggleSubscription = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await subscriptionAPI.toggleSubscription(video.owner._id)
      setIsSubscribed(!isSubscribed)
    } catch (error) {
      console.error('Failed to toggle subscription:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading video...</div>
  }

  if (!video) {
    return <div className="error-message">Video not found</div>
  }

  return (
    <div className="video-detail-page">
      <div className="video-player-section">
        <video controls className="video-player" src={video.videoFile} />
      </div>

      <div className="video-info-section">
        <h1 className="video-title">{video.title}</h1>

        <div className="video-meta">
          <span className="views">{video.views} views</span>
          <span className="date">{formatDate(video.createdAt)}</span>
        </div>

        <div className="channel-section">
          <Link to={`/profile/${video.owner.username}`} className="channel-link">
            <img src={video.owner.avatar} alt={video.owner.username} className="channel-avatar" />
            <div>
              <p className="channel-name">{video.owner.fullName}</p>
              <p className="channel-handle">@{video.owner.username}</p>
            </div>
          </Link>

          {user && user._id !== video.owner._id && (
            <button className={`btn-subscribe ${isSubscribed ? 'subscribed' : ''}`} onClick={handleToggleSubscription}>
              {isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        <div className="actions-bar">
          <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleToggleLike}>
            👍 Like
          </button>
          <button className="action-btn">
            💬 {comments.length}
          </button>
          <button className="action-btn">
            📤 Share
          </button>
        </div>

        <div className="description">
          <p>{video.description}</p>
        </div>
      </div>

      <div className="comments-section">
        <h2>Comments</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleAddComment}>
            <img src={user.avatar} alt={user.username} className="comment-avatar" />
            <div className="comment-input-wrapper">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="comment-input"
              />
              <button type="submit" className="btn-comment" disabled={!newComment.trim()}>
                Comment
              </button>
            </div>
          </form>
        ) : (
          <p className="comment-login-prompt">
            <Link to="/login">Sign in</Link> to comment on this video
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <p className="no-comments">No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment._id} className="comment-item">
                <img src={comment.owner.avatar} alt={comment.owner.username} className="comment-avatar" />
                <div className="comment-content">
                  <div className="comment-header">
                    <p className="comment-author">{comment.owner.fullName}</p>
                    <span className="comment-date">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="comment-text">{comment.content}</p>
                  {user && user._id === comment.owner._id && (
                    <button
                      className="btn-delete-comment"
                      onClick={() => handleDeleteComment(comment._id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
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

export default VideoDetail
