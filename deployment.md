# Netflix Clone Deployment Guide

This guide will walk you through deploying your Netflix Clone application with the backend on Render and frontend on Netlify/Vercel.

## 📋 Prerequisites

- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) 18+ installed
- MongoDB Atlas account (already configured)
- GitHub account
- Render account
- Netlify or Vercel account

## 🚀 Backend Deployment (Render)

### Step 1: Prepare Your Repository

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Deploy on Render

1. **Go to [Render Dashboard](https://dashboard.render.com/)**

2. **Create a New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your `netflix-clone` repository

3. **Configure the Service:**
   - **Name:** `netflix-clone-backend`
   - **Environment:** `Node`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`

4. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=mongodb+srv://rohitbappadala:ctydvrtqn4df11v0@netflixclonecluster.u2y5yqg.mongodb.net/trendingmoives?retryWrites=true&w=majority&appName=NetflixCloneCluster
   JWT_SECRET=netflix-clone-super-secret-jwt-key-2024-production-change-this
   JWT_EXPIRE=7d
   CORS_ORIGIN=https://your-frontend-domain.netlify.app
   ```

5. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-app-name.onrender.com`

### Step 3: Update CORS Configuration

After getting your frontend URL, update the `CORS_ORIGIN` environment variable in Render with your actual frontend domain.

## 🌐 Frontend Deployment

### Option A: Netlify Deployment

1. **Go to [Netlify](https://app.netlify.com/)**

2. **Deploy from Git:**
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - **Branch:** `main`
   - **Publish directory:** `.` (root)
   - **Build command:** Leave empty (static files)

3. **Update Configuration:**
   - After deployment, note your site URL
   - Update `js/config.js` with your backend URL:
     ```javascript
     API_BASE_URL: window.location.hostname === 'localhost' 
       ? 'http://localhost:5000/api'
       : 'https://your-backend-domain.onrender.com/api'
     ```

4. **Update netlify.toml:**
   - Replace `https://your-backend-domain.onrender.com` with your actual Render URL

### Option B: Vercel Deployment

1. **Go to [Vercel](https://vercel.com/)**

2. **Import Project:**
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (if deploying from root)
   - **Build Command:** Leave empty
   - **Output Directory:** Leave empty

4. **Update Configuration:**
   - Update `vercel.json` with your actual backend URL
   - Update `js/config.js` as mentioned above

## 🔧 Post-Deployment Configuration

### 1. Update Backend CORS

Update your Render environment variables:
```
CORS_ORIGIN=https://your-actual-frontend-domain.netlify.app
```

### 2. Update Frontend API URL

In `js/config.js`, replace:
```javascript
'https://your-backend-domain.onrender.com/api'
```
With your actual Render backend URL.

### 3. Test the Deployment

1. **Backend Health Check:**
   - Visit: `https://your-backend-domain.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"...","environment":"production"}`

2. **Frontend Test:**
   - Visit your frontend URL
   - Test user registration/login
   - Test movie browsing and search
   - Test watchlist functionality

## 🔒 Security Checklist

- [ ] Changed JWT_SECRET to a strong, unique value
- [ ] Updated CORS_ORIGIN with actual frontend domain
- [ ] MongoDB connection string is secure
- [ ] Environment variables are properly set
- [ ] HTTPS is enabled (automatic on Render/Netlify/Vercel)

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors:**
   - Ensure CORS_ORIGIN matches your frontend domain exactly
   - Check for trailing slashes or protocol mismatches

2. **API Connection Issues:**
   - Verify backend URL in `js/config.js`
   - Check Render logs for backend errors
   - Ensure MongoDB connection is working

3. **Authentication Issues:**
   - Verify JWT_SECRET is set correctly
   - Check browser console for token-related errors

4. **Render Cold Starts:**
   - Free tier services may sleep after inactivity
   - First request might be slow (30+ seconds)

### Checking Logs:

- **Render:** Dashboard → Your Service → Logs
- **Netlify:** Site Dashboard → Functions → View logs
- **Vercel:** Project Dashboard → Functions → View logs

## 📱 Domain Configuration (Optional)

### Custom Domain Setup:

1. **Render (Backend):**
   - Go to Settings → Custom Domains
   - Add your domain (e.g., `api.yoursite.com`)

2. **Netlify/Vercel (Frontend):**
   - Go to Domain Settings
   - Add your custom domain
   - Update DNS records as instructed

## 🔄 Continuous Deployment

Both Render and Netlify/Vercel support automatic deployments:

- **Auto-deploy:** Enabled by default
- **Branch:** Connected to `main` branch
- **Trigger:** Every push to main branch

## 📊 Monitoring

### Render Monitoring:
- CPU and Memory usage
- Response times
- Error rates
- Logs

### Frontend Monitoring:
- Netlify/Vercel Analytics
- Browser console errors
- Network requests

## 🚀 Performance Optimization

1. **Backend (Render):**
   - Enable compression middleware
   - Implement caching strategies
   - Optimize database queries

2. **Frontend (Netlify/Vercel):**
   - Enable CDN (automatic)
   - Optimize images
   - Minify CSS/JS (if needed)

## 📞 Support

- **Render:** [Render Docs](https://render.com/docs)
- **Netlify:** [Netlify Docs](https://docs.netlify.com/)
- **Vercel:** [Vercel Docs](https://vercel.com/docs)

---

## 🎉 Deployment Complete!

Your Netflix Clone is now live! 

- **Backend:** `https://your-backend-domain.onrender.com`
- **Frontend:** `https://your-frontend-domain.netlify.app`

Remember to update the placeholder URLs with your actual deployment URLs and test all functionality after deployment.
