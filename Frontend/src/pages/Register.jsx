import { useState, useContext } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { authAPI } from '../api'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const { setUser } = useContext(AuthContext)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
  })
  const [files, setFiles] = useState({
    avatar: null,
    coverImage: null,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const form = new FormData()
      form.append('username', formData.username)
      form.append('email', formData.email)
      form.append('fullName', formData.fullName)
      form.append('password', formData.password)
      
      if (files.avatar) {
        form.append('avatar', files.avatar)
      }
      if (files.coverImage) {
        form.append('coverImage', files.coverImage)
      }

      const response = await authAPI.register(form)
      if (response.data) {
        setUser(response.data.user)
        navigate('/')
      }
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Your Account</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Your Full Name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar (Profile Picture)</label>
            <input
              type="file"
              id="avatar"
              name="avatar"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <div className="form-group">
            <label htmlFor="coverImage">Cover Image</label>
            <input
              type="file"
              id="coverImage"
              name="coverImage"
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
