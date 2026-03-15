import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

db.exec(`
  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,          -- YYYY-MM-DD
    slot INTEGER NOT NULL,        -- 0..7 (0 = 9:00, 1 = 10:00, ...)
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

