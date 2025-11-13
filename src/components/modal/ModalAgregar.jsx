import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Grid,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Switch 
} from '@mui/material';
import { openSnackbar } from 'utils/snackbar';
import ConfirmacionDialog from '../dialog/ConfirmacionDialog';

const ModalAgregar = ({ open, onClose, onSave, columns = [], entity, entityConfirm, modalGrid = false }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // Validador de color hex (#RGB o #RRGGBB)
  const isValidHex = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

  const [confirmOpen, setConfirmOpen] = useState(false);

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

  const validateFields = () => {
    const newErrors = {};

    columns.forEach(({ accessorKey, type, required, actions, crear }) => {
      if (actions !== 1 || crear !== 1) return;

      const value = form[accessorKey];

      // Validación de obligatorio
      if (required == 1 && (value === '' || value === null || value === undefined)) {
        newErrors[accessorKey] = 'Este campo es obligatorio';
      }

      // Validaciones específicas
      if (type === 'imei') {
        if (!/^\d{15}$/.test(value || '')) {
          newErrors[accessorKey] = 'El IMEI debe tener exactamente 15 dígitos';
        }
      }

      if (type === 'color' && value) {
        if (!isValidHex(value)) {
          newErrors[accessorKey] = 'Debe ser un color hexadecimal válido (#RRGGBB o #RGB)';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateFields()) {
      openSnackbar({
        open: true,
        message: 'Por favor completa todos los campos obligatorios.',
        variant: 'alert',
        alert: {
          color: 'error',
          variant: 'outlined'
        },
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

    columns.forEach(({ accessorKey, valueName, type, valueType, options, actions, crear }) => {
      if (actions == 1 && crear == 1) {
        let value = form[accessorKey];

        // Select
        if (type === 'select') {
          const selected = options.find((opt) =>
            valueType === 'label'
              ? opt.label === value || opt.id === value
              : opt.id === value
          );
          if (selected) value = selected.id;
        }

        // Boolean/Switch → 0/1
        if (type === 'boolean' || type === 'switch') {
          value = value ? 1 : 0;
        }

        // Int
        if (type === 'int') {
          value = value === '' ? null : parseInt(value, 10);
        }

        // Float
        if (type === 'float') {
          if (typeof value === 'string') {
            value = value.replace(',', '.');
          }
          value = value === '' ? null : parseFloat(value);
        }

        // Color → si está vacío, asignar negro por defecto
        if (type === 'color' && (!value || value === '')) {
          value = '#000000';
        }

        // IMEI → mantener vacío si no hay valor
        if (type === 'imei' && (!value || value === '')) {
          value = '';
        }

        transformedForm[String(valueName || accessorKey)] = value;
      }
    });

    onSave(transformedForm);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth={modalGrid ? "md" : "sm"}>
        <Grid
          container
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          sx={{ borderBottom: '1px solid rgba(158, 159, 160, 0.33);' }}
        >
          <Grid item>
            <DialogTitle>Agregar {entity}</DialogTitle>
          </Grid>
        </Grid>
        <DialogContent>
  {modalGrid ? (
    <Grid container spacing={2} mt={1}>
      {columns.map(({ accessorKey, header, type, options, valueType, actions, crear }, index) => {
        if (actions == 1 && crear == 1) {
          const fieldValue = form[accessorKey] ?? '';

          const renderField = () => {
            switch (type) {
              case 'select':
                return (
                  <TextField
                    select
                    label={header}
                    name={accessorKey}
                    value={
                      valueType === 'label'
                        ? (options.find((opt) => opt.label === form[accessorKey])?.id ?? '')
                        : (form[accessorKey] ?? '')
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                      if (valueType === 'label') {
                        const selectedOption = options.find((opt) => opt.id === value);
                        handleChange({
                          target: {
                            name: accessorKey,
                            value: selectedOption?.label || '',
                            type: 'text'
                          }
                        });
                      } else {
                        handleChange({
                          target: {
                            name: accessorKey,
                            value,
                            type: 'text'
                          }
                        });
                      }
                    }}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                    InputLabelProps={{
                      style: { lineHeight: '16px' }
                    }}
                  >
                    {options.map((opt) => (
                      <MenuItem key={opt.id} value={opt.id}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              case 'boolean':
                return (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={!!form[accessorKey]}
                        onChange={handleChange}
                        name={accessorKey}
                      />
                    }
                    label={header}
                  />
                );
              case 'date':
                return (
                  <TextField
                    label={header}
                    name={accessorKey}
                    type="date"
                    value={fieldValue}
                    onChange={handleChange}
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                  />
                );
              case 'color':
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <TextField
                        variant="outlined"
                        size="small"
                        label={header}
                        value={form[accessorKey] || '#000000'}
                        onChange={handleChange}
                        name={accessorKey}
                        fullWidth
                        error={!!errors[accessorKey]}
                        helperText={errors[accessorKey]}
                      />
                      <input
                        type="color"
                        value={form[accessorKey] || '#000000'}
                        onChange={handleChange}
                        name={accessorKey}
                        style={{
                          width: '40px',
                          height: '40px',
                          border: 'none',
                          padding: 0,
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                  </div>
                );
              case 'textarea':
                return (
                  <TextField
                    label={header}
                    name={accessorKey}
                    value={fieldValue}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                    multiline
                    minRows={4}
                    maxRows={8}
                    InputLabelProps={{
                      style: { lineHeight: '16px' }
                    }}
                  />
                );
              case 'switch':
                return (
                  <FormControlLabel
                    key={accessorKey}
                    control={
                      <Switch
                        checked={!!form[accessorKey]}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            [accessorKey]: e.target.checked,
                          }))
                        }
                        name={accessorKey}
                        color="primary"
                        sx={{ ml: 2 }} 
                      />
                    }
                    label={header}
                  />
                );
              case 'imei':
                return (
                  <TextField
                    key={accessorKey}
                    label={header}
                    value={form[accessorKey] || ''}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, '');
                      handleChange({ target: { name: accessorKey, value: onlyNums } });
                    }}
                    inputProps={{
                      maxLength: 15,
                      inputMode: 'numeric',
                      pattern: '[0-9]{15}',
                    }}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                  />
                );
              case 'int':
              case 'float':
                return (
                  <TextField
                    key={accessorKey}
                    label={header}
                    name={accessorKey}
                    type="number"
                    value={fieldValue}   // 🔹 corregido
                    onChange={handleChange}
                    onKeyDown={(e) => {
                      if (e.key === ',') e.preventDefault();
                    }}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                  />
                );
              default:
                return (
                  <TextField
                    label={header}
                    name={accessorKey}
                    value={fieldValue}
                    onChange={handleChange}
                    fullWidth
                    error={!!errors[accessorKey]}
                    helperText={errors[accessorKey]}
                    InputLabelProps={{
                      style: { lineHeight: '16px' }
                    }}
                  />
                );
            }
          };

          return (
            <Grid item xs={12} sm={4} key={accessorKey}>
              {renderField()}
            </Grid>
          );
        }
        return null;
      })}
    </Grid>
  ) : (
    <Stack spacing={2} mt={1}>
      {columns.map(({ accessorKey, header, type, options, valueType, actions, crear }) => { 
        if (actions == 1 && crear == 1) { 
          const fieldValue = form[accessorKey] ?? ''; 
          switch (type) { 
            case 'select': return ( 
              <TextField key={accessorKey} select label={header} name={accessorKey} value={ valueType === 'label' ? (options.find((opt) => opt.label === form[accessorKey])?.id ?? '') : (form[accessorKey] ?? '') } onChange={(e) => { const { value } = e.target; if (valueType === 'label') { const selectedOption = options.find((opt) => opt.id === value); handleChange({ target: { name: accessorKey, value: selectedOption?.label || '', type: 'text' } }); } else { handleChange({ target: { name: accessorKey, value, type: 'text' } }); } }} fullWidth error={!!errors[accessorKey]} helperText={errors[accessorKey]} InputLabelProps={{ style: { lineHeight: '16px' } }} > {options.map((opt) => ( <MenuItem key={opt.id} value={opt.id}> {opt.label} </MenuItem> ))} </TextField> ); 
            case 'boolean': return ( <FormControlLabel key={accessorKey} control={<Checkbox checked={!!form[accessorKey]} onChange={handleChange} name={accessorKey} />} label={header} /> ); 
            case 'date': return ( <TextField key={accessorKey} label={header} name={accessorKey} type="date" value={fieldValue} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} error={!!errors[accessorKey]} helperText={errors[accessorKey]} /> ); 
            case 'color': return ( <div key={accessorKey} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}> <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}> <TextField variant="outlined" size="small" label={header} value={form[accessorKey] || '#000000'} onChange={handleChange} name={accessorKey} fullWidth error={!!errors[accessorKey]} helperText={errors[accessorKey]} /> <input type="color" value={form[accessorKey] || '#000000'} onChange={handleChange} name={accessorKey} style={{ width: '40px', height: '40px', border: 'none', padding: 0, cursor: 'pointer', borderRadius: '4px' }} /> </div> </div> ); 
            case 'textarea': return ( <TextField key={accessorKey} label={header} name={accessorKey} value={fieldValue} onChange={handleChange} fullWidth error={!!errors[accessorKey]} helperText={errors[accessorKey]} multiline minRows={4} maxRows={8} InputLabelProps={{ style: { lineHeight: '16px' } }} /> ); 
            case 'switch': return ( <FormControlLabel key={accessorKey} control={<Switch checked={!!form[accessorKey]} onChange={(e) => setForm((prev) => ({ ...prev, [accessorKey]: e.target.checked }))} name={accessorKey} color="primary" />} label={header} /> ); 
            default: return ( <TextField key={accessorKey} label={header} name={accessorKey} value={fieldValue} onChange={handleChange} fullWidth error={!!errors[accessorKey]} helperText={errors[accessorKey]} InputLabelProps={{ style: { lineHeight: '16px' } }} /> ); 
          } 
        } 
      })}
    </Stack>
  )}
</DialogContent>

        <Grid sx={{ borderTop: '1px solid rgba(158, 159, 160, 0.33);' }}>
          <DialogActions sx={{ padding: '15px' }}>
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Grid>
      </Dialog>

      <ConfirmacionDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmSave}
        title={`Confirmar agregado`}
        content={`¿Estás seguro que deseas agregar ${entityConfirm}?`}
        color="primary"
      />
    </>
  );
};

export default ModalAgregar;