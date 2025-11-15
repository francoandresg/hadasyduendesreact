import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  InputLabel,
  Stack,
  Divider,
  Autocomplete,
  TextField
} from '@mui/material';
import DateTimeRangePicker from '../date/datetimerangepicker';
import dayjs from 'dayjs';

export default function ModalAddAppointment({ open, onClose, selectedDate, onSave, boxes }) {
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);

  const formatLocal = (fecha) => {
    if (!fecha) return null;

    const d = new Date(fecha);
    return dayjs(d).format('YYYY-MM-DDTHH:mm:ss');
  };

  useEffect(() => {
    setAppointment({
      dateAppointment: selectedDate
        ? { date: dayjs(selectedDate), start: null, end: null }
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
      errores: { ...prev.errores, [field]: false }
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
        <Grid container spacing={2}>
          
          {/* Fecha Cita */}
          <Grid item xs={12} size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Fecha Cita</InputLabel>
              <DateTimeRangePicker
                value={appointment.dateAppointment || { date: null, start: null, end: null }}
                onChange={(range) => handleAppointmentChange('dateAppointment', range)}
              />
            </Stack>
          </Grid>

          {/* Box */}
          <Grid item xs={12} size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Box</InputLabel>
              <Autocomplete
                value={appointment.box || null}
                onChange={(_, newValue) => handleAppointmentChange('box', newValue)}
                options={boxes || []}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    sx={{
                      '& .MuiInputBase-root': {
                        height: 40
                      }
                    }}
                  />
                )}
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
