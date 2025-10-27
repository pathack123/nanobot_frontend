# Render.com Deployment Guide for Nanobot Frontend

## � CRITICAL: Fix 404 Error on Refresh

If you're getting `404 (Not Found)` when refreshing pages like `/login`, `/home`, etc., follow these steps:

---

## 🎯 Root Cause

**Problem**: Render treats your app as a regular website, not a Single Page Application (SPA).

When you refresh `/login`:
1. Browser requests `/login` from server
2. Render looks for a file called `login.html`
3. File doesn't exist → Returns 404
4. React Router never gets a chance to run

**Solution**: Configure Render to ALWAYS serve `index.html` for all routes.

---

## ✅ Step-by-Step Fix

### Option 1: Delete and Recreate as Static Site (RECOMMENDED)

1. **Delete Current Service**:
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Find your frontend service
   - Settings → Delete Web Service

2. **Create New Static Site**:
   - Click **"New +"** → **"Static Site"**
   - Connect your GitHub repository
   - Select branch: `main`

3. **Configure Settings**:
   ```
   Name: nanobot-frontend
   Branch: main
   Root Directory: (leave empty or type: nanobot_frontend)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

4. **Add Environment Variables**:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api
   VITE_WS_URL=wss://your-backend.onrender.com
   NODE_VERSION=18
   ```

5. **CRITICAL - Add Rewrite Rule**:
   - Scroll down to **"Redirects/Rewrites"**
   - Click **"Add Rule"**
   - Set:
     ```
     Source: /*
     Destination: /index.html
     Action: Rewrite
     ```

6. **Deploy**:
   - Click **"Create Static Site"**
   - Wait 3-5 minutes

---

### Option 2: Fix Existing Service

If you can't delete and recreate:

1. **Go to Service Settings**:
   - Dashboard → Your frontend service → Settings

2. **Check Service Type**:
   - If it says "Web Service" → This is WRONG
   - Should be "Static Site"
   - If wrong type, you MUST recreate (see Option 1)

3. **Add/Edit Redirects**:
   - Settings → Redirects/Rewrites
   - Add rule:
     ```
     Source: /*
     Destination: /index.html
     Action: Rewrite
     ```

4. **Verify Build Settings**:
   ```
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

5. **Manual Deploy**:
   - Manual Deploy → Clear build cache & deploy

---

## 🧪 Testing After Deploy

Test these URLs directly (copy-paste in browser):

```
✅ https://your-app.onrender.com/
✅ https://your-app.onrender.com/login
✅ https://your-app.onrender.com/home
✅ https://your-app.onrender.com/profile
✅ https://your-app.onrender.com/users
```

Then **refresh each page (F5)**. Should NOT get 404.

---

## 🔍 Debugging

### Check 1: Service Type
```
Dashboard → Your Service → Settings
Type: Should say "Static Site" (not "Web Service")
```

### Check 2: Rewrite Rules
```
Dashboard → Settings → Redirects/Rewrites
Should have: /* → /index.html (Rewrite)
```

### Check 3: Build Logs
```
Dashboard → Logs → Build
Should see:
✓ npm install
✓ npm run build
✓ dist directory created
```

### Check 4: Browser Network Tab
```
1. Open Developer Tools (F12)
2. Go to Network tab
3. Navigate to /login
4. Check request:
   - URL: https://your-app.onrender.com/login
   - Status: 200 (not 404)
   - Type: document
   - Preview: Should show index.html content
```

---

## 🚫 Common Mistakes

### ❌ Wrong Service Type
```
Type: Web Service ❌
Should be: Static Site ✅
```

### ❌ Wrong Publish Directory
```
Publish Directory: / ❌
Publish Directory: build ❌
Should be: dist ✅
```

### ❌ Missing Rewrite Rule
```
No redirects configured ❌
Should have: /* → /index.html ✅
```

### ❌ Wrong Build Command
```
Build Command: npm run build ❌ (missing npm install)
Should be: npm install && npm run build ✅
```

---

## 📋 Render Dashboard Configuration

### Service Information
```
Service Type: Static Site
Name: nanobot-frontend
Region: Singapore (or your choice)
Branch: main
```

### Build & Deploy
```
Build Command: npm install && npm run build
Publish Directory: dist
Auto-Deploy: Yes
```

### Environment Variables
```
NODE_VERSION=18
VITE_API_BASE_URL=https://nanobot-backend.onrender.com/api
VITE_WS_URL=wss://nanobot-backend.onrender.com
```

### Redirects/Rewrites
```
Source: /*
Destination: /index.html
Action: Rewrite
```

---

## 🎯 Why This Happens

### Traditional Website (MPA):
```
/login → server looks for login.html ✓
/home → server looks for home.html ✓
```

### React SPA:
```
/login → server serves index.html → React Router shows Login ✓
/home → server serves index.html → React Router shows Home ✓
```

### The Flow:
```
1. User visits https://app.com/login
2. Render receives request for /login
3. Render checks rewrite rule: /* → /index.html
4. Render serves index.html (200 OK)
5. Browser loads React app
6. React Router sees /login in URL
7. React Router renders Login component ✓
```

---

## � Still Not Working?

### Check these files exist in your repo:

1. **`public/_redirects`** (for fallback):
   ```
   /*    /index.html   200
   ```

2. **`render.yaml`** (for Blueprint):
   ```yaml
   services:
     - type: static
       name: nanobot-frontend
       buildCommand: npm install && npm run build
       staticPublishPath: ./dist
       routes:
         - type: rewrite
           source: /*
           destination: /index.html
   ```

3. **`vite.config.js`** (build config):
   ```javascript
   export default defineConfig({
     build: {
       outDir: 'dist'
     }
   })
   ```

### If still failing:

1. **Delete the service completely**
2. **Create new Static Site** (not Web Service)
3. **Add rewrite rule in dashboard**
4. **Deploy**

---

## 📸 Screenshots Checklist

When creating Static Site, you should see:

- ✅ "Build Command" field
- ✅ "Publish Directory" field
- ✅ "Redirects/Rewrites" section
- ❌ NO "Start Command" (that's for Web Service)

---

## 🔗 Resources

- [Render Static Sites](https://render.com/docs/static-sites)
- [Render Redirects Guide](https://render.com/docs/redirects-rewrites)
- [React Router Deployment](https://reactrouter.com/en/main/guides/deployment)

---

**Last Updated**: 2025-10-27
**Status**: ✅ Ready to Deploy
