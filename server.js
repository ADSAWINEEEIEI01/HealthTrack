const express = require('express');
require("dotenv").config();
const mysql = require("mysql2");
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const { Child } = require('./models/child');  // ใช้เส้นทางที่ถูกต้อง

const router = express.Router();

const app = express();
const port = 3000;
const secretKey = 'your_jwt_secret';

app.use(express.json());

app.use(cors());

// ให้ Express เสิร์ฟไฟล์สาธารณะ
app.use(express.static(path.join(__dirname, 'public')));

// แก้ปัญหา MIME type โดยเสิร์ฟไฟล์จากโฟลเดอร์ assets
app.use('/assets', express.static(path.join(__dirname, 'public/assets')));

// 🔹 ตั้งค่า CORS ให้รองรับทุก Origin และ Methods (GET, POST, PUT, DELETE)
app.use(cors({
    origin: '*',  // อนุญาตให้ทุกโดเมนเรียกใช้ API ได้
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ให้ Express ใช้โฟลเดอร์ public เพื่อเสิร์ฟไฟล์ HTML
app.use(express.static(path.join(__dirname, 'public')));

// เมื่อเข้า `http://localhost:3000/` ให้เปิด `index.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// สร้างการเชื่อมต่อ MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

// ตรวจสอบการเชื่อมต่อ
db.connect((err) => {
  if (err) {
    console.error("❌ ไม่สามารถเชื่อมต่อกับฐานข้อมูล:", err);
    return;
  }
  console.log("✅ เชื่อมต่อ MySQL สำเร็จ!");
});

module.exports = db; // ส่งออกเพื่อใช้ที่อื่น

app.get("/", (req, res) => {
  res.send("HealthTrack Backend is Running!");
});

// **API สมัครสมาชิก**
app.post('/api/register', (req, res) => {
  const { username, password, email } = req.body;

  // ตรวจสอบว่า ชื่อผู้ใช้ หรือ อีเมล์ ซ้ำ
  const checkQuery = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(checkQuery, [username, email], (err, result) => {
    if (err) throw err;
    
    if (result.length > 0) {
      // ถ้ามีชื่อผู้ใช้หรืออีเมล์ซ้ำ
      return res.status(400).json({ message: 'ชื่อผู้ใช้หรืออีเมล์นี้ถูกใช้งานแล้ว' });
    } else {
      // เก็บรหัสผ่านที่ไม่ได้เข้ารหัสลงในฐานข้อมูล
      const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
      db.query(query, [username, password, email], (err, result) => {
        if (err) throw err;
        res.json({ message: 'ลงทะเบียนสำเร็จ', user_id: result.insertId });
      });
    }
  });
});


// **API เข้าสู่ระบบ**

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลให้ครบถ้วน" });
  }

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
      if (err) {
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเชื่อมต่อกับฐานข้อมูล' });
      }

      if (result.length === 0) {
          return res.status(400).json({ message: 'ไม่พบผู้ใช้' });
      }

      // ตรวจสอบรหัสผ่าน
      if (password === result[0].password) {
          const user_id = result[0].id; // ดึง user_id จากฐานข้อมูล
          const token = jwt.sign({ user_id: user_id }, 'your_jwt_secret');

          res.json({ message: 'เข้าสู่ระบบสำเร็จ', user_id: user_id, token });
      } else {
          res.status(400).json({ message: 'รหัสผ่านไม่ถูกต้อง' });
      }
  });
});


// **API บันทึกข้อมูลเด็ก**
app.post('/api/addChild', (req, res) => {
  const { user_id, name, age, weight, height, illness } = req.body;

  if (!user_id || !name || !age || !weight || !height) {
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
  }

  const query = 'INSERT INTO children (user_id, name, age, weight, height, illness) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [user_id, name, age, weight, height, illness], (err, result) => {
      if (err) {
          console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูลเด็ก:', err);
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลเด็ก' });
      }
      res.json({ message: 'บันทึกข้อมูลเด็กสำเร็จ', child_id: result.insertId });
  });
});

app.get('/api/children', (req, res) => {
  const query = 'SELECT * FROM children';
  db.query(query, (err, results) => {
      if (err) {
          return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูลเด็ก' });
      }
      res.json(results);
  });
});

// ฟังก์ชันแก้ไขข้อมูลเด็ก
app.put('/api/children/:id', (req, res) => {
  const { id } = req.params;
  const { name, age, weight, height } = req.body;

  const query = `
    UPDATE children
    SET name = ?, age = ?, weight = ?, height = ?
    WHERE id = ?`;

  db.execute(query, [name, age, weight, height, id], (err, results) => {
    if (err) {
      console.error('เกิดข้อผิดพลาดในการอัปเดตข้อมูล:', err);
      return res.status(500).json({ message: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล', error: err.message });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
    }
    res.status(200).json({ message: 'ข้อมูลเด็กถูกอัปเดตแล้ว!' });
  });
});

// ฟังก์ชันดึงข้อมูลอาการป่วย
app.get('/api/children/:id/illness', (req, res) => {
  const childId = req.params.id;

  db.query('SELECT illness FROM children WHERE id = ?', [childId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "ไม่สามารถดึงข้อมูลอาการป่วย" });
      }
      if (result.length === 0) {
          return res.status(404).json({ message: "ไม่พบข้อมูลอาการป่วยของเด็ก" });
      }
      res.json(result[0]); // ส่งข้อมูลอาการป่วย
  });
});

app.put('/api/children/:id/illness', (req, res) => {
  const childId = req.params.id;
  const { illness } = req.body;

  if (!illness) {
      return res.status(400).json({ message: "กรุณากรอกข้อมูลอาการป่วย" });
  }

  db.query('UPDATE children SET illness = ? WHERE id = ?', [illness, childId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตอาการป่วย" });
      }
      res.status(200).json({ message: "อาการป่วยถูกอัปเดตแล้ว" });
  });
});


// ฟังก์ชันลบข้อมูลเด็ก
app.delete('/api/children/:id', (req, res) => {
  const childId = req.params.id;

  db.query('DELETE FROM children WHERE id = ?', [childId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบข้อมูล" });
      }
      res.status(200).json({ message: "ลบข้อมูลเด็กสำเร็จ" });
  });
});

// ฟังก์ชันลบอาการป่วย
app.delete('/api/children/:id/illness', (req, res) => {
  const childId = req.params.id;

  // ลบอาการป่วยจากฐานข้อมูล (อัปเดตเป็นค่าว่าง)
  db.query('UPDATE children SET illness = NULL WHERE id = ?', [childId], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบอาการป่วย" });
      }
      res.status(200).json({ message: "อาการป่วยถูกลบออกแล้ว" });
  });
});


// Start Server
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
