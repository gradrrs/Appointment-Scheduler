import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

export default function ConfirmationDialog({ open, onClose, onConfirm, appointment }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Your Appointment</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Please verify your appointment details:
        </Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          <strong>Name:</strong> {appointment?.name}
        </Typography>
        <Typography variant="body2">
          <strong>Date:</strong> {appointment?.date}
        </Typography>
        <Typography variant="body2">
          <strong>Time:</strong> {appointment?.time}
        </Typography>
        <Typography variant="body2">
          <strong>Email:</strong> {appointment?.email}
        </Typography>
        <Typography variant="body2">
          <strong>Phone:</strong> {appointment?.phone}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}