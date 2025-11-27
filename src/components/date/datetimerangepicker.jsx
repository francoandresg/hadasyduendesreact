import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker, MobileTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

export default function DateTimeRangePicker({ value, onChange, error = false, helperText = '' }) {
  const [openDate, setOpenDate] = useState(false);
  const [openStartTime, setOpenStartTime] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);

  const [date, setDate] = useState(null);
  const [startTmp, setStartTmp] = useState(null);
  const [endTmp, setEndTmp] = useState(null);

  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);

  useEffect(() => {
    if (value?.date) {
      setDate(value.date);
      setStart(null);
      setEnd(null);
      setStartTmp(null);
      setEndTmp(null);
    }
  }, [value]);

  const getInputValue = () => {
    if (!date) return '';

    const d = date.format('DD/MM/YYYY');
    const s = startTmp ? startTmp.format('HH:mm') : start?.format('HH:mm');
    const e = endTmp ? endTmp.format('HH:mm') : end?.format('HH:mm');

    if (s && e) return `${d} ${s} - ${e}`;
    if (s && !e) return `${d} ${s} - ...`;
    return d;
  };

  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
        localeText={{ okButtonLabel: 'Siguiente', timePickerToolbarTitle: 'Hora Inicio', datePickerToolbarTitle: 'Fecha Cita' }}
      >
        {/* Campo visible */}
        <TextField
          fullWidth
          readOnly
          sx={{ '& .MuiInputBase-root': { height: 41 } }}
          value={getInputValue()}
          onClick={() => {
            if (date && !start && !end) {
              setOpenStartTime(true); // pa' saltarse el calendario
            } else {
              setOpenDate(true);
            }
          }}
          autoComplete="off"
          error={error}
          helperText={helperText}
        />

        {/* ---------------- FECHA ---------------- */}
        <MobileDatePicker
          open={openDate}
          value={date}
          onChange={setDate}
          minDate={dayjs()}
          onAccept={(v) => {
            setDate(v);
            setOpenDate(false);
            setOpenStartTime(true);
          }}
          onClose={() => setOpenDate(false)}
          slotProps={{
            textField: { sx: { display: 'none' } },
            actionBar: {
              actions: ['accept']
            }
          }}
        />

        {/* ---------------- HORA INICIO ---------------- */}
        <MobileTimePicker
          open={openStartTime}
          value={startTmp}
          onChange={setStartTmp}
          onAccept={(v) => {
            setStartTmp(v);
            setOpenStartTime(false);
            setOpenEndTime(true);
          }}
          onClose={() => {
            setOpenStartTime(false);

            // si el usuario salió sin aceptar y no hay hora confirmada…
            if (!startTmp && !start) {
              // limpia todo
              setDate(null);
              setEnd(null);
              setEndTmp(null);
            }

            // si estaba eligiendo pero salió sin aceptar
            if (!startTmp) {
              setStartTmp(null);
            }
          }}
          ampm={false}
          views={['hours', 'minutes']}
          slotProps={{
            textField: { sx: { display: 'none' } },
            actionBar: {
              actions: ['accept']
            }
          }}
        />
      </LocalizationProvider>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="es"
        localeText={{ okButtonLabel: 'Guardar', timePickerToolbarTitle: 'Hora Termino' }}
      >
        {/* ---------------- HORA FIN ---------------- */}
        <MobileTimePicker
          open={openEndTime}
          value={endTmp}
          onChange={setEndTmp}
          onAccept={(v) => {
            let s = startTmp;
            let e = v;

            if (e.isBefore(s)) [s, e] = [e, s];

            setStart(s);
            setEnd(e);
            setOpenEndTime(false);
          }}
          onClose={() => {
            setOpenEndTime(false);

            // si el usuario salió sin aceptar y no hay hora final confirmada
            if (!endTmp && !end) {
              setStart(null);
              setStartTmp(null);
              setDate(null);
            }

            // si estaba editando pero salió sin aceptar
            if (!endTmp) {
              setEndTmp(null);
            }
          }}
          ampm={false}
          views={['hours', 'minutes']}
          slotProps={{
            textField: { sx: { display: 'none' } },
            actionBar: {
              actions: ['accept']
            }
          }}
        />
      </LocalizationProvider>
    </>
  );
}
