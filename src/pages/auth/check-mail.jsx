import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project-imports
import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import AuthWrapper2 from './sections/auth/AuthWrapper2';

// ================================|| CHECK MAIL ||================================ //

export default function CheckMail() {
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper2>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Hola, revisa tu correo</Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              Te hemos enviado las instrucciones para recuperar tu contraseña.
            </Typography>
          </Box>
        </Grid>

        <Grid size={12}>
          <AnimateButton>
            <Button
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Iniciar sesión
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
}
