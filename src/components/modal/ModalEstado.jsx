import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid } from '@mui/material';

function ModalEstado({ open, onClose, onConfirm, fila, entity, estado }) {
  // Construir mensaje y título dinámicos según el estado
  const isActivar = estado === 0 || estado === 2;  // 0 o 2 = desactivado → próxima acción = activar
  const actionText = isActivar ? 'activar' : 'desactivar';
  const colorButton = isActivar ? 'success' : 'error';
  const title = isActivar ? 'Confirmar activación' : 'Confirmar desactivación';
  const message = `¿Estás seguro de que deseas ${actionText} ${entity}: ${fila}?`;

  return (
    <Dialog open={open} onClose={onClose}>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ borderBottom: '1px solid rgba(158, 159, 160, 0.33);' }}
      >
        <Grid item>
          <DialogTitle>{title}</DialogTitle>
        </Grid>
      </Grid>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <Grid sx={{ borderTop: '1px solid rgba(158, 159, 160, 0.33);' }}>
        <DialogActions sx={{ padding: '15px' }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={onConfirm} variant="contained" color={colorButton}>
            Confirmar
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
}

export default ModalEstado;
