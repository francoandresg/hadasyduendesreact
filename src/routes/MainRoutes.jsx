import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard
const WidgetDashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - managers
const WidgetApointments = Loadable(lazy(() => import('pages/managers/appointments')));

// render - maintainers
const WidgetBoxes = Loadable(lazy(() => import('pages/maintainers/boxes')));
const WidgetProfesionals = Loadable(lazy(() => import('pages/maintainers/profesionals')));
const WidgetServices = Loadable(lazy(() => import('pages/maintainers/services')));
const WidgetMaterials = Loadable(lazy(() => import('pages/maintainers/materials')));
const WidgetClients = Loadable(lazy(() => import('pages/maintainers/clients')));
const WidgetRoles = Loadable(lazy(() => import('pages/maintainers/roles')));
const WidgetUsers = Loadable(lazy(() => import('pages/maintainers/users')));



const MainRoutes = {
  path: '/',
  children: [
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        {
          path: 'dashboard',
          element: <WidgetDashboard />
        },
        {
          path: 'managers',
          children: [
            {
              path: 'appointments',
              element: <WidgetApointments />
            }
          ]
        },
        {
          path: 'maintainers',
          children: [
            {
              path: 'boxes',
              element: <WidgetBoxes />
            },
            {
              path: 'profesionals',
              element: <WidgetProfesionals />
            },
            {
              path: 'services',
              element: <WidgetServices />
            },
            {
              path: 'materials',
              element: <WidgetMaterials />
            },
            {
              path: 'clients',
              element: <WidgetClients />
            },
            {
              path: 'roles',
              element: <WidgetRoles />
            },
            {
              path: 'users',
              element: <WidgetUsers />
            }
          ]
        }
      ]
    }
  ]
};

export default MainRoutes;
