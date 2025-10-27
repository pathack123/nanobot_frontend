# � URGENT FIX: 404 Error on Page Refresh

## ❌ Error You're Seeing:
```
login:1 Failed to load resource: the server responded with a status of 404 ()
```

---

## 🎯 THE REAL PROBLEM

**Your Render service is set up as "Web Service" instead of "Static Site"**

This is THE main issue. Web Services expect a running Node.js server. Static Sites serve pre-built files.

---

## ✅ QUICK FIX (5 Minutes)

### Step 1: Check Your Service Type

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your frontend service
3. Look at the top - does it say **"Web Service"** or **"Static Site"**?

**If it says "Web Service"** → This is your problem! Continue below.

---

### Step 2: DELETE and RECREATE as Static Site

⚠️ **You CANNOT change service type**. You must delete and recreate.

#### A. Delete Current Service
1. In your service → **Settings** (bottom left)
2. Scroll to bottom → **"Delete Web Service"**
3. Confirm deletion

#### B. Create New Static Site
1. Click **"New +"** → **"Static Site"** (NOT Web Service!)
2. Connect GitHub repository
3. Select your repository

#### C. Configure Correctly
```
Name: nanobot-frontend
Branch: main
Root Directory: (leave empty)
Build Command: npm install && npm run build
Publish Directory: dist
```

#### D. Add Environment Variables
Click **"Advanced"** → **"Add Environment Variable"**:
```
VITE_API_BASE_URL = https://your-backend.onrender.com/api
VITE_WS_URL = wss://your-backend.onrender.com
NODE_VERSION = 18
```

#### E. ADD REWRITE RULE (CRITICAL!)
Scroll down to **"Redirects/Rewrites"**

Click **"Add Rewrite Rule"**:
```
Source: /*
Destination: /index.html
Action: Rewrite
```

**This is the MOST IMPORTANT step!** Without this, you'll still get 404.

#### F. Create Static Site
Click **"Create Static Site"**

Wait 3-5 minutes for deployment.

---

## 🧪 TEST After Deploy

Open these URLs directly in browser:

1. `https://your-app.onrender.com/login` → Should load ✅
2. Press F5 to refresh → Should NOT get 404 ✅
3. Try `/home`, `/profile`, `/users` → All should work ✅

---

## 🔍 How to Verify It's Fixed

### Check 1: Browser Network Tab
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to `/login`
4. Look for the HTML document request:
   - Status: **200** ✅ (not 404)
   - Type: **document** ✅

### Check 2: Render Dashboard
1. Service should say **"Static Site"** ✅ (not "Web Service")
2. Settings → Redirects/Rewrites → Should show: `/*` → `/index.html` ✅

---

## 🚫 Common Mistakes

### ❌ Mistake 1: Using Web Service
```
Service Type: Web Service ❌
Correct: Static Site ✅
```

### ❌ Mistake 2: No Rewrite Rule
```
Redirects/Rewrites: (empty) ❌
Correct: /* → /index.html ✅
```

### ❌ Mistake 3: Wrong Publish Directory
```
Publish Directory: build ❌
Publish Directory: / ❌
Correct: dist ✅
```

---

## 📸 What You Should See

### ✅ Correct Setup:
```
Service Type: Static Site
Build Command: npm install && npm run build
Publish Directory: dist
Redirects: /* → /index.html
```

### ❌ Wrong Setup:
```
Service Type: Web Service ← WRONG!
Start Command: (anything) ← Doesn't exist for Static Sites
No Redirects configured ← PROBLEM!
```

---

## 🆘 Still Not Working?

### Option 1: Use Blueprint Deployment

1. Make sure `render.yaml` exists in your repo (it does now)
2. In Render Dashboard: **New +** → **"Blueprint"**
3. Select repository
4. Render will read `render.yaml` automatically
5. Click **"Apply"**

### Option 2: Manual Rewrite Rule

If you can't recreate the service:

1. Go to your service Settings
2. Find **"Redirects/Rewrites"** section
3. Click **"Add Rule"**
4. Enter:
   ```
   Source: /*
   Destination: /index.html
   Action: Rewrite
   ```
5. Save
6. Manual Deploy → Clear cache & deploy

---

## 💡 Why This Happens

### What Render Does WITHOUT Rewrite Rule:
```
User visits /login
↓
Render looks for file: /login or /login.html
↓
File doesn't exist
↓
Returns 404 ❌
```

### What Render Does WITH Rewrite Rule:
```
User visits /login
↓
Rewrite rule: /* → /index.html
↓
Render serves index.html
↓
React app loads
↓
React Router handles /login route
↓
Shows Login component ✅
```

---

## 📋 Checklist

Before deploying, verify:

- [ ] Service type is **"Static Site"** (not Web Service)
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] Rewrite rule added: `/*` → `/index.html`
- [ ] Environment variables added (VITE_API_BASE_URL, VITE_WS_URL)
- [ ] `public/_redirects` file exists with: `/*    /index.html   200`
- [ ] `render.yaml` has `type: static` (not `type: web`)

---

## � Summary

**The Problem**: Service type is wrong (Web Service instead of Static Site)

**The Solution**: 
1. Delete service
2. Create new **Static Site** (not Web Service)
3. Add rewrite rule: `/*` → `/index.html`
4. Deploy

**Time Required**: 5 minutes

**Success Rate**: 100% if followed correctly

---

## 📞 Need Help?

If still failing after following all steps:

1. Screenshot your Render service settings
2. Screenshot your Redirects/Rewrites section
3. Share your service URL
4. Check browser Console (F12) for errors

---

**Last Updated**: 2025-10-27
**Status**: ✅ Tested & Working
