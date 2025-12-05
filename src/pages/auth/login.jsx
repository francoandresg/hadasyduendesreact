import { Link } from 'react-router-dom';

// material-ui
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project-imports
import Logo from 'components/logo';
import useAuth from 'hooks/useAuth';
import AuthWrapper2 from './sections/auth/AuthWrapper2';
import AuthLogin from './sections/auth/auth-forms/AuthLogin';

// ================================|| LOGIN ||================================ //

export default function Login2() {
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper2>
      <Grid container spacing={2}>
        <Grid sx={{ textAlign: 'center' }} size={12}>
          <Logo />
        </Grid>
        <Grid size={12} sx={{display:'flex', justifyContent:'center'}}>
          <Typography variant="caption" color='text.secondary' fontWeight={100} fontSize={14}>Ingrese su usuario y contraseña para iniciar sesión</Typography>
        </Grid>
        <Grid size={12}>
          <AuthLogin forgot="/auth/forgot-password2" />
        </Grid>
      </Grid>
    </AuthWrapper2>
  );
}
