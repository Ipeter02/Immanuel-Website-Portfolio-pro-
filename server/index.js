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
app.use(bodyParser.json({ limit: '50mb' }));
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
    .catch(err => console.error('❌ MongoDB Connection Error:', err));
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
const upload = multer({ storage: storage });

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

// 2. POST/UPDATE Data
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
      console.log('Saved to MongoDB');
    } else {
      // Save to File
      writeDbFile(newData);
      console.log('Saved to db.json');
    }
    res.json({ message: 'Data saved successfully', data: newData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error saving data' });
  }
});

// 3. Login Endpoint (Simple simulation)
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

// 4. File Upload Endpoint
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
