import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  initialProfile,
  initialBooks,
  initialRequests,
  initialReviews,
  initialContact,
  initialMessages
} from './src/data/seedData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

const PUBLIC_DIR = path.join(__dirname, 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const DOWNLOADS_DIR = path.join(PUBLIC_DIR, 'downloads');

// Ensure directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}

// Generate minimal valid PDF files for starter downloads if not present
function ensureStarterPdfs() {
  const starterFiles = [
    { name: 'feel-good-focus-preview.pdf', title: 'Feel-Good Focus (Free Preview Sample)' },
    { name: 'feel-good-focus-full.pdf', title: 'Feel-Good Focus (Official Complete Edition)' },
    { name: 'creators-blueprint-preview.pdf', title: 'The Creator Blueprint (Free Preview Sample)' },
    { name: 'creators-blueprint-full.pdf', title: 'The Creator Blueprint (Official Complete Edition)' },
    { name: 'wealth-mindset-preview.pdf', title: 'Wealth & Mindset (Free Preview Sample)' },
    { name: 'wealth-mindset-full.pdf', title: 'Wealth & Mindset (Official Complete Edition)' }
  ];

  starterFiles.forEach(file => {
    const filePath = path.join(DOWNLOADS_DIR, file.name);
    if (!fs.existsSync(filePath)) {
      // Create a clean valid PDF 1.4 stream
      const text = `${file.title} by Jayed Mahmud. Official direct publication from jayedmahmud.com.`;
      const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
5 0 obj << /Length ${text.length + 80} >>
stream
BT
/F1 18 Tf
50 720 Td
(${file.title}) Tj
0 -30 Td
/F1 12 Tf
(Author: Jayed Mahmud) Tj
0 -25 Td
(Official direct publication. Verified license.) Tj
0 -25 Td
(Enjoy reading this publication!) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000060 00000 n 
0000000117 00000 n 
0000000233 00000 n 
0000000305 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
${450 + text.length}
%%EOF`;
      fs.writeFileSync(filePath, pdfContent, 'utf-8');
    }
  });
}
ensureStarterPdfs();

// Load or initialize database
function getDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    const defaultData = {
      profile: initialProfile,
      books: initialBooks,
      requests: initialRequests,
      reviews: initialReviews,
      contact: initialContact,
      messages: initialMessages,
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, returning defaults:', err);
    return {
      profile: initialProfile,
      books: initialBooks,
      requests: initialRequests,
      reviews: initialReviews,
      contact: initialContact,
      messages: initialMessages,
    };
  }
}

function saveDatabase(data: any) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Serve uploaded and downloadable PDF files statically
  app.use('/uploads', express.static(UPLOADS_DIR));
  app.use('/downloads', express.static(DOWNLOADS_DIR));

  // File Upload API (PDFs and Cover images)
  app.post('/api/upload', (req, res) => {
    try {
      const { fileName, fileData, fileType } = req.body;
      if (!fileName || !fileData) {
        return res.status(400).json({ error: 'Missing fileName or fileData' });
      }

      const base64Data = fileData.includes('base64,') ? fileData.split('base64,')[1] : fileData;
      const buffer = Buffer.from(base64Data, 'base64');
      
      const ext = path.extname(fileName) || (fileType?.includes('pdf') ? '.pdf' : '.png');
      const baseName = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueName = `${baseName}_${Date.now()}${ext}`;
      const filePath = path.join(UPLOADS_DIR, uniqueName);

      fs.writeFileSync(filePath, buffer);
      const fileUrl = `/uploads/${uniqueName}`;
      const sizeInMb = (buffer.length / (1024 * 1024)).toFixed(2);
      const fileSize = buffer.length > 1024 * 1024 ? `${sizeInMb} MB` : `${Math.round(buffer.length / 1024)} KB`;

      return res.json({
        success: true,
        url: fileUrl,
        fileName: uniqueName,
        originalName: fileName,
        fileSize,
      });
    } catch (err: any) {
      console.error('File upload error in server:', err);
      return res.status(500).json({ error: 'Failed to process file upload: ' + err.message });
    }
  });

  // API Routes
  app.get('/api/data', (_req, res) => {
    const db = getDatabase();
    res.json(db);
  });

  // Profile update
  app.put('/api/profile', (req, res) => {
    const db = getDatabase();
    db.profile = { ...db.profile, ...req.body };
    saveDatabase(db);
    res.json({ success: true, profile: db.profile });
  });

  // Books endpoints
  app.post('/api/books', (req, res) => {
    const db = getDatabase();
    const newBook = {
      id: 'book-' + Date.now(),
      publishedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      ...req.body
    };
    db.books.unshift(newBook);
    saveDatabase(db);
    res.json({ success: true, book: newBook });
  });

  app.put('/api/books/:id', (req, res) => {
    const db = getDatabase();
    const index = db.books.findIndex((b: any) => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }
    db.books[index] = { ...db.books[index], ...req.body };
    saveDatabase(db);
    res.json({ success: true, book: db.books[index] });
  });

  app.delete('/api/books/:id', (req, res) => {
    const db = getDatabase();
    db.books = db.books.filter((b: any) => b.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Download Requests
  app.post('/api/requests', (req, res) => {
    const db = getDatabase();
    const newRequest = {
      id: 'req-' + Date.now(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };
    // If request for same book from same user exists, replace or update it
    const existingIdx = db.requests.findIndex(
      (r: any) => r.bookId === newRequest.bookId && r.userEmail === newRequest.userEmail
    );
    if (existingIdx !== -1) {
      db.requests[existingIdx] = {
        ...db.requests[existingIdx],
        ...newRequest,
        status: 'pending',
        rejectionReason: undefined,
        updatedAt: new Date().toISOString()
      };
    } else {
      db.requests.unshift(newRequest);
    }
    saveDatabase(db);
    res.json({ success: true, request: newRequest });
  });

  app.put('/api/requests/:id', (req, res) => {
    const db = getDatabase();
    const index = db.requests.findIndex((r: any) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Request not found' });
    }
    db.requests[index] = {
      ...db.requests[index],
      status: req.body.status,
      rejectionReason: req.body.rejectionReason,
      updatedAt: new Date().toISOString()
    };
    saveDatabase(db);
    res.json({ success: true, request: db.requests[index] });
  });

  // Reviews
  app.post('/api/reviews', (req, res) => {
    const db = getDatabase();
    const newReview = {
      id: 'rev-' + Date.now(),
      status: 'pending', // Requires admin approval as per user brief!
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.reviews.unshift(newReview);
    saveDatabase(db);
    res.json({ success: true, review: newReview });
  });

  app.put('/api/reviews/:id', (req, res) => {
    const db = getDatabase();
    const index = db.reviews.findIndex((r: any) => r.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    db.reviews[index] = {
      ...db.reviews[index],
      ...req.body
    };
    saveDatabase(db);
    res.json({ success: true, review: db.reviews[index] });
  });

  app.delete('/api/reviews/:id', (req, res) => {
    const db = getDatabase();
    db.reviews = db.reviews.filter((r: any) => r.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  // Contact Info
  app.put('/api/contact', (req, res) => {
    const db = getDatabase();
    db.contact = { ...db.contact, ...req.body };
    saveDatabase(db);
    res.json({ success: true, contact: db.contact });
  });

  app.post('/api/messages', (req, res) => {
    const db = getDatabase();
    const newMsg = {
      id: 'msg-' + Date.now(),
      status: 'unread',
      replies: [],
      createdAt: new Date().toISOString(),
      ...req.body
    };
    db.messages.unshift(newMsg);
    saveDatabase(db);
    res.json({ success: true, message: newMsg });
  });

  app.put('/api/messages/:id/reply', (req, res) => {
    const db = getDatabase();
    const index = db.messages.findIndex((m: any) => m.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const currentMsg = db.messages[index];
    const sender = req.body.sender || 'author'; // 'author' or 'user'
    const replyText = req.body.reply || req.body.message || '';
    const senderName = req.body.senderName || (sender === 'user' ? (currentMsg.name || 'Reader') : 'Jayed Mahmud (Author)');
    const senderAvatar = req.body.senderAvatar || (sender === 'author' ? '/assets/aistudio/image_3eb4b58c.png' : currentMsg.userAvatar);

    // Initialize replies array if not present, and migrate legacy reply
    if (!Array.isArray(currentMsg.replies)) {
      currentMsg.replies = [];
      if (currentMsg.reply) {
        currentMsg.replies.push({
          id: 'rep-legacy',
          sender: 'author',
          senderName: 'Jayed Mahmud (Author)',
          senderAvatar: '/assets/aistudio/image_3eb4b58c.png',
          message: currentMsg.reply,
          createdAt: currentMsg.replyAt || currentMsg.createdAt
        });
      }
    }

    const replyItem = {
      id: 'rep-' + Date.now(),
      sender,
      senderName,
      senderAvatar,
      message: replyText,
      createdAt: new Date().toISOString()
    };

    currentMsg.replies.push(replyItem);
    currentMsg.reply = replyText;
    currentMsg.replyAt = replyItem.createdAt;
    // If author replied, status is 'replied'. If reader sent a follow-up, status becomes 'unread' for author attention!
    currentMsg.status = sender === 'author' ? 'replied' : 'unread';

    saveDatabase(db);
    res.json({ success: true, message: currentMsg, reply: replyItem });
  });

  app.delete('/api/messages/:id', (req, res) => {
    const db = getDatabase();
    db.messages = db.messages.filter((m: any) => m.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });

  app.delete('/api/messages', (_req, res) => {
    const db = getDatabase();
    db.messages = [];
    saveDatabase(db);
    res.json({ success: true });
  });

  // Reset to default seed data if needed
  app.post('/api/reset', (_req, res) => {
    const defaultData = {
      profile: initialProfile,
      books: initialBooks,
      requests: initialRequests,
      reviews: initialReviews,
      contact: initialContact,
      messages: initialMessages,
    };
    saveDatabase(defaultData);
    res.json({ success: true, data: defaultData });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production' && fs.existsSync(path.join(__dirname, 'dist'))) {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
