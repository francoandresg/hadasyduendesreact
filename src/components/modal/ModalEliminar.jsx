import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid } from '@mui/material';

function ModalEliminar({ open, onClose, onConfirm, fila, entity }) {
  const message = `¿Estás seguro de que deseas eliminar ${entity}: ${fila}?`;

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
          <DialogTitle>Confirmar eliminación</DialogTitle>
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
          <Button onClick={onConfirm} variant="contained" color="error">
            Confirmar
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
}

export default ModalEliminar;
