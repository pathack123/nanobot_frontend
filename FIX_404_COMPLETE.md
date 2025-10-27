# 🚀 แก้ปัญหา 404 เมื่อ Refresh หน้าใน React SPA

## ❓ สาเหตุของปัญหา

เมื่อคุณ refresh หน้า React Router (เช่น `/login`, `/home`, `/profile`) บน production server:
- Server พยายามหาไฟล์ `login.html`, `home.html` จริงๆ
- แต่ใน React (SPA) ทุก route จัดการโดย `index.html` เดียว
- เลยเจอ 404 Not Found

## ✅ วิธีแก้ปัญหาที่ทำไปแล้ว

### 📦 Frontend (nanobot_frontend)

#### 1. **สร้างไฟล์ `public/200.html`**
```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nanobot - Crypto Dashboard</title>
    <!-- ... -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### 2. **สร้างไฟล์ `public/_redirects`** (สำหรับ Netlify/Render)
```
/* /index.html 200
```

#### 3. **สร้างไฟล์ `render.yaml`**
```yaml
services:
  - type: web
    name: nanobot-frontend
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

#### 4. **สร้างไฟล์ `render.json`**
```json
{
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### 5. **แก้ไข `vite.config.js`**
```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
```

#### 6. **สร้างไฟล์ `public/_headers`**
```
/*
  Cache-Control: no-cache
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
```

### 🔧 Backend (nanobot_backend)

Backend มี CORS configuration ที่ดีอยู่แล้ว:
- รองรับหลาย origin
- มี error handling
- มี health check endpoint
- มี WebSocket support

## 📋 ขั้นตอนการ Deploy บน Render.com

### Frontend Deployment

1. **ไปที่ Render.com Dashboard**
2. **New → Static Site**
3. **เชื่อมต่อ GitHub Repository**: `nanobot_frontend`
4. **ตั้งค่า:**
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Auto-Deploy**: Yes

5. **Environment Variables** (ใน Render Dashboard):
   ```
   VITE_API_URL=https://your-backend-url.onrender.com
   VITE_WS_URL=wss://your-backend-url.onrender.com
   ```

6. **Deploy!**

### Backend Deployment

1. **New → Web Service**
2. **เชื่อมต่อ GitHub Repository**: `nanobot_backend`
3. **ตั้งค่า:**
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Auto-Deploy**: Yes

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret-key
   REDIS_URL=redis://...
   CORS_ORIGIN=https://your-frontend-url.netlify.app,https://your-frontend-url.onrender.com
   ```

5. **Deploy!**

## 🧪 การทดสอบ

### 1. **Local Testing**

```powershell
# Frontend
cd nanobot_frontend
npm run build
npm run preview

# เปิดเบราว์เซอร์ไปที่ http://localhost:4173
# ทดสอบ refresh ที่ /login, /home, /profile
```

### 2. **Production Testing**

```powershell
# ใช้ curl ทดสอบ
curl -I https://nanobot-frontend.onrender.com/login
curl -I https://nanobot-frontend.onrender.com/home
curl -I https://nanobot-frontend.onrender.com/profile

# ควรได้ Status: 200 OK ทั้งหมด (ไม่ใช่ 404)
```

### 3. **Browser Testing**

1. เปิดเว็บไซต์ที่ deploy แล้ว
2. ไปที่หน้า `/login`
3. กด F5 (Refresh)
4. ✅ ต้องไม่เจอ 404 Error
5. ทำซ้ำกับ `/home`, `/profile`, `/users`

## 🔍 Troubleshooting

### ถ้ายังเจอ 404:

#### บน Render.com
1. ตรวจสอบ `render.yaml` ว่ามี `routes` configuration
2. ตรวจสอบว่า build สำเร็จและมีไฟล์ `dist/index.html`
3. ลองเพิ่ม Rewrite Rules ใน Render Dashboard:
   - **Source**: `/*`
   - **Destination**: `/index.html`

#### บน Netlify
1. ตรวจสอบ `public/_redirects` หรือ `netlify.toml`
2. ใน Netlify Dashboard → Site settings → Build & deploy → Post processing
3. เปิด "Asset optimization" และ "Pretty URLs"

#### บน Vercel
1. ใช้ `vercel.json`:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

## 📝 Checklist สำหรับ Production

- [x] `public/200.html` (copy from index.html)
- [x] `public/_redirects` มีบรรทัด `/* /index.html 200`
- [x] `render.yaml` มี routes configuration
- [x] `render.json` มี routes configuration
- [x] `vite.config.js` มี build configuration
- [x] Environment variables ตั้งค่าถูกต้อง
- [x] Backend CORS อนุญาต frontend domain
- [x] ทดสอบ refresh ทุกหน้า

## 🎯 สิ่งที่จะเกิดขึ้น

✅ **กด Refresh ที่หน้าไหนก็ได้** → ไม่เจอ 404  
✅ **Copy URL แชร์ให้เพื่อน** → เข้าหน้านั้นได้เลย  
✅ **Bookmark URL** → เปิดใช้งานได้ปกติ  
✅ **Back/Forward browser** → ทำงานได้สมบูรณ์  

## 📚 เอกสารเพิ่มเติม

- [Render Static Site Docs](https://render.com/docs/static-sites)
- [React Router - Deployment](https://reactrouter.com/en/main/start/concepts#routing)
- [Vite - Deploying a Static Site](https://vitejs.dev/guide/static-deploy.html)

---

**Created by**: ajanfer  
**Date**: October 27, 2025  
**Status**: ✅ Fixed - Ready to Deploy
