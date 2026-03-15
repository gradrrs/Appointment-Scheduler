import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { isWeekend } from 'date-fns';

export default function DateTimePicker({ onDateSelect, disabled }) {
  const disablePastDates = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  return (
    <DatePicker
      label="Select date"
      onChange={onDateSelect}
      shouldDisableDate={disablePastDates}
      disabled={disabled}
      slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
    />
  );
}