# 🔐 Environment Variables Guide

## 📁 ไฟล์ที่สร้างขึ้น

### 1. **`.env.example`** ✅ (Commit ได้)
   - Template สำหรับทีมงาน
   - แสดงตัวอย่าง variables ที่ต้องใช้
   - **ควร commit** เข้า Git เพื่อให้ทีมอื่นรู้ว่าต้องตั้งค่าอะไรบ้าง

### 2. **`.env`** 🔒 (ไม่ Commit)
   - ใช้สำหรับ local development
   - ถูก `.gitignore` อยู่แล้ว
   - **อย่า commit** เข้า Git

### 3. **`.env.production.local`** 🔒 (ไม่ Commit)
   - ใช้สำหรับ production build ใน local
   - ถูก `.gitignore` อยู่แล้ว
   - **อย่า commit** เข้า Git

### 4. **`.env.development`** ✅ (มีอยู่แล้ว)
   - ใช้สำหรับ development mode
   - Commit ได้เพราะเป็น localhost

---

## 🚀 วิธีใช้งาน

### สำหรับ Local Development

1. ใช้ไฟล์ `.env` ที่สร้างให้แล้ว (ใช้ localhost)
2. หรือ Vite จะใช้ `.env.development` อัตโนมัติตอน `npm run dev`

```bash
npm run dev
```

### สำหรับ Production Build (Local)

1. **แก้ไขไฟล์** `.env.production.local`:
   ```bash
   VITE_API_URL=https://your-real-backend.com/api
   VITE_WS_URL=wss://your-real-backend.com
   ```

2. **Build โปรเจค**:
   ```bash
   npm run build
   ```

### สำหรับ Deploy บน Platform

#### **Netlify** 🌐
1. ไปที่: Site settings → Environment variables
2. เพิ่ม variables:
   ```
   VITE_API_URL = https://your-backend.com/api
   VITE_WS_URL = wss://your-backend.com
   VITE_APP_ENV = production
   ```

#### **Vercel** ▲
1. ไปที่: Project Settings → Environment Variables
2. เพิ่ม variables เหมือน Netlify

#### **Railway** 🚂
1. ไปที่: Variables tab ใน Railway Dashboard
2. เพิ่ม variables เหมือนกัน

---

## 📋 Environment Variables ทั้งหมด

| Variable | Development | Production | คำอธิบาย |
|----------|-------------|------------|----------|
| `VITE_API_URL` | `http://localhost:3000/api` | `https://your-backend.com/api` | Backend API endpoint |
| `VITE_WS_URL` | `ws://localhost:3000` | `wss://your-backend.com` | WebSocket endpoint |
| `VITE_APP_NAME` | `Nanobot` | `Nanobot` | ชื่อแอป |
| `VITE_APP_ENV` | `development` | `production` | Environment mode |
| `VITE_APP_VERSION` | `1.0.0` | `1.0.0` | เวอร์ชันแอป |

---

## ⚠️ สิ่งสำคัญที่ต้องจำ

### 1. **Protocol ที่ถูกต้อง**
   - Development: `http://` และ `ws://`
   - Production: `https://` และ `wss://` (มี **s**)

### 2. **API Path**
   - ตรวจสอบว่า backend ของคุณใช้ `/api` หรือไม่
   - ถ้าไม่ใช้ ให้เอาออก: `https://your-backend.com`

### 3. **Vite Environment Variables**
   - ต้องขึ้นต้นด้วย `VITE_` เสมอ
   - ถึงจะเข้าถึงได้ใน client-side ผ่าน `import.meta.env.VITE_XXX`

### 4. **การโหลดไฟล์ .env**
   Vite จะโหลดไฟล์ตามลำดับนี้:
   ```
   .env                  # โหลดทุก mode
   .env.local            # โหลดทุก mode (ไม่ commit)
   .env.[mode]           # โหลดเฉพาะ mode นั้น
   .env.[mode].local     # โหลดเฉพาะ mode นั้น (ไม่ commit)
   ```

---

## 🧪 วิธีทดสอบ

### ตรวจสอบว่า Environment Variables โหลดถูกต้อง

1. เปิดไฟล์ `src/utils/api.js` จะมี console.log:
   ```javascript
   console.log('🌐 API Base URL:', BASE_URL);
   console.log('🌍 Environment:', import.meta.env.MODE);
   ```

2. เปิด Browser Console และดูว่าแสดง URL ที่ถูกต้อง

### ทดสอบใน Development
```bash
npm run dev
# ดู console ว่าแสดง: http://localhost:3000/api
```

### ทดสอบ Production Build (Local)
```bash
npm run build
npm run preview
# ดู console ว่าแสดง URL production ของคุณ
```

---

## 🔧 Troubleshooting

### ปัญหา: ไม่เห็น Environment Variables
**แก้ไข**: Restart dev server
```bash
# Ctrl+C เพื่อหยุด
npm run dev
```

### ปัญหา: Production ยังใช้ localhost
**แก้ไข**: 
1. ตรวจสอบว่าตั้งค่าบน platform (Netlify/Vercel) แล้ว
2. Redeploy อีกครั้ง

### ปัญหา: WebSocket ไม่เชื่อมต่อ
**แก้ไข**: ตรวจสอบว่าใช้:
- Development: `ws://` (ไม่มี s)
- Production: `wss://` (มี s)

---

## 📚 อ้างอิง

- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

## ✅ Checklist สำหรับ Production

- [ ] แก้ไข `VITE_API_URL` ให้เป็น URL จริงของ backend
- [ ] แก้ไข `VITE_WS_URL` ให้เป็น WSS URL จริง
- [ ] ตรวจสอบว่าใช้ `https://` และ `wss://` (มี s)
- [ ] ตั้งค่า environment variables บน deployment platform
- [ ] ทดสอบ build ด้วย `npm run build`
- [ ] ทดสอบ preview ด้วย `npm run preview`
- [ ] ตรวจสอบ console ว่าแสดง URL ที่ถูกต้อง
- [ ] ทดสอบการเชื่อมต่อ API และ WebSocket
