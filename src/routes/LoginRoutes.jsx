import { lazy } from 'react';

// project-imports
import Loadable from 'components/Loadable';
import AuthLayout from 'layout/Auth';

// render - login
const AuthLogin = Loadable(lazy(() => import('pages/auth/login')));

// ==============================|| AUTH ROUTES ||============================== //

const LoginRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <AuthLayout />,
      children: [
        {
          path: 'login',
          element: <AuthLogin />
        },
      ]
    }
  ]
};

export default LoginRoutes;
