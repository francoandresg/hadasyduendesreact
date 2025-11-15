import { Fragment, useLayoutEffect, useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {
  Card,
  CardContent,
  CardHeader,
  Stack,
  IconButton,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { Sort, Logout } from 'iconsax-reactjs';

// project-imports
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import { useGetMenu, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, HORIZONTAL_MAX_ITEM } from 'config';
import useConfig from 'hooks/useConfig';
import menuItem from 'menu-items';

import useAuth from 'hooks/useAuth';
import { useNavigate } from 'react-router';

function isFound(arr, str) {
  return arr.items.some((element) => element.id === str);
}

// ==============================|| DRAWER CONTENT - NAVIGATION ||============================== //

export default function Navigation() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const { logout, user } = useAuth();
  const { menuOrientation } = useConfig();
  // const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const [selectedID, setSelectedID] = useState('');
  const [selectedItems, setSelectedItems] = useState('');
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [menuItems, setMenuItems] = useState({ items: [] });
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    const filteredMenu = menuItem.items.filter((m) => m.id !== 'group-dashboard-loading');

    setMenuItems({ items: [...filteredMenu] });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: ''
        }
      });
    } catch (err) {
      console.error(err);
    }
  };

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;
  let lastItemIndex = menuItems.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menuItems.items.length) {
    lastItemId = menuItems.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menuItems.items.slice(lastItem - 1, menuItems.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navGroups = menuItems.items.slice(0, lastItemIndex + 1).map((item) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <Fragment key={item.id}>
              {menuOrientation !== MenuOrientation.HORIZONTAL && <Divider sx={{ my: 0.5 }} />}
              <NavItem item={item} level={1} isParents setSelectedID={setSelectedID} />
            </Fragment>
          );
        }
        return (
          <NavGroup
            key={item.id}
            selectedID={selectedID}
            setSelectedID={setSelectedID}
            setSelectedItems={setSelectedItems}
            setSelectedLevel={setSelectedLevel}
            selectedLevel={selectedLevel}
            selectedItems={selectedItems}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
            item={item}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return (
    <Box
      sx={{
        '& > ul:first-of-type': { mt: 0 },
        display: isHorizontal ? { xs: 'block', lg: 'flex' } : 'block',
        alignItems: 'center'
      }}
    >
      <Card
        elevation={0}
        sx={{
          m: 1.6,
          px: 2,
          borderRadius: 1.6,
          border: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <CardHeader
          sx={{
            py: 2,
            '& .MuiCardHeader-action': {
              alignSelf: 'center'
            }
          }}
          title={
            <Stack>
              <Typography>{user?.nameuser}</Typography>
              <Typography variant="body2" fontWeight="light">
                {user?.profile}
              </Typography>
            </Stack>
          }
          action={
            <IconButton onClick={() => setOpenMenu(openMenu === 1 ? 0 : 1)}>
              <Sort />
            </IconButton>
          }
        />
        <Collapse in={openMenu === 1} timeout="auto" unmountOnExit>
          <CardContent
            sx={{
              p: 0,
              pb: '0px !important',
            }}
          >
            <List component="nav">
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <Logout variant="Bulk" size={18} />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </ListItemButton>
            </List>
          </CardContent>
        </Collapse>
      </Card>
      {navGroups}
    </Box>
  );
}
