// assets
import { HouseIcon } from '@phosphor-icons/react';

const icons = { house: HouseIcon };

const dashboard = {
  id: 'group-dashboard',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard',
      icon: icons.house
    }
  ]
};

export default dashboard;