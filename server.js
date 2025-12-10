const express = require('express');
const line = require('@line/bot-sdk');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ตั้งค่า CORS
app.use(cors());
app.use(express.json());

// ตั้งค่า LINE config
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
};
const client = new line.Client(config);

// API endpoint สำหรับส่งข้อความ
app.post('/api/send-line-message', async (req, res) => {
    try {
        const { userId, message } = req.body;

        if (!userId || !message) {
            return res.status(400).json({ 
                success: false, 
                error: 'userId และ message จำเป็นต้องมี' 
            });
        }

        const result = await client.pushMessage(userId, {
            type: 'text',
            text: message
        });

        res.json({ success: true, result });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดในการส่งข้อความ:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// Webhook endpoint (สำหรับรับเหตุการณ์จาก LINE)
app.post('/webhook', line.middleware(config), async (req, res) => {
    try {
        const events = req.body.events;
        
        await Promise.all(events.map(async (event) => {
            // เมื่อมีคนเพิ่มเป็นเพื่อน
            if (event.type === 'follow') {
                console.log('User ID:', event.source.userId);
                
                await client.replyMessage(event.replyToken, {
                    type: 'text',
                    text: `ยินดีต้อนรับ! 🎉\n\nUser ID ของคุณคือ:\n${event.source.userId}\n\nกรุณาบันทึก ID นี้ไว้สำหรับลงทะเบียนใบหน้า`
                });
            }
            
            // เมื่อมีคนส่งข้อความ
            if (event.type === 'message' && event.message.type === 'text') {
                if (event.message.text.toLowerCase() === 'userid') {
                    await client.replyMessage(event.replyToken, {
                        type: 'text',
                        text: `User ID ของคุณคือ:\n${event.source.userId}`
                    });
                }
            }
        }));

        res.json({ success: true });
    } catch (error) {
        console.error('เกิดข้อผิดพลาดใน Webhook:', error);
        res.status(500).json({ error: error.message });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'LINE Backend is running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📱 Webhook URL: http://localhost:${PORT}/webhook`);
});
