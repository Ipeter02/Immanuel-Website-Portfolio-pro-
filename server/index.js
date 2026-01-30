require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_FILE = path.join(__dirname, 'db.json');
const UPLOAD_DIR = path.join(__dirname, 'uploads');

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '100mb' })); // Increased to 100mb
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use('/uploads', express.static(UPLOAD_DIR));

// Ensure upload dir exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// --- MongoDB Setup ---
let isMongoConnected = false;

// Define Schema
const PortfolioSchema = new mongoose.Schema({
  id: { type: Number, default: 1 }, // We only store one portfolio document
  content: { type: Object, required: true } // Stores the entire AppData JSON
}, { timestamps: true });

const PortfolioModel = mongoose.model('Portfolio', PortfolioSchema);

// Connect to MongoDB
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

// --- Multer Storage for File Uploads ---
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
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// --- Helper Functions (File System Fallback) ---
const readDbFile = () => {
  if (!fs.existsSync(DB_FILE)) return null;
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDbFile = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// --- Routes ---

// 1. GET Data
app.get('/api/portfolio', async (req, res) => {
  try {
    if (isMongoConnected) {
      // Fetch from MongoDB
      const doc = await PortfolioModel.findOne({ id: 1 });
      if (!doc) {
        return res.status(404).json({ message: 'No data found in MongoDB' });
      }
      return res.json(doc.content);
    } else {
      // Fetch from File
      const data = readDbFile();
      if (!data) {
        return res.status(404).json({ message: 'No data found in db.json' });
      }
      return res.json(data);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. POST/UPDATE Data (Full Overwrite)
app.post('/api/portfolio', async (req, res) => {
  const newData = req.body;

  try {
    if (isMongoConnected) {
      // Save to MongoDB (Upsert: Update if exists, Insert if not)
      await PortfolioModel.findOneAndUpdate(
        { id: 1 },
        { content: newData },
        { upsert: true, new: true }
      );
      console.log('Saved to MongoDB (Full Update)');
    } else {
      // Save to File
      writeDbFile(newData);
      console.log('Saved to db.json (Full Update)');
    }
    res.json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// 3. POST Contact Message (Incremental Update)
app.post('/api/contact', async (req, res) => {
  const newMessage = req.body; // Expects { id, name, email, message, date, read: false }

  try {
    let currentData;

    if (isMongoConnected) {
      const doc = await PortfolioModel.findOne({ id: 1 });
      if (doc) {
        currentData = doc.content;
        // Prepend message
        currentData.messages = [newMessage, ...currentData.messages];
        
        await PortfolioModel.findOneAndUpdate(
            { id: 1 },
            { content: currentData },
            { upsert: true }
        );
        console.log('Message added to MongoDB');
      }
    } else {
      currentData = readDbFile();
      if (currentData) {
        currentData.messages = [newMessage, ...currentData.messages];
        writeDbFile(currentData);
        console.log('Message added to db.json');
      }
    }

    if (!currentData) {
        return res.status(500).json({ message: 'Database not initialized' });
    }

    res.json({ message: 'Message received', success: true });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ message: 'Error saving message' });
  }
});

// 4. Login Endpoint (Simple simulation)
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  // Hardcoded for demo. In production, use MongoDB User collection + bcrypt.
  if (password === 'admin123') {
    res.json({ 
      user: { email: email, id: 1, role: 'admin' }, 
      token: 'fake-jwt-token-123' 
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// 5. File Upload Endpoint
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  const fileUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});