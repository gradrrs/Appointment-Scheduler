import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'appointments.db'));

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

export function getPublicAppointments() {
  const stmt = db.prepare('SELECT date, slot FROM appointments ORDER BY date, slot');
  return stmt.all();
}

export function getAllAppointments() {
  const stmt = db.prepare('SELECT id, date, slot, name, email, phone FROM appointments ORDER BY date, slot');
  return stmt.all();
}

export function addAppointment({ date, slot, name, email, phone }) {
  const stmt = db.prepare(`
    INSERT INTO appointments (date, slot, name, email, phone)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(date, slot, name, email, phone);
  return info.lastInsertRowid;
}

export function isSlotTaken(date, slot) {
  const stmt = db.prepare('SELECT id FROM appointments WHERE date = ? AND slot = ?');
  const row = stmt.get(date, slot);
  return !!row;
}

export function deleteAppointmentById(id) {
  const stmt = db.prepare('DELETE FROM appointments WHERE id = ?');
  const info = stmt.run(id);
  return info.changes > 0;
}

export function getAppointmentById(id) {
  const stmt = db.prepare('SELECT * FROM appointments WHERE id = ?');
  return stmt.get(id);
}