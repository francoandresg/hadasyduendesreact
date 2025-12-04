import { useMemo } from 'react';

// third-party
import useSWR, { mutate } from 'swr';

// ==============================|| API - SNACKBAR ||============================== //

const endpoints = {
  key: 'snackbar'
};

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  variant: 'default',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault'
};

export function useGetSnackbar() {
  const { data } = useSWR(endpoints.key, () => initialState, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(() => ({ snackbar: data }), [data]);
  return memoizedValue;
}

export function openSnackbar(snackbar) {
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return {
        ...currentSnackbar,

        // valores principales
        action: snackbar.action ?? currentSnackbar.action,
        open: snackbar.open ?? currentSnackbar.open,
        message: snackbar.message ?? currentSnackbar.message,
        anchorOrigin: snackbar.anchorOrigin ?? currentSnackbar.anchorOrigin,
        variant: snackbar.variant ?? currentSnackbar.variant,

        // alert
        alert: {
          color: snackbar.alert?.color ?? currentSnackbar.alert.color,
          variant: snackbar.alert?.variant ?? currentSnackbar.alert.variant
        },

        // otros
        transition: snackbar.transition ?? currentSnackbar.transition,
        close: snackbar.close ?? currentSnackbar.close,
        actionButton: snackbar.actionButton ?? currentSnackbar.actionButton,

        // soporte real para iconVariant (objeto o null)
        iconVariant: snackbar.iconVariant ?? currentSnackbar.iconVariant
      };
    },
    false
  );
}

export function closeSnackbar() {
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, open: false };
    },
    false
  );
}

export function handlerIncrease(maxStack) {
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, maxStack };
    },
    false
  );
}

export function handlerDense(dense) {
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { ...currentSnackbar, dense };
    },
    false
  );
}

export function handlerIconVariants(iconVariant) {
  mutate(
    endpoints.key,
    (currentSnackbar) => {
      return { 
        ...currentSnackbar, 
        iconVariant,
        hideIconVariant: iconVariant === 'hide'
      };
    },
    false
  );
}
