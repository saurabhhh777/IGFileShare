const express = require('express');
const multer = require('multer');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const File = require("./models/Files.js");
const dotenv = require("dotenv");
const app = express();
dotenv.config({});

const PORT = process.env.PORT || 7000;


// MongoDB connection
mongoose.connect(`${process.env.MONGODB_URL}`);

app.use(cors());
app.use(express.json());

// Multer configuration (in-memory storage)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// File upload route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File upload failed' });
  }

  const expirationTime = Date.now() + 15 * 60 * 1000; // 15 minutes from now
  const fileData = {
    filename: req.file.originalname,
    data: req.file.buffer.toString('base64'),
    contentType: req.file.mimetype,
    expirationTime,
  };

  // Save file metadata in MongoDB
  const file = new File(fileData);
  await file.save();

  const downloadLink = `http://localhost:${PORT}/download/${file._id}`;
  res.json({ link: downloadLink });

  console.log(`File ${file.filename} will expire in 15 minutes.`);
});

// File download route
app.get('/download/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);

    if (!file || file.expirationTime < Date.now()) {
      return res.status(404).json({ error: 'Link expired or file not found' });
    }

    const fileBuffer = Buffer.from(file.data, 'base64');
    res.set('Content-Type', file.contentType);
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(fileBuffer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to download the file' });
  }
});

// Background process to delete expired files
setInterval(async () => {
  const now = Date.now();
  await File.deleteMany({ expirationTime: { $lt: now } });
  console.log('Expired files deleted.');
}, 60 * 1000); // Runs every 1 minute

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
