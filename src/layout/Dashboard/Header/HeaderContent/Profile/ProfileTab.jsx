import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// assets
import { Card, Edit2, Logout, Profile, Profile2User } from 'iconsax-reactjs';

export default function ProfileTab({ handleLogout }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [selectedIndex, setSelectedIndex] = useState();
  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);

    if (route && route !== '') {
      navigate(route);
    }
  };

  useEffect(() => {
    const pathToIndex = {
      '/apps/profiles/user/personal': 0,
      '/apps/profiles/account/basic': 1,
      '/apps/profiles/account/personal': 3,
      '/apps/invoice/details/1': 4
    };

    setSelectedIndex(pathToIndex[pathname] ?? undefined);
  }, [pathname]);

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={(event) => handleListItemClick(event, 0, '/apps/profiles/user/personal')}>
        <ListItemIcon>
          <Edit2 variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <Logout variant="Bulk" size={18} />
        </ListItemIcon>
        <ListItemText primary="Cerrar Sesión" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = { handleLogout: PropTypes.func };
