import { useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

// third-party
import { Formik } from 'formik';
import * as Yup from 'yup';

// project-imports
import { openSnackbar } from 'api/snackbar';
import AnimateButton from 'components/@extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

export default function AuthForgotPassword() {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn, forgotPassword } = useAuth();

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string().email('Debe ser un correo válido').max(255).required('Correo es requerido')
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            const response = await forgotPassword(values.email);

            if (!scriptedRef.current) return;

            setStatus({ success: response.success });

            if (response.success) {
              openSnackbar({
                open: true,
                message: response.message || 'Correo enviado correctamente. Por favor, revisa tu bandeja de entrada.',
                variant: 'alert',
                alert: { color: 'success', variant: 'outlined' },
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                close: true
              });

              setTimeout(() => {
                navigate(isLoggedIn ? '/auth/check-mail' : '/check-mail', { replace: true });
              }, 2500);
            } else {
              openSnackbar({
                open: true,
                message: response.message || 'El correo no se encuentra registrado.',
                variant: 'alert',
                alert: { color: 'error', variant: 'outlined' },
                anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                close: true
              });
            }
          } catch (err) {
            console.error(err);

            if (!scriptedRef.current) return;

            setStatus({ success: false });
            setErrors({ submit: err.message });
          } finally {
            // Solo aquí, así no lo duplicas
            if (scriptedRef.current) {
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-forgot">Correo</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Ingrese su correo electrónico"
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-forgot">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid sx={{ mb: -2 }} size={12}>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="end">
                  <Typography
                    component={Link}
                    to={isLoggedIn ? '/auth/login' : '/login'}
                    variant="body1"
                    sx={{ textDecoration: 'none' }}
                    color="primary"
                  >
                    Volver al inicio de sesión
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                    sx={{ textTransform: 'none' }}
                  >
                    Enviar correo de recuperación
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
