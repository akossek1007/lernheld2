import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;
import fs from 'fs';

const dbPath = process.env.DATABASE_PATH || 'lernheld.db';

// Ensure the directory for the database exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

console.log(`Using database at: ${dbPath}`);

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    start_time DATETIME,
    end_time DATETIME
  );

  CREATE TABLE IF NOT EXISTS user_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    phase_id TEXT,
    subject TEXT,
    score INTEGER,
    completed_at DATETIME
  );

  CREATE TABLE IF NOT EXISTS task_attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    phase_id TEXT,
    subject TEXT,
    task_id TEXT,
    task_type TEXT,
    prompt TEXT,
    expected_answer TEXT,
    learner_answer TEXT,
    is_correct INTEGER,
    target_word TEXT,
    attempted_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS achievements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    type TEXT,
    unlocked_at DATETIME
  );
`);

app.use(express.json());

// Serve Vite-built static files in production
// process.cwd() points to the project root where package.json is (c:\Projects\Lernheld)
const distPath = path.join(process.cwd(), 'dist');
app.use(express.static(distPath));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'connected' });
});

// User Management API
app.get('/api/users', (req, res) => {
  const users = db.prepare('SELECT * FROM users').all();
  res.json(users);
});

app.post('/api/users', (req: express.Request, res: express.Response) => {
  const { name, avatar } = req.body;
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO users (id, name, avatar) VALUES (?, ?, ?)').run(id, name, avatar);
  res.json({ id, name, avatar });
});

app.post('/api/progress', (req: express.Request, res: express.Response) => {
  const { user_id, phase_id, subject, score } = req.body;
  const stmt = db.prepare('INSERT INTO user_progress (user_id, phase_id, subject, score, completed_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)');
  stmt.run(user_id, phase_id, subject, score);
  res.json({ success: true });
});

app.post('/api/attempt', (req: express.Request, res: express.Response) => {
  const {
    user_id, phase_id, subject, task_id, task_type, prompt,
    expected_answer, learner_answer, is_correct, target_word
  } = req.body;

  const stmt = db.prepare(`
    INSERT INTO task_attempts (
      user_id, phase_id, subject, task_id, task_type, prompt,
      expected_answer, learner_answer, is_correct, target_word
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    user_id,
    phase_id,
    subject,
    task_id,
    task_type,
    prompt,
    expected_answer,
    learner_answer,
    is_correct,
    target_word
  );
  res.json({ success: true });
});

app.get('/api/progress', (req, res) => {
  const progress = db.prepare('SELECT * FROM user_progress ORDER BY completed_at DESC').all();
  res.json(progress);
});


// SPA catch-all: serve index.html for any non-API route
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`LernHeld backend running at http://localhost:${port}`);
});
