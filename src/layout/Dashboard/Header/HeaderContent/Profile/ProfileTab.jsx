import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { Card, Setting2, Logout, Profile, Profile2User } from 'iconsax-reactjs';

export default function ProfileTab({ handleLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedIndex, setSelectedIndex] = useState();

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    if (route) navigate(route);
  };

  useEffect(() => {
    const pathToIndex = {
      '/settings': 0,
      '/logout': 1 // esto es solo referencia, no hay ruta real
    };
    setSelectedIndex(pathToIndex[pathname] ?? undefined);
  }, [pathname]);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0, '/settings')}
      >
        <ListItemIcon>
          <Setting2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Configuración" />
      </ListItemButton>

      <ListItemButton
        selected={selectedIndex === 1}
        onClick={() => {
          handleListItemClick(null, 1);
          handleLogout();
        }}
      >
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
