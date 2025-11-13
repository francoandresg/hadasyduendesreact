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
  FormHelperText,
  Switch
} from '@mui/material';
import { openSnackbar } from 'utils/snackbar';
import ConfirmacionDialog from '../dialog/ConfirmacionDialog';

const ModalEditar = ({ open, onClose, data, onSave, columns = [], entity, entityConfirm, modalGrid = false }) => {
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});

  // Validador de color hex (#RGB o #RRGGBB)
  const isValidHex = (value) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setForm(data);
      setErrors({});
    }
  }, [data]);

  useEffect(() => {
    if (open && data && Array.isArray(columns)) {
      setForm((prev) => {
        // partimos desde la data original (que trae 'severidad' pero no 'severidadS')
        const next = { ...data, ...prev };

        columns.forEach(({ accessorKey, valueName, type, valueType, options }) => {
          if (type !== 'select') return;

          const hasAccessor =
            next[accessorKey] !== undefined && next[accessorKey] !== null && next[accessorKey] !== '';

          // Tomamos el "raw" que pueda venir como label (valueName) o id (accessorKey) si existiese
          const raw = hasAccessor ? next[accessorKey] : (valueName ? next[valueName] : undefined);

          if (raw === undefined || raw === null || raw === '') return;

          if (valueType === 'label') {
            // raw podría ser label o id; normalizamos a id (lo que guardamos en form)
            const match = options?.find((opt) => opt.label === raw || opt.id === raw);
            if (match) next[accessorKey] = match.id;
          } else {
            // valueType === 'id' → guardamos tal cual
            next[accessorKey] = raw;
          }
        });

        return next;
      });
    }
  }, [open, data, columns]);

  useEffect(() => {
    if (!open) {
      setForm({});
      setErrors({});
    }
  }, [open]);

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
    columns.forEach(({ header, accessorKey, type, required, actions, editar }) => {
      const value = form[accessorKey];
      
      if(editar == 1 && (actions == 1 || actions == 0)){

        if (required == 1 && type !== 'boolean' && (value === '' || value === null || value === undefined)) {
          newErrors[accessorKey] = 'Este campo es obligatorio';
        }
      }
      // Formato de color
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
    columns.forEach(({ accessorKey, valueName, type, valueType, options, actions, editar }) => {
      if (editar == 1 && (actions == 1 || actions == 0)) {
        let value = form[accessorKey];

        if (type === 'select') {
          const selected = options.find(
            (opt) => opt.id === value || opt.label === value
          );
          if (selected) {
            value = selected.id; 
          }
        }

        if (type === 'int') {
          value = value === '' ? null : parseInt(value, 10);
        }

        if (type === 'float') {
          if (typeof value === 'string') {
            value = value.replace(',', '.');
          }
          value = value === '' ? null : parseFloat(value);
        }

        if (value === undefined || value === '' || value === null) {
          value = '';
        }

        transformedForm[String(valueName || accessorKey)] = value;
      }
    });

    onSave(transformedForm);
  };

return (
  <>
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={modalGrid ? "md" : "sm"}
    >
      {/* Header */}
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: "1px solid rgba(158, 159, 160, 0.33);" }}
      >
        <Grid item>
          <DialogTitle>Editar {entity}</DialogTitle>
        </Grid>
      </Grid>

      {/* Body */}
      <DialogContent>
        {modalGrid ? (
          <Grid container spacing={2} mt={1}>
            {columns.map(
              ({
                accessorKey,
                valueName,
                header,
                type,
                options,
                valueType,
                actions,
                editar,
              }) => {
                if (actions == 1 && editar == 1) {
                  const rawValue = form[accessorKey] ?? form[valueName];
                  let value = rawValue ?? "";

                  if (type === "select" && valueType === "id") {
                    const match = options.find((opt) => opt.id === rawValue);
                    value = match?.id ?? "";
                  }

                  if (type === "select" && valueType === "label") {
                    const match = options.find(
                      (opt) => opt.label === rawValue || opt.id === rawValue
                    );
                    value = match?.id ?? "";
                  }

                  switch (type) {
                    case "select":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <TextField
                            select
                            label={header}
                            name={accessorKey}
                            value={value}
                            onChange={(e) => {
                              const { name, value } = e.target;
                              handleChange({
                                target: { name, value, type: "text" },
                              });
                            }}
                            fullWidth
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                            InputLabelProps={{ style: { lineHeight: "16px" } }}
                          >
                            {options.map((opt) => (
                              <MenuItem key={opt.id} value={opt.id}>
                                {opt.label}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      );

                    case "boolean":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
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
                          {errors[accessorKey] && (
                            <FormHelperText error>
                              {errors[accessorKey]}
                            </FormHelperText>
                          )}
                        </Grid>
                      );

                    case "date":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <TextField
                            label={header}
                            name={accessorKey}
                            type="date"
                            value={value}
                            onChange={handleChange}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                          />
                        </Grid>
                      );

                    case "color":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "6px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <TextField
                                variant="outlined"
                                size="small"
                                label={header}
                                value={form[accessorKey] || "#000000"}
                                onChange={handleChange}
                                name={accessorKey}
                                fullWidth
                                error={!!errors[accessorKey]}
                                helperText={errors[accessorKey]}
                              />
                              <input
                                type="color"
                                value={form[accessorKey] || "#000000"}
                                onChange={handleChange}
                                name={accessorKey}
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  border: "none",
                                  padding: 0,
                                  cursor: "pointer",
                                  borderRadius: "4px",
                                }}
                              />
                            </div>
                          </div>
                        </Grid>
                      );

                    case "textarea":
                      return (
                        <Grid item xs={12} key={accessorKey}>
                          <TextField
                            label={header}
                            name={accessorKey}
                            value={value}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                            multiline
                            minRows={4}
                            maxRows={8}
                            InputLabelProps={{
                              style: { lineHeight: "16px" },
                            }}
                          />
                        </Grid>
                      );

                    case "blocked":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <TextField
                            label={header}
                            name={accessorKey}
                            value={value}
                            fullWidth
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                            InputLabelProps={{ style: { lineHeight: "16px" } }}
                            disabled
                          />
                        </Grid>
                      );

                    case "int":
                    case "float":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <TextField
                            label={header}
                            name={accessorKey}
                            type="number"
                            value={value}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.key === ",") e.preventDefault();
                            }}
                            fullWidth
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                          />
                        </Grid>
                      );

                    case "switch":
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <FormControlLabel
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
                        </Grid>
                      );

                    default:
                      return (
                        <Grid item xs={12} sm={4} key={accessorKey}>
                          <TextField
                            label={header}
                            name={accessorKey}
                            value={value}
                            onChange={handleChange}
                            fullWidth
                            error={!!errors[accessorKey]}
                            helperText={errors[accessorKey]}
                            InputLabelProps={{
                              style: { lineHeight: "16px" },
                            }}
                          />
                        </Grid>
                      );
                  }
                }
              }
            )}
          </Grid>
        ) : (
          <Stack spacing={2} mt={1}>
            {columns.map(
              ({
                accessorKey,
                valueName,
                header,
                type,
                options,
                valueType,
                actions,
                editar,
              }) => {
                if (actions == 1 && editar == 1) {
                  const rawValue = form[accessorKey] ?? form[valueName];
                  let value = rawValue ?? "";

                  if (type === "select" && valueType === "id") {
                    const match = options.find((opt) => opt.id === rawValue);
                    value = match?.id ?? "";
                  }

                  if (type === "select" && valueType === "label") {
                    const match = options.find(
                      (opt) => opt.label === rawValue || opt.id === rawValue
                    );
                    value = match?.id ?? "";
                  }

                  switch (type) {
                    case "select":
                      return (
                        <TextField
                          key={accessorKey}
                          select
                          label={header}
                          name={accessorKey}
                          value={value}
                          onChange={(e) => {
                            const { name, value } = e.target;
                            handleChange({
                              target: { name, value, type: "text" },
                            });
                          }}
                          fullWidth
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                          InputLabelProps={{ style: { lineHeight: "16px" } }}
                        >
                          {options.map((opt) => (
                            <MenuItem key={opt.id} value={opt.id}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      );

                    case "boolean":
                      return (
                        <div key={accessorKey}>
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
                          {errors[accessorKey] && (
                            <FormHelperText error>
                              {errors[accessorKey]}
                            </FormHelperText>
                          )}
                        </div>
                      );

                    case "date":
                      return (
                        <TextField
                          key={accessorKey}
                          label={header}
                          name={accessorKey}
                          type="date"
                          value={value}
                          onChange={handleChange}
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                        />
                      );

                    case "color":
                      return (
                        <div
                          key={accessorKey}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <TextField
                              variant="outlined"
                              size="small"
                              label={header}
                              value={form[accessorKey] || "#000000"}
                              onChange={handleChange}
                              name={accessorKey}
                              fullWidth
                              error={!!errors[accessorKey]}
                              helperText={errors[accessorKey]}
                            />
                            <input
                              type="color"
                              value={form[accessorKey] || "#000000"}
                              onChange={handleChange}
                              name={accessorKey}
                              style={{
                                width: "40px",
                                height: "40px",
                                border: "none",
                                padding: 0,
                                cursor: "pointer",
                                borderRadius: "4px",
                              }}
                            />
                          </div>
                        </div>
                      );

                    case "textarea":
                      return (
                        <TextField
                          key={accessorKey}
                          label={header}
                          name={accessorKey}
                          value={value}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                          multiline
                          minRows={4}
                          maxRows={8}
                          InputLabelProps={{
                            style: { lineHeight: "16px" },
                          }}
                        />
                      );

                    case "blocked":
                      return (
                        <TextField
                          key={accessorKey}
                          label={header}
                          name={accessorKey}
                          value={value}
                          fullWidth
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                          InputLabelProps={{ style: { lineHeight: "16px" } }}
                          disabled
                        />
                      );

                    case "int":
                    case "float":
                      return (
                        <TextField
                          key={accessorKey}
                          label={header}
                          name={accessorKey}
                          type="number"
                          value={value}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === ",") e.preventDefault();
                          }}
                          fullWidth
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                        />
                      );

                    case "switch":
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
                            />
                          }
                          label={header}
                        />
                      );

                    default:
                      return (
                        <TextField
                          key={accessorKey}
                          label={header}
                          name={accessorKey}
                          value={value}
                          onChange={handleChange}
                          fullWidth
                          error={!!errors[accessorKey]}
                          helperText={errors[accessorKey]}
                          InputLabelProps={{
                            style: { lineHeight: "16px" },
                          }}
                        />
                      );
                  }
                }
              }
            )}
          </Stack>
        )}
      </DialogContent>

      {/* Footer */}
      <Grid sx={{ borderTop: "1px solid rgba(158, 159, 160, 0.33);" }}>
        <DialogActions sx={{ padding: "15px" }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color="warning">
            Guardar
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>

    <ConfirmacionDialog
      open={confirmOpen}
      onClose={() => setConfirmOpen(false)}
      onConfirm={handleConfirmSave}
      title={`Confirmar edición`}
      content={`¿Estás seguro que deseas guardar los cambios en ${entityConfirm}?`}
      color="warning"
    />
  </>
);

};

export default ModalEditar;
