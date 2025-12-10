# LINE Backend Server สำหรับระบบสแกนใบหน้า

Backend Server สำหรับส่งแจ้งเตือนผ่าน LINE Messaging API

## 🚀 การติดตั้ง

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env` และใส่ข้อมูล:
```
CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
PORT=3000
```

### 3. รัน Server
```bash
npm start
```

Server จะรันที่ http://localhost:3000

## 📡 API Endpoints

### POST /api/send-line-message
ส่งข้อความแจ้งเตือนไปยัง LINE

**Request Body:**
```json
{
  "userId": "U1234567890abcdef...",
  "message": "ข้อความที่ต้องการส่ง"
}
```

**Response:**
```json
{
  "success": true,
  "result": {...}
}
```

### POST /webhook
รับเหตุการณ์จาก LINE (follow, message)

### GET /health
ตรวจสอบสถานะ Server

## 🌐 Deploy

### Railway.app (แนะนำ)
1. Push code ไป GitHub
2. ไปที่ https://railway.app
3. New Project → Deploy from GitHub
4. เลือก Repository นี้
5. เพิ่ม Environment Variable: `CHANNEL_ACCESS_TOKEN`
6. Deploy

### Vercel
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create
heroku config:set CHANNEL_ACCESS_TOKEN=your_token
git push heroku main
```

## 🔧 ตั้งค่า LINE Webhook

1. ไปที่ https://developers.line.biz/console/
2. เลือก Channel ของคุณ
3. Messaging API tab
4. Webhook URL: `https://your-domain.com/webhook`
5. เปิด "Use webhook"
6. กด Verify

## 📝 License
MIT
