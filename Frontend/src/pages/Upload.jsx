import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { videoAPI } from '../api'
import './Upload.css'

function Upload() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })
  const [files, setFiles] = useState({
    videoFile: null,
    thumbnail: null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const { name, files: fileList } = e.target
    if (fileList.length > 0) {
      setFiles(prev => ({
        ...prev,
        [name]: fileList[0]
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!files.videoFile) {
      setError('Video file is required')
      setLoading(false)
      return
    }

    if (!files.thumbnail) {
      setError('Thumbnail is required')
      setLoading(false)
      return
    }

    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('description', formData.description)
      form.append('videoFile', files.videoFile)
      form.append('thumbnail', files.thumbnail)

      const response = await videoAPI.publishVideo(form)
      
      if (response.data) {
        navigate(`/video/${response.data._id}`)
      }
    } catch (err) {
      setError(err.message || 'Upload failed')
    } finally {
      setLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Video</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-section">
            <h2>Video Details</h2>

            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter video title"
                required
                maxLength="100"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your video"
                rows="5"
              ></textarea>
            </div>
          </div>

          <div className="form-section">
            <h2>Video & Thumbnail</h2>

            <div className="form-group">
              <label htmlFor="videoFile">Video File</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="videoFile"
                  name="videoFile"
                  onChange={handleFileChange}
                  accept="video/*"
                  required
                />
                <div className="file-info">
                  {files.videoFile ? (
                    <p>✓ {files.videoFile.name}</p>
                  ) : (
                    <p>Choose a video file (MP4, WebM, etc.)</p>
                  )}
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="thumbnail"
                  name="thumbnail"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                <div className="file-info">
                  {files.thumbnail ? (
                    <p>✓ {files.thumbnail.name}</p>
                  ) : (
                    <p>Choose a thumbnail image</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="progress-bar">
              <div className="progress" style={{ width: `${uploadProgress}%` }}>
                {uploadProgress}%
              </div>
            </div>
          )}

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate('/')}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Upload
