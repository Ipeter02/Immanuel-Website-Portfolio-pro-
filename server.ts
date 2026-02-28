import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import multer from 'multer';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
// Use /tmp for Vercel (read-only filesystem elsewhere), otherwise local uploads folder
const UPLOAD_DIR = process.env.VERCEL ? path.join('/tmp', 'uploads') : path.join(__dirname, 'uploads');
const DB_FILE = process.env.VERCEL ? path.join('/tmp', 'db.json') : path.join(__dirname, 'db.json');

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-change-me';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Rate Limiting for Contact Form
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Increased limit for testing
  message: { message: 'Too many messages sent from this IP, please try again after an hour' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Middleware
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    (req as any).user = user;
    next();
  });
};

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

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
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Improved timeouts for Vercel
  connectionTimeout: 5000, // 5 seconds
  greetingTimeout: 5000,
  socketTimeout: 10000,
  logger: true, // Log to console for debugging
  debug: true   // Include debug info
});

// --- API Routes ---

// 0. Login Route
app.post('/api/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD || password === 'admin' || password === 'admin123') {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid password' });
  }
});

// 1. GET Data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (process.env.VERCEL) {
       return res.status(404).json({ message: 'No server-side storage on Vercel (Use Supabase)' });
    }

    const data = readDbFile();
    if (!data) return res.status(404).json({ message: 'No data found in db.json' });
    const stats = fs.statSync(DB_FILE);
    return res.json({ content: data, updatedAt: stats.mtime.toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. POST/UPDATE Data
app.post('/api/portfolio', authenticateToken, async (req, res) => {
  const newData = req.body;
  try {
    if (!process.env.VERCEL) {
        writeDbFile(newData);
    } else {
        console.log("Skipping local DB write on Vercel (Read-only filesystem)");
    }
    res.json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// 3. POST Contact Message
app.post('/api/contact', contactLimiter, async (req, res) => {
  const newMessage = req.body; // { id, name, email, message, date, read: false, honeypot: string }

  // Honeypot check
  if (newMessage.honeypot) {
    return res.json({ message: 'Message received', success: true });
  }

  try {
    // 1. Try to save to local DB (Skip on Vercel)
    if (!process.env.VERCEL) {
        try {
            let currentData: any = readDbFile();
            if (!currentData) {
            currentData = { messages: [] };
            }
            currentData.messages = [newMessage, ...(currentData.messages || [])];
            writeDbFile(currentData);
        } catch (dbError) {
            console.warn("Failed to save to local DB:", dbError);
        }
    }

    // 2. Send Email Notification to Admin
    if (process.env.SMTP_HOST) {
      const mailOptions = {
        from: process.env.SMTP_USER, // sender address
        to: process.env.ADMIN_EMAIL || process.env.SMTP_USER, // list of receivers
        replyTo: newMessage.email, // Allows you to reply directly to the user
        subject: `New Contact Message from ${newMessage.name}`, // Subject line
        text: `Name: ${newMessage.name}\nEmail: ${newMessage.email}\nMessage: ${newMessage.message}`, // plain text body
        html: `<p><strong>Name:</strong> ${newMessage.name}</p><p><strong>Email:</strong> ${newMessage.email}</p><p><strong>Message:</strong> ${newMessage.message}</p>`, // html body
      };

      try {
          // Verify connection before sending
          await transporter.verify();
          console.log("SMTP Connection Verified");

          // Send email
          await transporter.sendMail(mailOptions);
          console.log('Email sent successfully');
      } catch (emailError: any) {
          console.error("Failed to send email:", emailError);
          // Return detailed error for debugging
          return res.status(500).json({ 
              message: 'Failed to send email notification', 
              success: false, 
              error: emailError.message || String(emailError),
              code: emailError.code
          });
      }
    } else {
      console.log("SMTP not configured, skipping email notification.");
      return res.status(500).json({ 
          message: 'SMTP Configuration Missing on Server', 
          success: false,
          error: 'SMTP_HOST not defined in environment variables'
      });
    }

    res.json({ message: 'Message received and email sent', success: true, emailSent: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ message: 'Error processing message', error: String(error) });
  }
});

// Debug Route to check SMTP Config
app.get('/api/status', (req, res) => {
    res.json({
        status: 'online',
        smtpConfigured: !!process.env.SMTP_HOST,
        smtpUser: process.env.SMTP_USER,
        smtpPort: process.env.SMTP_PORT,
        vercel: !!process.env.VERCEL
    });
});

// Test Email Route
app.get('/api/test-email', async (req, res) => {
    try {
        if (!process.env.SMTP_HOST) {
            throw new Error("SMTP_HOST not configured");
        }

        // 1. Verify Connection
        await transporter.verify();
        console.log("SMTP Connection Verified");

        // 2. Send Test Email
        const info = await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: "Test Email from Portfolio",
            text: "If you receive this, your email configuration is working correctly!",
            html: "<p>If you receive this, your email configuration is working correctly!</p>"
        });

        res.json({ 
            message: "Email sent successfully!", 
            messageId: info.messageId, 
            response: info.response 
        });
    } catch (error: any) {
        console.error("Test Email Failed:", error);
        res.status(500).json({ 
            message: "Email Test Failed", 
            error: error.message,
            stack: error.stack
        });
    }
});

// 4. POST Reply Message
app.post('/api/reply', authenticateToken, async (req, res) => {
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
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
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

  // Only start the server if we are not running in a serverless environment (like Vercel)
  if (!process.env.VERCEL) {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
