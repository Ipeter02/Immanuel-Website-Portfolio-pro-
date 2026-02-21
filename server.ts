import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

// --- MongoDB Setup ---
let isMongoConnected = false;

const PortfolioSchema = new mongoose.Schema({
  id: { type: Number, default: 1 },
  content: { type: Object, required: true }
}, { timestamps: true });

const PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);

if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      isMongoConnected = true;
      console.log('✅ Connected to MongoDB');
    })
    .catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.log('⚠️ Falling back to local file storage (db.json)');
    });
} else {
  console.log('⚠️ No MONGO_URI found in .env. Falling back to local file storage (db.json).');
}

// --- Multer Storage ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 100 * 1024 * 1024 }
});

// --- Helper Functions ---
const readDbFile = () => {
  if (!fs.existsSync(DB_FILE)) return null;
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDbFile = (data: any) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- Email Transporter ---
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// --- API Routes ---

// 1. GET Data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (isMongoConnected) {
      const doc = await PortfolioModel.findOne({ id: 1 });
      if (!doc) return res.status(404).json({ message: 'No data found in MongoDB' });
      return res.json(doc.content);
    } else {
      const data = readDbFile();
      if (!data) return res.status(404).json({ message: 'No data found in db.json' });
      return res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. POST/UPDATE Data
app.post('/api/portfolio', async (req, res) => {
  const newData = req.body;
  try {
    if (isMongoConnected) {
      await PortfolioModel.findOneAndUpdate(
        { id: 1 },
        { content: newData },
        { upsert: true, new: true }
      );
    } else {
      writeDbFile(newData);
    }
    res.json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// 3. POST Contact Message
app.post('/api/contact', async (req, res) => {
  const newMessage = req.body; // { id, name, email, message, date, read: false }

  try {
    // Save to DB first
    let currentData: any;
    if (isMongoConnected) {
      const doc = await PortfolioModel.findOne({ id: 1 });
      if (doc) {
        currentData = doc.content;
        currentData.messages = [newMessage, ...(currentData.messages || [])];
        await PortfolioModel.findOneAndUpdate({ id: 1 }, { content: currentData }, { upsert: true });
      }
    } else {
      currentData = readDbFile();
      if (currentData) {
        currentData.messages = [newMessage, ...(currentData.messages || [])];
        writeDbFile(currentData);
      }
    }

    // Send Email Notification to Admin
    if (process.env.SMTP_HOST) {
      const mailOptions = {
        from: process.env.SMTP_USER, // sender address
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // list of receivers
        subject: `New Contact Message from ${newMessage.name}`, // Subject line
        text: `Name: ${newMessage.name}\nEmail: ${newMessage.email}\nMessage: ${newMessage.message}`, // plain text body
        html: `<p><strong>Name:</strong> ${newMessage.name}</p><p><strong>Email:</strong> ${newMessage.email}</p><p><strong>Message:</strong> ${newMessage.message}</p>`, // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } else {
      console.log("SMTP not configured, skipping email notification.");
    }

    res.json({ message: 'Message received', success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ message: 'Error saving message' });
  }
});

// 4. POST Reply Message
app.post('/api/reply', async (req, res) => {
  const { to, subject, message, originalMessageId } = req.body;

  if (!process.env.SMTP_HOST) {
    return res.status(500).json({ message: 'SMTP not configured' });
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: to,
    subject: subject || 'Re: Your message',
    text: message,
    html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reply sent to ${to}`);
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: 'Failed to send reply' });
  }
});

// 5. File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  // Use relative path for frontend access via proxy/middleware
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// --- Vite Middleware ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
}

startServer();
