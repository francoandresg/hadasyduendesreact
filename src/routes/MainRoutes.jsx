import { lazy } from 'react';

import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

// render - dashboard
const WidgetDashboard = Loadable(lazy(() => import('pages/dashboard')));

// render - managers
const WidgetApointments = Loadable(lazy(() => import('pages/managers/appointments')));

// render - maintainers
const WidgetBoxes = Loadable(lazy(() => import('pages/maintainers/boxes')));
const WidgetServicesType = Loadable(lazy(() => import('pages/maintainers/servicesType')));
const WidgetServices = Loadable(lazy(() => import('pages/maintainers/services')));
const WidgetMaterials = Loadable(lazy(() => import('pages/maintainers/materials')));
const WidgetClients = Loadable(lazy(() => import('pages/maintainers/clients')));
const WidgetUsers = Loadable(lazy(() => import('pages/maintainers/users')));

const WidgetConfiguration = Loadable(lazy(() => import('pages/settings/configuration')));

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
              path: 'services-type',
              element: <WidgetServicesType />
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
              path: 'users',
              element: <WidgetUsers />
            }
          ]
        },
        {
          path: 'settings',
          element: <WidgetConfiguration />
        }
      ]
    }
  ]
};

export default MainRoutes;
