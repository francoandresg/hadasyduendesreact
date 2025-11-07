import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// project-imports
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';

import Loadable from 'components/Loadable';
import PagesLayout from 'layout/Pages';
import { Navigate } from 'react-router-dom';


// ==============================|| ROUTES RENDER ||============================== //

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <PagesLayout />,
      children: [
        {
          index: true,
          element: <Navigate to="/login" replace />
        }
      ]
    },
    LoginRoutes,
    MainRoutes
  ],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME,
    future: {
      v7_startTransition: true
    }
  }
);

export default router;
