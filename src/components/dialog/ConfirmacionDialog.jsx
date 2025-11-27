import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';

const ConfirmacionDialog = ({ open, onClose, onConfirm, title, content, color }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
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
        <Typography>{content}</Typography>
      </DialogContent>
      <Grid sx={{ borderTop: '1px solid rgba(158, 159, 160, 0.33);' }}>
        <DialogActions sx={{ padding: '15px' }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button onClick={onConfirm} color={color || 'primary'}>
            Confirmar
          </Button>
        </DialogActions>
      </Grid>
    </Dialog>
  );
};

export default ConfirmacionDialog;
