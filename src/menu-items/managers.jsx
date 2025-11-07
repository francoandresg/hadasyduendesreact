// assets
import { CalendarIcon, HandCoinsIcon } from '@phosphor-icons/react';

// icons
const icons = {
  Calendar: CalendarIcon,
  HandCoins: HandCoinsIcon
};

// ==============================|| MENU ITEMS - MANAGERS ||============================== //

const managers = {
  id: 'group-managers',
  title: 'Gestores',
  icon: icons.widgets,
  type: 'group',
  children: [
    {
      id: 'appointments',
      title: 'Citas',
      type: 'item',
      url: '/managers/appointments',
      icon: icons.Calendar
    },
    {
      id: 'material-delivery',
      title: 'Material Entregado',
      type: 'item',
      url: '/managers/material-delivery',
      icon: icons.HandCoins
    }
  ]
};

export default managers;
