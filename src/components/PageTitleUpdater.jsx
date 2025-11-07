// components/PageTitleUpdater.js
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import useAuth from 'hooks/useAuth';

const PageTitleUpdater = () => {
  const { user } = useAuth();
  const location = useLocation();
  const intl = useIntl();

  const routeTitles = useMemo(() => {
    const staticTitles = {
      '/login': 'Inicio Sesión',
      '/dashboard': 'Dashboard',
      '/managers/appointments': 'Citas',
      '/managers/material-delivery': 'Material Entregado',
      '/maintainers/boxes': 'Boxes',
      '/maintainers/profesionals': 'Profesionales',
      '/maintainers/services': 'Servicios',
      '/maintainers/materials': 'Materiales',
      '/maintainers/clients': 'Clientes',
      '/maintainers/roles': 'Cargos',
      '/maintainers/users': 'Usuarios'
    };

    // Las rutas estáticas sobrescriben las dinámicas si hay conflicto
    return {
      ...staticTitles,
    };
  }, []);

  useEffect(() => {
    const path = location.pathname;
    const defaultTitle = 'HYD';

    const titleId = routeTitles[path];

    if (titleId) {
      const translatedTitle = intl.formatMessage({ id: titleId });
      document.title = translatedTitle + ' - HYD';
    } else {
      document.title = defaultTitle;
    }
  }, [location.pathname, intl, routeTitles]);

  return null;
};

export default PageTitleUpdater;