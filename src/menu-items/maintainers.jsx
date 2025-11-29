// assets
import { Element4, Profile2User, ClipboardText, Box, Personalcard, People, UserSquare } from 'iconsax-reactjs';

// icons
const icons = {
  Element4: Element4,
  Profile2User: Profile2User,
  ClipboardText: ClipboardText,
  Box: Box,
  UserSquare: UserSquare,
  Personalcard: Personalcard,
  People: People
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
      icon: icons.Element4
    },
    {
      id: 'profesionals',
      title: 'Profesionales',
      type: 'item',
      url: '/maintainers/profesionals',
      icon: icons.Profile2User
    },
    {
      id: 'services-type',
      title: 'Tipo de Servicios',
      type: 'item',
      url: '/maintainers/services-type',
      icon: icons.Personalcard
    },
    {
      id: 'services',
      title: 'Servicios',
      type: 'item',
      url: '/maintainers/services',
      icon: icons.ClipboardText
    },
    {
      id: 'materials',
      title: 'Materiales',
      type: 'item',
      url: '/maintainers/materials',
      icon: icons.Box
    },
    {
      id: 'clients',
      title: 'Clientes',
      type: 'item',
      url: '/maintainers/clients',
      icon: icons.UserSquare
    },
    {
      id: 'users',
      title: 'Usuarios',
      type: 'item',
      url: '/maintainers/users',
      icon: icons.People
    }
  ]
};

export default maintainers;
