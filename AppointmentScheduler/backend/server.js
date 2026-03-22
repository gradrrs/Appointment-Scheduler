import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getPublicAppointments,
  getAllAppointments,
  addAppointment,
  isSlotTaken,
  deleteAppointmentById
} from './db.js';
import { getAppointmentById } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

app.get('/api/availability', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const allAppointments = getPublicAppointments(); 
  const bookedSlots = allAppointments
    .filter(a => a.date === date)
    .map(a => a.slot);
  res.json({ bookedSlots });
});

app.get('/api/appointments', (req, res) => {
  const appointments = getPublicAppointments();
  res.json(appointments);
});

app.post('/api/appointments', async (req, res) => {
  const { date, slot, name, email, phone } = req.body;

  if (!date || slot === undefined || !name || !email || !phone) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const slotNumber = Number(slot);
  if (slotNumber < 0 || slotNumber > 7) {
    return res.status(400).json({ error: 'Slot must be between 0 and 7' });
  }

  if (isSlotTaken(date, slotNumber)) {
    return res.status(409).json({ error: 'This time slot is already booked' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    return res.status(400).json({ error: 'Phone number must have at least 10 digits' });
  }

  const id = addAppointment({
    date,
    slot: slotNumber,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phoneDigits
  });

  console.log(`Appointment created for ${name} on ${date} at slot ${slotNumber}`);
  console.log(`Email: ${email},  Phone: ${phoneDigits}`);


  res.status(201).json({ success: true, id });
});

app.get('/api/admin/appointments', (req, res) => {
  const appointments = getAllAppointments();
  res.json(appointments);
});

app.delete('/api/admin/appointments/:id', (req, res) => {
  const { id } = req.params;
  const deleted = deleteAppointmentById(id);
  if (deleted) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.get('/api/admin/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointment = getAppointmentById(id);
  if (appointment) {
    res.json(appointment);
  } else {
    res.status(404).json({ error: 'Appointment not found' });
  }
});