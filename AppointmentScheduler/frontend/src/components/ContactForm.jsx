import { useState, useEffect } from 'react';
import { TextField, Box } from '@mui/material';

export default function ContactForm({ onChange }) {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const [errors, setErrors] = useState({
    email: false,
    phone: false
  });

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => phone.replace(/\D/g, '').length >= 10;

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setForm(prev => ({ ...prev, [field]: value }));

    if (field === 'email') {
      setErrors(prev => ({ ...prev, email: !validateEmail(value) && value.length > 0 }));
    }
    if (field === 'phone') {
      setErrors(prev => ({ ...prev, phone: !validatePhone(value) && value.length > 0 }));
    }
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(form).every(v => v.trim() !== '');
    const noErrors = !errors.email && !errors.phone;
    onChange(allFieldsFilled && noErrors, form);
  }, [form, errors, onChange]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="First Name"
        value={form.firstName}
        onChange={handleChange('firstName')}
        required
      />
      <TextField
        label="Last Name"
        value={form.lastName}
        onChange={handleChange('lastName')}
        required
      />
      <TextField
        label="Email"
        type="email"
        value={form.email}
        onChange={handleChange('email')}
        error={errors.email}
        helperText={errors.email && 'Invalid email format'}
        required
      />
      <TextField
        label="Phone"
        value={form.phone}
        onChange={handleChange('phone')}
        error={errors.phone}
        helperText={errors.phone && 'Phone must have at least 10 digits'}
        required
      />
    </Box>
  );
}