import useSWR, { mutate } from 'swr';

export const endpoints = {
  key: 'snackbar'
};

const initialState = {
  action: false,
  open: false,
  message: '',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  variant: 'default', // 'default' o 'alert'
  alert: {
    color: 'primary', // color para Alert: 'success', 'error', 'warning', 'info', 'primary', etc.
    variant: 'filled' // 'filled', 'outlined', 'standard'
  },
  transition: 'Fade', // puede ser 'SlideLeft', 'SlideRight', 'SlideUp', 'SlideDown', 'Grow', 'Fade'
  close: false, // si mostrar botón cerrar
  actionButton: false, // si mostrar botón acción tipo UNDO (opcional)
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault',
  autoHideDuration: 5000 // duración en ms que durará visible el snackbar
};

// Hook para obtener el estado del snackbar
export function useGetSnackbar() {
  const { data } = useSWR(endpoints.key, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  return { snackbar: data || initialState };
}

// Función para abrir snackbar
export function openSnackbar(snackbar = {}) {
  mutate(
    endpoints.key,
    (currentSnackbar) => ({
      ...currentSnackbar,
      ...snackbar,
      open: snackbar.open !== undefined ? snackbar.open : true, // abrir por defecto si no se pasa open
      message: snackbar.message || currentSnackbar.message || '',
      autoHideDuration: snackbar.autoHideDuration ?? currentSnackbar.autoHideDuration ?? initialState.autoHideDuration,
      alert: {
        ...currentSnackbar?.alert,
        ...(snackbar.alert || {})
      },
      anchorOrigin: snackbar.anchorOrigin || currentSnackbar.anchorOrigin || initialState.anchorOrigin,
      variant: snackbar.variant || currentSnackbar.variant || initialState.variant,
      transition: snackbar.transition || currentSnackbar.transition || initialState.transition,
      close: snackbar.close !== undefined ? snackbar.close : currentSnackbar.close,
      actionButton: snackbar.actionButton !== undefined ? snackbar.actionButton : currentSnackbar.actionButton,
      maxStack: snackbar.maxStack || currentSnackbar.maxStack,
      dense: snackbar.dense !== undefined ? snackbar.dense : currentSnackbar.dense,
      iconVariant: snackbar.iconVariant || currentSnackbar.iconVariant
    }),
    false
  );
}

// Función para cerrar snackbar
export function closeSnackbar() {
  mutate(
    endpoints.key,
    (currentSnackbar) => ({
      ...currentSnackbar,
      open: false
    }),
    false
  );
}

// Funciones extra que tienes para modificar propiedades específicas
export function handlerIncrease(maxStack) {
  mutate(
    endpoints.key,
    (currentSnackbar) => ({
      ...currentSnackbar,
      maxStack
    }),
    false
  );
}

export function handlerDense(dense) {
  mutate(
    endpoints.key,
    (currentSnackbar) => ({
      ...currentSnackbar,
      dense
    }),
    false
  );
}

export function handlerIconVariants(iconVariant) {
  mutate(
    endpoints.key,
    (currentSnackbar) => ({
      ...currentSnackbar,
      iconVariant
    }),
    false
  );
}