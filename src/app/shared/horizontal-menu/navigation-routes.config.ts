import { RouteInfo } from '../vertical-menu/vertical-menu.metadata';

export const HROUTES: RouteInfo[] = [
  {
    path: '/dashboard', title: 'Dashboard', icon: 'ft-home', class: 'dropdown nav-item', isExternalLink: false, submenu: [],
  },
  {
    path: '/corporativos', title: 'Corporativos', icon: 'ft-briefcase', class: 'dropdown nav-item', isExternalLink: false, submenu: [],
  }
];
