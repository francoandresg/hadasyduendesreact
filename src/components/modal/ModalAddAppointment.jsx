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
  TextField,
  Typography
} from '@mui/material';
import DateTimeRangePicker from '../date/datetimerangepicker';
import dayjs from 'dayjs';

export default function ModalAddAppointment({ open, onClose, selectedDate, onSave, boxes, clients, roles }) {
  const [appointment, setAppointment] = useState({});
  const [loading, setLoading] = useState(false);

  const formatLocal = (fecha) => {
    if (!fecha) return null;

    const d = new Date(fecha);
    return dayjs(d).format('YYYY-MM-DDTHH:mm:ss');
  };

  useEffect(() => {
    setAppointment({
      dateAppointment: selectedDate ? { date: dayjs(selectedDate), start: null, end: null } : null,
      role: null,
      client: null,
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
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.3rem' }}>Nueva cita</DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 1 }}>
        <Grid container spacing={3}>
          {/* ---------------- FECHA Y HORARIO ---------------- */}

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Fecha</InputLabel>
              <DateTimeRangePicker
                value={appointment.dateAppointment}
                onChange={(range) => handleAppointmentChange('dateAppointment', range)}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Cliente</InputLabel>
              <Autocomplete
                value={appointment.client}
                onChange={(_, val) => handleAppointmentChange('client', val)}
                options={clients || []}
                getOptionLabel={(o) => o.name}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Tipo de Servicio</InputLabel>
              <Autocomplete
                value={appointment.role}
                onChange={(_, val) => handleAppointmentChange('role', val)}
                options={roles || []}
                getOptionLabel={(o) => o.name}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Profesional</InputLabel>
              <Autocomplete
                value={appointment.professional}
                onChange={(_, val) => handleAppointmentChange('professional', val)}
                options={roles || []}
                getOptionLabel={(o) => o.name}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

           <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Servicio</InputLabel>
              <Autocomplete
                value={appointment.service}
                onChange={(_, val) => handleAppointmentChange('service', val)}
                options={boxes || []}
                getOptionLabel={(o) => o.name}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Box</InputLabel>
              <Autocomplete
                value={appointment.box}
                onChange={(_, val) => handleAppointmentChange('box', val)}
                options={boxes || []}
                getOptionLabel={(o) => o.name}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

          {/* ---------------- PAGO ---------------- */}

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Método de Pago</InputLabel>
              <Autocomplete
                value={appointment.payType}
                onChange={(_, val) => handleAppointmentChange('payType', val)}
                options={['Efectivo', 'Transferencia', 'Tarjeta']}
                renderInput={(p) => <TextField {...p} />}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 4 }}>
            <Stack spacing={1}>
              <InputLabel>Descuento</InputLabel>
              <TextField
                type="text"
                sx={{ '& .MuiInputBase-root': { height: 41 } }}
                value={appointment.discount || ''}
                onChange={(e) => handleAppointmentChange('discount', Number(e.target.value))}
              />
            </Stack>
          </Grid>

          <Grid item size={{ xs: 12, md: 12 }}>
            <Stack spacing={1}>
              <InputLabel>Observación</InputLabel>
              <TextField
                multiline
                minRows={3}
                placeholder="Notas, indicaciones, etc..."
                value={appointment.observation || ''}
                onChange={(e) => handleAppointmentChange('observation', e.target.value)}
              />
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onSave}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
