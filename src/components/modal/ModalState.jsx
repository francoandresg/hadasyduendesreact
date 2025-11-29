import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Divider } from '@mui/material';

function ModalState({ open, onClose, onConfirm, fila, entity, estado }) {
  // Construir mensaje y título dinámicos según el estado
  const isActivar = estado === 0 || estado === 2; // 0 o 2 = desactivado → próxima acción = activar
  const actionText = isActivar ? 'activar' : 'desactivar';
  const title = isActivar ? 'Confirmar activación' : 'Confirmar desactivación';
  const message = `¿Estás seguro de que deseas ${actionText} ${entity}: ${fila}?`;

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
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>{title}</DialogTitle>

      <Divider />

      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>

      <Divider />

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={onConfirm}>
          Confirmar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ModalState;
