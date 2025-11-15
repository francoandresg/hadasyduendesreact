// assets
import { Home } from "iconsax-reactjs";

const icons = { house: Home };

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