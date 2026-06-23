const API_URL = 'http://localhost:8000/api/v1'

const apiCall = async (endpoint, options = {}) => {
  const defaultOptions = {
    credentials: 'include',
  }

  // ─── BUG FIX ─────────────────────────────────────────────────────────────
  // When body is a JSON string (JSON.stringify was called), we MUST set
  // Content-Type: application/json so Express's express.json() middleware
  // parses req.body correctly. Without this header, req.body is undefined
  // and the server throws "username or email is required" → HTML error page
  // → frontend crashes with "Unexpected token '<', "<!DOCTYPE"..."
  const headers = { ...options.headers }
  if (typeof options.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }
  // ─────────────────────────────────────────────────────────────────────────

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...headers,
    }
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, finalOptions)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'API Error')
    }

    return data
  } catch (error) {
    throw error
  }
}

export const authAPI = {
  register: (formData) => apiCall('/user/register', {
    method: 'POST',
    body: formData,
    headers: {},   // let browser set multipart/form-data boundary automatically
  }),
  
  login: (credentials) => apiCall('/user/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    // Content-Type: application/json is now added automatically above
  }),

  logout: () => apiCall('/user/logout', { method: 'POST' }),

  getCurrentUser: () => apiCall('/user/current-user', { method: 'GET' }),

  updateProfile: (data) => apiCall('/user/update-account', {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  changePassword: (passwords) => apiCall('/user/change-password', {
    method: 'POST',
    body: JSON.stringify(passwords),
  }),

  updateAvatar: (formData) => apiCall('/user/avatar', {
    method: 'PATCH',
    body: formData,
    headers: {},
  }),

  updateCoverImage: (formData) => apiCall('/user/cover-image', {
    method: 'PATCH',
    body: formData,
    headers: {},
  }),
}

export const videoAPI = {
  getAllVideos: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/videos?${queryString}`, { method: 'GET' })
  },

  getVideoById: (videoId) => apiCall(`/videos/${videoId}`, { method: 'GET' }),

  publishVideo: (formData) => apiCall('/videos', {
    method: 'POST',
    body: formData,
    headers: {},
  }),

  updateVideo: (videoId, data) => apiCall(`/videos/${videoId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),

  updateVideoThumbnail: (videoId, formData) => apiCall(`/videos/${videoId}`, {
    method: 'PATCH',
    body: formData,
    headers: {},
  }),

  deleteVideo: (videoId) => apiCall(`/videos/${videoId}`, { method: 'DELETE' }),

  togglePublishStatus: (videoId) => apiCall(`/videos/toggle/publish/${videoId}`, {
    method: 'PATCH',
  }),
}

export const commentAPI = {
  getVideoComments: (videoId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/comments/${videoId}?${queryString}`, { method: 'GET' })
  },

  addComment: (videoId, content) => apiCall(`/comments/${videoId}`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  }),

  updateComment: (commentId, content) => apiCall(`/comments/c/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify({ content }),
  }),

  deleteComment: (commentId) => apiCall(`/comments/c/${commentId}`, {
    method: 'DELETE',
  }),
}

export const likeAPI = {
  toggleVideoLike: (videoId) => apiCall(`/likes/toggle/v/${videoId}`, {
    method: 'POST',
  }),

  toggleCommentLike: (commentId) => apiCall(`/likes/toggle/c/${commentId}`, {
    method: 'POST',
  }),

  toggleTweetLike: (tweetId) => apiCall(`/likes/toggle/t/${tweetId}`, {
    method: 'POST',
  }),

  getLikedVideos: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/likes/videos?${queryString}`, { method: 'GET' })
  },
}

export const subscriptionAPI = {
  toggleSubscription: (channelId) => apiCall(`/subscriptions/c/${channelId}`, {
    method: 'POST',
  }),

  getUserSubscribers: (channelId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/subscriptions/c/${channelId}/subscribers?${queryString}`, {
      method: 'GET',
    })
  },

  getSubscribedChannels: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/subscriptions/u/${userId}?${queryString}`, {
      method: 'GET',
    })
  },
}

export const playlistAPI = {
  createPlaylist: (data) => apiCall('/playlist', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getUserPlaylists: (userId, params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/playlist/user/${userId}?${queryString}`, {
      method: 'GET',
    })
  },

  getPlaylistById: (playlistId) => apiCall(`/playlist/${playlistId}`, {
    method: 'GET',
  }),

  addVideoToPlaylist: (playlistId, videoId) => apiCall(`/playlist/add/${videoId}/${playlistId}`, {
    method: 'PATCH',
  }),

  removeVideoFromPlaylist: (playlistId, videoId) => apiCall(
    `/playlist/remove/${videoId}/${playlistId}`,
    { method: 'PATCH' }
  ),

  deletePlaylist: (playlistId) => apiCall(`/playlist/${playlistId}`, {
    method: 'DELETE',
  }),

  updatePlaylist: (playlistId, data) => apiCall(`/playlist/${playlistId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
}

export const userAPI = {
  getUserChannelProfile: (username) => apiCall(`/user/c/${username}`, {
    method: 'GET',
  }),

  getWatchHistory: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/user/history?${queryString}`, { method: 'GET' })
  },
}

export const dashboardAPI = {
  getChannelStats: () => apiCall('/dashboard/stats', { method: 'GET' }),

  getChannelVideos: (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    return apiCall(`/dashboard/videos?${queryString}`, { method: 'GET' })
  },
}
