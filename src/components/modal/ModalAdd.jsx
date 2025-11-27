import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch,
  Divider,
  Autocomplete,
  Grid
} from '@mui/material';
import { openSnackbar } from 'utils/snackbar';
import ConfirmDialog from '../dialog/ConfirmDialog';
import DatePicker from '../date/datepicker';

const ModalAdd = ({ open, onClose, onSave, columns = [], entity, entityConfirm, modalGrid = 'md' }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isValidHex = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

  // Inicializa formulario
  useEffect(() => {
    if (open) {
      const initialForm = {};
      columns.forEach(({ accessorKey, type }) => {
        if (type === 'boolean' || type === 'switch') {
          initialForm[accessorKey] = false;
        } else {
          initialForm[accessorKey] = '';
        }
      });
      setForm(initialForm);
      setErrors({});
    }
  }, [open, columns]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: null
    }));
  };

  // Validaciones
  const validateFields = () => {
    const newErrors = {};

    columns.forEach(({ accessorKey, type, required, visible }) => {
      if (visible == 0 && required == 0) return;

      const value = form[accessorKey];

      if (required == 1 && (value === '' || value === null || value === undefined)) {
        newErrors[accessorKey] = 'Este campo es obligatorio';
      }

      if (type === 'color' && value) {
        if (!isValidHex(value)) newErrors[accessorKey] = 'Debe ser un color hexadecimal válido';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      openSnackbar({
        open: true,
        message: 'Por favor completa los campos obligatorios.',
        variant: 'alert',
        alert: { color: 'error', variant: 'outlined' },
        close: true,
        transition: 'SlideRight',
        anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
        autoHideDuration: 5000
      });
      return;
    }
    setConfirmOpen(true);
  };

  const handleConfirmSave = () => {
    setConfirmOpen(false);

    const transformedForm = {};

    columns.forEach(({ accessorKey, valueName, type, valueType, options, visible }) => {
      if (visible == 0) return;

      let value = form[accessorKey];

      // Autocomplete/select
      if (type === 'select' || type === 'autocomplete') {
        const selected = options.find((opt) => (valueType === 'label' ? opt.label === value || opt.id === value : opt.id === value));
        if (selected) value = selected.id;
      }

      if (type === 'boolean' || type === 'switch') value = value ? 1 : 0;

      if (type === 'int') value = value === '' ? null : parseInt(value, 10);

      if (type === 'float') {
        if (typeof value === 'string') value = value.replace(',', '.');
        value = value === '' ? null : parseFloat(value);
      }

      if (type === 'color' && (!value || value === '')) value = '#000000';

      if (type === 'imei' && (!value || value === '')) value = '';

      transformedForm[valueName || accessorKey] = value;
    });

    onSave(transformedForm);
  };

  // ----------- RENDER DE CAMPOS -------------
  const renderField = (col) => {
    const { accessorKey, label, header, type, options, visible, size } = col;

    if (visible == 0) return null;

    const fieldValue = form[accessorKey] ?? '';

    const gridSize = size || { xs: 12 };

    return (
      <Grid key={accessorKey} item size={gridSize}>
        {(() => {
          switch (type) {
            // ---------------- AUTOCOMPLETE (SELECT PRO) ----------------
            case 'autocomplete':
            case 'select':
              return (
                <Autocomplete
                  value={
                    options.find((opt) => (valueType === 'label' ? opt.label === form[accessorKey] : opt.id === form[accessorKey])) || null
                  }
                  onChange={(_, val) => {
                    if (!val) {
                      handleChange({ target: { name: accessorKey, value: '', type: 'text' } });
                      return;
                    }
                    const newValue = valueType === 'label' ? val.label : val.id;
                    handleChange({ target: { name: accessorKey, value: newValue, type: 'text' } });
                  }}
                  options={options}
                  getOptionLabel={(o) => o.label || ''}
                  renderInput={(params) => (
                    <TextField {...params} label={label} fullWidth error={!!errors[accessorKey]} helperText={errors[accessorKey]} />
                  )}
                />
              );

            // ---------------- BOOLEAN ----------------
            case 'boolean':
              return (
                <FormControlLabel
                  control={<Checkbox checked={!!form[accessorKey]} onChange={handleChange} name={accessorKey} />}
                  label={header}
                />
              );

            // ---------------- SWITCH ----------------
            case 'switch':
              return (
                <FormControlLabel
                  control={
                    <Switch
                      checked={!!form[accessorKey]}
                      onChange={(e) => setForm((prev) => ({ ...prev, [accessorKey]: e.target.checked }))}
                      name={accessorKey}
                      color="primary"
                    />
                  }
                  label={label}
                />
              );

            // ---------------- DATE ----------------
            case 'date':
              return (
                <DatePicker
                  value={fieldValue || null}
                  onChange={(v) => handleChange({ target: { name: accessorKey, value: v, type: 'text' } })}
                  error={!!errors[accessorKey]}
                  helperText={errors[accessorKey]}
                  label={label}
                />
              );

            // ---------------- COLOR ----------------
            case 'color':
              return (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <TextField
                    label={label}
                    name={accessorKey}
                    value={form[accessorKey] || '#000000'}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                  />
                  <input
                    type="color"
                    name={accessorKey}
                    value={form[accessorKey] || '#000000'}
                    onChange={handleChange}
                    style={{
                      width: '46px',
                      height: '46px',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '6px'
                    }}
                  />
                </div>
              );

            // ---------------- TEXTAREA ----------------
            case 'textarea':
              return (
                <TextField
                  label={label}
                  name={accessorKey}
                  value={fieldValue}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={4}
                  error={!!errors[accessorKey]}
                  helperText={errors[accessorKey]}
                />
              );

            // ---------------- DEFAULT INPUT ----------------
            default:
              return (
                <TextField
                  label={label}
                  name={accessorKey}
                  value={fieldValue}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors[accessorKey]}
                  helperText={errors[accessorKey]}
                />
              );
          }
        })()}
      </Grid>
    );
  };

  // ----------------------------------------------------------------

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth={modalGrid}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(6px)'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Agregar {entity}</DialogTitle>

        <Divider />

        <DialogContent>
          <Grid container spacing={2}>
            {columns.map((col) => renderField(col))}
          </Grid>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title="Confirmar agregado"
        content={`¿Estás seguro que deseas agregar ${entityConfirm}?`}
        color="primary"
      />
    </>
  );
};

export default ModalAdd;
