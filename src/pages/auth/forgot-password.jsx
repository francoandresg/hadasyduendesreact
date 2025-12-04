import { Link } from 'react-router-dom';
import { useState } from 'react';
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

// project-imports
import useAuth from 'hooks/useAuth';
import AuthWrapper2 from './sections/auth/AuthWrapper2';
import AuthForgotPassword from './sections/auth/auth-forms/AuthForgotPassword';

// ================================|| FORGOT PASSWORD ||================================ //

export default function ForgotPassword() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(true);

  return (
    <AuthWrapper2>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack spacing={2} alignItems="center">
            <Typography variant="h3">¿Olvidaste tu contraseña?</Typography>
          </Stack>
          <Stack sx={{ mt: 1 }} alignItems="center" justifyContent="center">
            <Typography variant="caption" color="text.secondary" fontWeight={100} fontSize={14} textAlign="center">
              Ingrese su correo para recibir un enlace de restablecimiento de contraseña
            </Typography>
          </Stack>
          {open && (
            <Alert severity="info" onClose={() => setOpen(false)} sx={{ mt: 2 }}>
              Si no ves el correo, revisa la carpeta de SPAM.
            </Alert>
          )}
        </Grid>
        <Grid size={12}>
          <AuthForgotPassword />
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
}
