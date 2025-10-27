# Render.com Deployment Guide for Nanobot Frontend

## 🚀 Setup Instructions

### Option 1: Using Render Dashboard (Recommended)

1. **Go to Render Dashboard**: https://dashboard.render.com/
2. **Click "New +"** → Select **"Static Site"**
3. **Connect Repository**: Select your GitHub/GitLab repository

### Configuration Settings:

```
Name: nanobot-frontend
Branch: main
Root Directory: nanobot_frontend
Build Command: npm install && npm run build
Publish Directory: dist
```

### Environment Variables:

Add in Render Dashboard → Environment:

```
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
VITE_WS_URL=wss://your-backend-url.onrender.com
NODE_VERSION=18
```

### Advanced Settings:

- **Auto-Deploy**: Yes
- **Pull Request Previews**: Yes (optional)

### Rewrite Rules (Important!):

Render should automatically detect the `_redirects` file, but if not working:

1. Go to **Settings** → **Redirects/Rewrites**
2. Add rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: `Rewrite`

---

## Option 2: Using render.yaml (Blueprint)

The `render.yaml` file is already configured. To use it:

1. Go to Render Dashboard
2. Click **"New +"** → **"Blueprint"**
3. Select repository
4. Render will automatically detect `render.yaml`
5. Click **"Apply"**

---

## 🔧 Troubleshooting

### Issue: 404 on Page Refresh

**Cause**: Server doesn't redirect all routes to `index.html`

**Solution**:
1. Check `public/_redirects` file exists with: `/*    /index.html   200`
2. Verify Render detected the redirects file
3. Try manual deployment: Dashboard → Manual Deploy → Clear Cache & Deploy

### Issue: Environment Variables Not Loading

**Solution**:
```bash
# In Render Dashboard → Environment
VITE_API_BASE_URL=https://nanobot-backend.onrender.com/api
VITE_WS_URL=wss://nanobot-backend.onrender.com
```

### Issue: Build Fails

**Solution**:
```bash
# Check Build Command in Render:
npm install && npm run build

# Check Node Version:
NODE_VERSION=18
```

---

## 📝 Important Files

- `public/_redirects` - Redirects all routes to index.html (SPA routing)
- `render.yaml` - Render blueprint configuration
- `.env.production` - Production environment variables
- `vite.config.js` - Vite build configuration

---

## 🔗 Useful Links

- [Render Static Sites Docs](https://render.com/docs/static-sites)
- [Render Redirects Guide](https://render.com/docs/redirects-rewrites)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#render)

---

## ✅ Checklist After Deploy

- [ ] Check if `_redirects` file is detected
- [ ] Test routes: `/login`, `/home`, `/profile`, `/users`
- [ ] Test page refresh on each route
- [ ] Verify environment variables are loaded
- [ ] Check browser console for API errors
- [ ] Test WebSocket connection

---

**Last Updated**: 2025-10-27
