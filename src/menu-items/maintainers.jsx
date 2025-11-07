// assets
import { CodepenLogoIcon, UsersIcon, ClipboardTextIcon, SwatchesIcon, AddressBookIcon, UserListIcon, UsersThreeIcon } from '@phosphor-icons/react';

// icons
const icons = {
  CodepenLogoIcon: CodepenLogoIcon,
  UsersIcon: UsersIcon,
  ClipboardTextIcon: ClipboardTextIcon,
  SwatchesIcon: SwatchesIcon,
  AddressBookIcon: AddressBookIcon,
  UserListIcon: UserListIcon,
  UsersThreeIcon: UsersThreeIcon
};

// ==============================|| MENU ITEMS - MAINTAINERS ||============================== //

const maintainers = {
  id: 'group-mantainers',
  title: 'Mantenedores',
  type: 'group',
  children: [
    {
      id: 'boxes',
      title: 'Boxes',
      type: 'item',
      url: '/maintainers/boxes',
      icon: icons.CodepenLogoIcon
    },
    {
      id: 'profesionals',
      title: 'Profesionales',
      type: 'item',
      url: '/maintainers/profesionals',
      icon: icons.UsersIcon
    },
    {
      id: 'services',
      title: 'Servicios',
      type: 'item',
      url: '/maintainers/services',
      icon: icons.ClipboardTextIcon
    },
    {
      id: 'materials',
      title: 'Materiales',
      type: 'item',
      url: '/maintainers/materials',
      icon: icons.SwatchesIcon
    },
    {
      id: 'clients',
      title: 'Clientes',
      type: 'item',
      url: '/maintainers/clients',
      icon: icons.AddressBookIcon
    },
    {
      id: 'roles',
      title: 'Cargos',
      type: 'item',
      url: '/maintainers/roles',
      icon: icons.UserListIcon
    },
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      url: '/maintainers/users',
      icon: icons.UsersThreeIcon
    }
  ]
};

export default maintainers;
