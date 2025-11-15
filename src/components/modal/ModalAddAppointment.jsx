import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, InputLabel, Stack, Divider } from '@mui/material';
import DateTimeRangePicker from '../date/datetimerangepicker';
import dayjs from 'dayjs';

export default function ModalAddAppointment({ open, onClose, selectedDate, onSave }) {
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);

  const formatLocal = (fecha) => {
    if (!fecha) {
      return null;
    }

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    setAppointment({
      dateAppointment: selectedDate
        ? {
            date: dayjs(selectedDate),
            start: null,
            end: null
          }
        : null,
      role: null,
      professional: null,
      service: null,
      box: null,
      payType: null,
      discount: null,
      observation: null,
      errores: {}
    });
    setLoading(false);
  }, [open]);

  const handleAppointmentChange = (field, val) => {
    setAppointment((prev) => ({
      ...prev,
      [field]: val,
      errores: {
        ...prev.errores,
        [field]: false
      }
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: 'blur(6px)'
        }
      }}
    >
      <DialogTitle>Nueva cita</DialogTitle>
      <Divider />
      <DialogContent>
        <Grid container spacing={1}>
          {/* Fecha Cita */}
          <Grid item xs={12} sm={3}>
            <Stack spacing={1}>
              <InputLabel>Fecha Cita</InputLabel>
              <DateTimeRangePicker
                value={appointment.dateAppointment || { date: null, start: null, end: null }}
                onChange={(range) => handleAppointmentChange('dateAppointment', range)}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onSave} variant="contained">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
