import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Grid, Divider } from '@mui/material';

function ModalDelete({ open, onClose, onConfirm, fila, entity }) {
  const message = `¿Estás seguro de que deseas eliminar ${entity}: ${fila}?`;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      BackdropProps={{
        sx: {
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(6px)'
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>Confirmar eliminación</DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <Divider />
      <DialogActions>
        <Button onClick={onClose} color='inherit'>Cancelar</Button>
        <Button variant="contained" color='error' onClick={onConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalDelete;
