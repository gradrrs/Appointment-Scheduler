import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import DateTimePicker from './DateTimePicker';
import ContactForm from './ContactForm';
import ConfirmationDialog from './ConfirmationDialog';
import { checkAvailability, createAppointment } from '../api';

export default function AppointmentStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [contactInfo, setContactInfo] = useState({ firstName: '', lastName: '', email: '', phone: '' });
  const [validContact, setValidContact] = useState(false);

  const [bookedSlots, setBookedSlots] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().split('T')[0]; 
      setLoading(true);
      checkAvailability(dateStr)
        .then(data => setBookedSlots(data.bookedSlots))
        .catch(() => setSnackbar({ open: true, message: 'Failed to load availability', severity: 'error' }))
        .finally(() => setLoading(false));
    }
  }, [selectedDate]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const handleContactChange = (valid, data) => {
    setValidContact(valid);
    setContactInfo(data);
  };

  const handleSubmit = async () => {
    if (!validContact) return;

    const appointment = {
      date: selectedDate.toISOString().split('T')[0],
      slot: selectedSlot,
      name: `${contactInfo.firstName} ${contactInfo.lastName}`.trim(),
      email: contactInfo.email,
      phone: contactInfo.phone
    };

    setLoading(true);
    try {
      await createAppointment(appointment);
      setSnackbar({ open: true, message: 'Appointment created! We will contact you soon.', severity: 'success' });
      setActiveStep(0);
      setSelectedDate(null);
      setSelectedSlot(null);
      setContactInfo({ firstName: '', lastName: '', email: '', phone: '' });
      setValidContact(false);
    } catch (error) {
      setSnackbar({ open: true, message: error.response?.data?.error || 'Error creating appointment', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const canGoToNextStep = () => {
    if (activeStep === 0) return selectedDate !== null;
    if (activeStep === 1) return selectedSlot !== null;
    return true;
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Schedule an Appointment
      </Typography>

      <Stepper activeStep={activeStep} orientation="vertical">
        <Step>
          <StepLabel>Select a date</StepLabel>
          <StepContent>
            <DateTimePicker
              onDateSelect={handleDateSelect}
              disabled={loading}
            />
            <Box sx={{ mb: 2, mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleNext} 
                disabled={!selectedDate || loading}
                sx={{ mr: 1 }}
              >
                Next
              </Button>
              <Button disabled={activeStep === 0} onClick={handleBack}>
                Back
              </Button>
            </Box>
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Select a time</StepLabel>
          <StepContent>
            {selectedDate ? (
              <Box>
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Box>
                    {[0,1,2,3,4,5,6,7].map(slot => {
                      const hour = 9 + slot;
                      const timeStr = `${hour}:00 - ${hour+1}:00`;
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <Button
                          key={slot}
                          variant={selectedSlot === slot ? 'contained' : 'outlined'}
                          disabled={isBooked}
                          onClick={() => handleSlotSelect(slot)}
                          sx={{ m: 0.5 }}
                        >
                          {timeStr}
                        </Button>
                      );
                    })}
                  </Box>
                )}
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={handleNext} 
                    disabled={!selectedSlot || loading}
                    sx={{ mr: 1 }}
                  >
                    Next
                  </Button>
                  <Button onClick={handleBack}>Back</Button>
                </Box>
              </Box>
            ) : (
              <Typography color="error">Please select a date first.</Typography>
            )}
          </StepContent>
        </Step>

        <Step>
          <StepLabel>Your details</StepLabel>
          <StepContent>
            <ContactForm onChange={handleContactChange} />
            <Box sx={{ mt: 2 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit} 
                disabled={!validContact || loading}
                sx={{ mr: 1 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Confirm'}
              </Button>
              <Button onClick={handleBack}>Back</Button>
            </Box>
          </StepContent>
        </Step>
      </Stepper>

      {activeStep === 3 && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you're finished</Typography>
          <Button onClick={() => setActiveStep(0)} sx={{ mt: 1, mr: 1 }}>
            Schedule Another
          </Button>
        </Paper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}