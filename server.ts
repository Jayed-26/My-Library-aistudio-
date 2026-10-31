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

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

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

  app.use(express.json({ limit: '25mb' }));

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

  // Quick Messages
  app.post('/api/messages', (req, res) => {
    const db = getDatabase();
    const newMsg = {
      id: 'msg-' + Date.now(),
      status: 'unread',
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
    db.messages[index] = {
      ...db.messages[index],
      reply: req.body.reply,
      replyAt: new Date().toISOString(),
      status: 'replied'
    };
    saveDatabase(db);
    res.json({ success: true, message: db.messages[index] });
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
