# Streamify Frontend

A modern, fully-functional React frontend for your Streamify backend. Built with React 18, React Router v6, and Vite.

## Features

✅ **Authentication**
- User registration with avatar and cover image upload
- User login with JWT tokens
- Secure logout
- Protected routes

✅ **Video Management**
- Browse and search videos
- Upload new videos with thumbnails
- Manage your uploaded videos
- View video details with player
- Toggle video publish status
- Delete videos

✅ **Video Interaction**
- Like/Unlike videos
- Add comments on videos
- Delete your own comments
- View video views and metadata
- Watch history tracking

✅ **User Features**
- User profiles with channel information
- Subscribe/Unsubscribe to channels
- View channel statistics (for your own channel)
- Update profile information
- Change password

✅ **Organization**
- Create and manage playlists
- Add/remove videos from playlists
- Browse playlists

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Navbar.css
│   └── Sidebar.css
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── VideoDetail.jsx
│   ├── Upload.jsx
│   ├── Profile.jsx
│   ├── MyVideos.jsx
│   ├── Playlist.jsx
│   └── (CSS files for each page)
├── context/
│   └── AuthContext.jsx
├── api.js
├── App.jsx
├── App.css
├── index.jsx
└── index.css
```

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm installed
- Backend server running on `http://localhost:8000`
- Modern web browser

### Installation

1. **Create a new directory structure:**
```bash
mkdir streamify-frontend
cd streamify-frontend
```

2. **Copy all files into the project:**
   - Copy all `.jsx` files to `src/` directory
   - Copy all `.css` files to their respective component directories
   - Copy `index.html`, `package.json`, `vite.config.js` to the root directory
   - Copy `index.css` to `src/` directory

3. **Install dependencies:**
```bash
npm install
```

4. **Update your file structure to match:**
```
streamify-frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── index.jsx
│   ├── index.css
│   ├── App.jsx
│   ├── App.css
│   ├── api.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   └── Sidebar.jsx
│   │   └── Sidebar.css
│   ├── context/
│   │   └── AuthContext.jsx
│   └── pages/
│       ├── Home.jsx
│       ├── Home.css
│       ├── Login.jsx
│       ├── Auth.css
│       ├── Register.jsx
│       ├── VideoDetail.jsx
│       ├── VideoDetail.css
│       ├── Upload.jsx
│       ├── Upload.css
│       ├── Profile.jsx
│       ├── Profile.css
│       ├── MyVideos.jsx
│       ├── MyVideos.css
│       ├── Playlist.jsx
│       └── Playlist.css
```

### Running the Application

1. **Start the development server:**
```bash
npm run dev
```

2. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The frontend will connect to your backend at `http://localhost:8000`

3. **Build for production:**
```bash
npm run build
```

## API Integration

All API calls are centralized in `src/api.js`. The app communicates with your backend at:
- Base URL: `http://localhost:8000/api/v1`

### Supported Endpoints

The frontend is fully integrated with all your backend endpoints:

- **Auth**: Register, Login, Logout, Get Current User
- **Videos**: Get all videos, Get video by ID, Upload, Update, Delete, Toggle publish status
- **Comments**: Get comments, Add comment, Update comment, Delete comment
- **Likes**: Toggle video/comment/tweet likes, Get liked videos
- **Subscriptions**: Toggle subscription, Get subscribers, Get subscribed channels
- **Playlists**: Create, Read, Update, Delete, Add/Remove videos
- **Users**: Get channel profile, Get watch history
- **Dashboard**: Get channel stats, Get channel videos

## Key Components

### Authentication
- Automatic auth check on app load
- Protected routes for authenticated users
- JWT token handling via cookies

### Video Management
- Grid layout for video browsing
- Responsive design for all screen sizes
- Real-time video upload progress
- Video filtering and search

### User Interaction
- Comment system with reply capability
- Like/Unlike functionality
- Subscription management
- Watch history tracking

## Styling

The app uses a clean, modern design with:
- Responsive grid layouts
- Smooth transitions and animations
- Streamify-inspired color scheme
- Mobile-friendly design
- Accessible UI components

## Environment Variables

Make sure your backend is running on `http://localhost:8000`. If you need to change the backend URL, update the `API_URL` in `src/api.js`.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

1. **Hot Module Replacement (HMR)**: Changes are automatically reflected in the browser
2. **React DevTools**: Install the React DevTools extension for easier debugging
3. **Network Requests**: Check the Network tab in DevTools to monitor API calls
4. **Console Errors**: Check the browser console for any errors

## Common Issues

### Backend Connection Issues
- Make sure the backend is running on `http://localhost:8000`
- Check CORS settings in your backend (should allow `http://localhost:3000`)

### Upload Issues
- Ensure file sizes are reasonable
- Check that Cloudinary credentials are set in the backend

### Authentication Issues
- Clear cookies if you have authentication problems
- Check the browser's Application tab > Cookies

## Performance Optimization

The app includes:
- Code splitting via React Router
- Lazy loading of components
- Image optimization with responsive thumbnails
- Efficient state management with React Context

## Future Enhancements

- Dark mode support
- Advanced search filters
- Video recommendations
- Notifications system
- Real-time chat
- Video analytics

## License

ISC

## Support

For issues or questions, refer to your backend documentation or check the backend repository.

---

**Happy coding! 🚀**
