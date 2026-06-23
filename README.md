# Streamify

A full-stack video sharing platform built with the MERN stack. Users can upload, browse, and watch videos, subscribe to channels, create playlists, leave comments, and interact with content through likes — all backed by Cloudinary for media storage and JWT for secure authentication.

---

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Cloudinary (video & image storage)
- JWT (access + refresh token auth)
- Multer (file upload handling)
- bcrypt (password hashing)

**Frontend**
- React 18 + Vite
- React Router v6
- Context API (auth state)

---

## Features

- **Authentication** — Register, login, logout with HTTP-only cookie-based JWT. Auto-refresh via refresh tokens.
- **Video Upload** — Upload videos with a title, description, and thumbnail. Files are stored on Cloudinary; duration is read automatically.
- **Browse & Watch** — Paginated video feed with search by title/description. View count increments on each watch.
- **Channel Profiles** — Public profile pages showing subscriber count, uploaded videos, and a subscribe/unsubscribe button.
- **Subscriptions** — Subscribe to channels and track subscriptions.
- **Comments** — Add and view comments on videos.
- **Likes** — Like videos, comments, and tweets.
- **Playlists** — Create and manage video playlists.
- **Tweets** — Short community posts tied to your channel.
- **Watch History** — Track previously watched videos per user.
- **Dashboard** — Channel stats (views, subscribers, video count).
- **My Videos** — Manage your uploads; toggle publish/unpublish.
- **Avatar & Cover Image** — Upload and update profile images via Cloudinary.

---

## Project Structure

```
Streamify/
├── Backend/
│   ├── src/
│   │   ├── controllers/      # Business logic
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # Express route definitions
│   │   ├── middlewares/      # Auth, Multer
│   │   ├── utils/            # ApiError, ApiResponse, asyncHandler, Cloudinary
│   │   ├── db/               # MongoDB connection
│   │   ├── app.js            # Express app setup
│   │   └── index.js          # Entry point
│   └── .env
│
└── Frontend/
    ├── src/
    │   ├── pages/            # Home, Login, Register, Upload, VideoDetail, Profile, MyVideos, Playlist
    │   ├── components/       # Navbar, Sidebar
    │   ├── context/          # AuthContext
    │   └── api.js            # Axios/fetch API helpers
    ├── index.html
    └── .env
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

---

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in `Backend/`:

```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
DB_NAME=streamify
CORS_ORIGIN=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=7d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
```

Start the dev server:

```bash
npm run dev
```

The backend runs on `http://localhost:8000`.

---

### Frontend Setup

```bash
cd "Frontend"
npm install
```

Create a `.env` file in `yt fronend/`:

```env
VITE_API_URL=http://localhost:8000/api/v1
VITE_BACKEND_URL=http://localhost:8000
VITE_APP_NAME=Streamify
VITE_APP_DESCRIPTION=A Streamify Application
```

Start the dev server:

```bash
npm run dev
```

The frontend runs on `http://localhost:3000`.

---

## API Reference

All routes are prefixed with `/api/v1`.

| Resource | Base Path |
|---|---|
| Health Check | `/healthcheck` |
| Users | `/user` |
| Videos | `/videos` |
| Comments | `/comments` |
| Likes | `/likes` |
| Playlists | `/playlist` |
| Subscriptions | `/subscriptions` |
| Tweets | `/tweets` |
| Dashboard | `/dashboard` |

### Key Endpoints

**Auth**
```
POST   /user/register          Register with avatar + optional cover image
POST   /user/login             Login (sets httpOnly cookies)
POST   /user/logout            Logout (clears cookies)
POST   /user/refresh-token     Refresh access token
GET    /user/current-user      Get logged-in user
PATCH  /user/update-account    Update fullName / email
PATCH  /user/avatar            Update avatar
PATCH  /user/cover-image       Update cover image
GET    /user/c/:username       Get channel profile
GET    /user/history           Get watch history
```

**Videos**
```
GET    /videos                 Get all videos (supports ?query=, ?page=, ?limit=, ?sortBy=)
POST   /videos                 Upload a video (multipart: videoFile + thumbnail)
GET    /videos/:videoId        Get single video (increments view count)
PATCH  /videos/:videoId        Update title, description, or thumbnail
DELETE /videos/:videoId        Delete a video
PATCH  /videos/toggle/publish/:videoId  Toggle publish status
```

**Comments**
```
GET    /comments/:videoId      Get comments for a video
POST   /comments/:videoId      Add a comment
PATCH  /comments/c/:commentId  Update a comment
DELETE /comments/c/:commentId  Delete a comment
```

**Likes**
```
POST   /likes/toggle/v/:videoId    Toggle like on a video
POST   /likes/toggle/c/:commentId  Toggle like on a comment
POST   /likes/toggle/t/:tweetId    Toggle like on a tweet
GET    /likes/videos               Get all liked videos
```

**Playlists**
```
POST   /playlist                        Create playlist
GET    /playlist/:playlistId            Get playlist
PATCH  /playlist/:playlistId            Update playlist
DELETE /playlist/:playlistId            Delete playlist
POST   /playlist/add/:videoId/:playlistId    Add video to playlist
DELETE /playlist/remove/:videoId/:playlistId Remove video from playlist
GET    /playlist/user/:userId           Get all playlists by user
```

**Subscriptions**
```
POST   /subscriptions/c/:channelId   Toggle subscribe/unsubscribe
GET    /subscriptions/c/:channelId   Get channel subscribers
GET    /subscriptions/u/:subscriberId Get subscribed channels
```

**Dashboard**
```
GET    /dashboard/stats    Channel stats (video count, views, subscribers)
GET    /dashboard/videos   All videos for the logged-in channel
```

---

## Frontend Pages

| Path | Page | Auth Required |
|---|---|---|
| `/` | Home — video feed | No |
| `/login` | Login | No (redirects if logged in) |
| `/register` | Register | No (redirects if logged in) |
| `/upload` | Upload a video | Yes |
| `/video/:videoId` | Video player + comments | No |
| `/profile/:username` | Channel profile | No |
| `/my-videos` | Manage your videos | Yes |
| `/playlist/:playlistId` | View playlist | No |

---

## Author

**Kushagra Sharma**
