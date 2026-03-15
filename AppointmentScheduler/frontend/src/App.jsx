import { Routes, Route } from 'react-router-dom';
import AppointmentStepper from './components/AppointmentStepper';
import Admin from './components/Admin';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Routes>
        <Route path="/" element={<AppointmentStepper />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </LocalizationProvider>
  );
}

export default App;