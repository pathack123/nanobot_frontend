# 🌐 Frontend Environment Variables Setup

## สร้างไฟล์ Environment Variables

### สำหรับ Development (Local)

สร้างไฟล์ `.env.development` ในโฟลเดอร์ `nanobot_frontend/`:

```bash
# Development Environment
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

### สำหรับ Production

#### ตัวเลือก 1: Deploy บน Railway

1. ไปที่ Railway Dashboard > เลือก frontend project
2. ไปที่ **Variables** tab
3. เพิ่ม variables ดังนี้:

```bash
VITE_API_URL=https://your-backend.up.railway.app
VITE_WS_URL=wss://your-backend.up.railway.app
```

#### ตัวเลือก 2: Deploy บน Netlify

1. ไปที่ Netlify Dashboard > Site settings > Build & deploy > Environment
2. เพิ่ม environment variables:

```bash
VITE_API_URL=https://your-backend.up.railway.app
VITE_WS_URL=wss://your-backend.up.railway.app
```

#### ตัวเลือก 3: สร้างไฟล์ .env.production (สำหรับ Railway)

สร้างไฟล์ `.env.production` ในโฟลเดอร์ `nanobot_frontend/`:

```bash
# Production Environment
# แทนที่ด้วย Backend URL จริงของคุณ
VITE_API_URL=https://your-backend.up.railway.app
VITE_WS_URL=wss://your-backend.up.railway.app
```

⚠️ **คำเตือน**: อย่า commit ไฟล์ `.env.production` ที่มี URL จริง ขึ้น Git

---

## ⚠️ สำคัญมาก!

### 1. WebSocket URL ต้องใช้:
- **Development**: `ws://localhost:3000` (ไม่มี s)
- **Production**: `wss://your-backend.up.railway.app` (มี s)

### 2. API URL ต้องใช้:
- **Development**: `http://localhost:3000` (ไม่มี s)
- **Production**: `https://your-backend.up.railway.app` (มี s)

### 3. ไม่ต้องมี `/api` ท้าย URL
- ✅ ถูกต้อง: `https://your-backend.up.railway.app`
- ❌ ผิด: `https://your-backend.up.railway.app/api`

---

## 🔧 การแก้ปัญหา "WebSocket Disconnected"

### สาเหตุ:
1. ไม่มีการตั้งค่า `VITE_WS_URL`
2. ใช้ `ws://` แทน `wss://` ใน production
3. Backend CORS ไม่อนุญาต origin ของ frontend

### วิธีแก้:

#### 1. ตรวจสอบ Frontend Environment Variables

เปิด browser console (F12) แล้วดูว่ามี error:

```
🔌 Connecting to WebSocket: undefined
```

หรือ

```
WebSocket connection to 'ws://...' failed
```

ถ้าพบ error นี้ แสดงว่าไม่มี `VITE_WS_URL`

#### 2. ตรวจสอบ Backend CORS

เปิด Railway Backend Logs แล้วดูว่ามี error:

```
Origin not allowed
```

แก้ไขโดยเพิ่ม Frontend URL ใน `CORS_ORIGIN`:

```bash
CORS_ORIGIN=https://your-frontend.railway.app,https://your-frontend.netlify.app
```

#### 3. Redeploy หลังแก้ไข

- **Railway**: จะ redeploy อัตโนมัติเมื่อเปลี่ยน Variables
- **Netlify**: ต้อง trigger deploy ใหม่ด้วยตนเอง

---

## ✅ การทดสอบ

### 1. ทดสอบ Local

```bash
# ใน terminal
cd nanobot_frontend
npm run dev

# เปิด browser: http://localhost:5173
# ดู console (F12) ควรเห็น:
# ✅ WebSocket connected
```

### 2. ทดสอบ Production

```bash
# เปิด production URL
# เปิด browser console (F12)
# ควรเห็น:
🔌 Connecting to WebSocket: wss://your-backend.up.railway.app
✅ WebSocket connected
```

---

## 📋 Checklist

### Frontend Environment Variables:
- [ ] สร้างไฟล์ `.env.development` (สำหรับ local)
- [ ] ตั้งค่า `VITE_API_URL` และ `VITE_WS_URL`
- [ ] ตั้งค่า environment variables ใน Railway/Netlify dashboard
- [ ] ใช้ `wss://` สำหรับ production
- [ ] ไม่มี `/api` ท้าย URL

### Backend CORS Settings:
- [ ] `CORS_ORIGIN` รวม Frontend URL
- [ ] `FRONTEND_URL` ตั้งค่าถูกต้อง
- [ ] Redeploy backend หลังแก้ไข

### Testing:
- [ ] WebSocket เชื่อมต่อสำเร็จ (ดู console)
- [ ] Real-time notifications ทำงาน
- [ ] ไม่มี CORS errors

---

## 📞 Need Help?

หากยังมีปัญหา WebSocket:
1. เปิด browser console (F12) ดู error message
2. เปิด Network tab > WS filter
3. ดู Railway backend logs
4. ตรวจสอบ CORS settings

Happy Coding! 🚀

