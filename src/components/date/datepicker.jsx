import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function DatePicker({ value, onChange, error = false, helperText = '', label }) {
  const [openDate, setOpenDate] = useState(false);
  const [date, setDate] = useState(null);

  useEffect(() => {
    if (value) {
      // value viene en string o date → lo conviertes a dayjs
      setDate(dayjs(value));
    }
  }, [value]);

  const handleAccept = (v) => {
    const d = dayjs(v);
    setDate(d);
    setOpenDate(false);

    // devuelves 'YYYY-MM-DD'
    if (onChange) onChange(d.format('YYYY-MM-DD'));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <TextField
        fullWidth
        readOnly
        value={date ? date.format('DD/MM/YYYY') : ''}
        onClick={() => setOpenDate(true)}
        autoComplete="off"
        error={error}
        label={label || 'Fecha'}
        helperText={helperText}
      />

      <MobileDatePicker
        open={openDate}
        value={date}
        onChange={(v) => setDate(dayjs(v))}
        onAccept={handleAccept}
        onClose={() => setOpenDate(false)}
        slotProps={{
          textField: { sx: { display: 'none' } },
          actionBar: { actions: ['accept'] }
        }}
      />
    </LocalizationProvider>
  );
}