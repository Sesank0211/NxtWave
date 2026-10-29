const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');

const databasePath = process.env.SQLITE_PATH || path.resolve(__dirname, '../../data/projectzero.sqlite');
fs.mkdirSync(path.dirname(databasePath), { recursive: true });

const database = new DatabaseSync(databasePath);
database.exec('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
database.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    collegeName TEXT NOT NULL,
    graduationYear TEXT NOT NULL,
    referralCode TEXT NOT NULL COLLATE NOCASE UNIQUE,
    referredBy TEXT,
    registeredAt TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
  CREATE INDEX IF NOT EXISTS idx_students_referredBy ON students(referredBy);
  CREATE INDEX IF NOT EXISTS idx_students_registeredAt ON students(registeredAt);
  CREATE INDEX IF NOT EXISTS idx_students_graduationYear ON students(graduationYear);
`);

let connected = true;

function isDbConnected() {
  try {
    database.prepare('SELECT 1').get();
    return connected;
  } catch {
    return false;
  }
}

async function connectDB() {
  database.prepare('SELECT 1').get();
  connected = true;
  console.log(`[Database] SQLite ready: ${databasePath}`);
}

function closeDB() {
  if (!connected) return;
  database.close();
  connected = false;
}

module.exports = { database, connectDB, isDbConnected, closeDB, databasePath };
