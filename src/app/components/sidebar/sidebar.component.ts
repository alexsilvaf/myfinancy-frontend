import { Component, HostListener } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  children?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  { path: 'home', title: 'Página Inicial',  icon: 'home', class: '' },
  { path: 'management', title: 'Gerenciar Ativos',  icon: 'manage_search', class: '' },
  { path: 'account', title: 'Conta',  icon: 'account_circle', class: '' },
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  menuItems: any[];
  centerItems: any[];
  bottomItems: any[];
  readonly desktopMenuItems = [...ROUTES];

  mobileMenuItems = [];

  constructor() { }

  ngOnInit() {
    this.adjustMenuItemsOrder();
    this.setOtherItems();
  }

  setOtherItems() {
    this.centerItems = this.menuItems.filter(menuItem => menuItem.path !== 'account');
    this.bottomItems = this.menuItems.filter(menuItem => menuItem.path === 'account');
  }

  adjustMenuItemsOrder() {
    if (this.isMobileMenu()) {
      this.mobileMenuItems = this.moveHomeToMiddle(this.desktopMenuItems);
      this.menuItems = this.mobileMenuItems;
    } else {
      this.menuItems = this.desktopMenuItems;
    }
    this.setOtherItems();
  }

  moveHomeToMiddle(items) {
    const middleIndex = Math.floor(items.length / 2);
    const newItems = [...items];
    const homeIndex = newItems.findIndex(item => item.path === 'home');

    if (homeIndex !== middleIndex) {
      const [homeItem] = newItems.splice(homeIndex, 1);
      newItems.splice(middleIndex, 0, homeItem);
    }

    return newItems;
  }

  isMobileMenu() {
    return $(window).width() <= 991;
  }

  @HostListener('window:resize')
  onResize(event) {
    this.adjustMenuItemsOrder();
  }
}
