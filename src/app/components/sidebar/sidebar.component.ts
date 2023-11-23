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

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES;
    this.centerItems = this.menuItems.filter(menuItem => menuItem.path !== 'account');
    this.bottomItems = this.menuItems.filter(menuItem => menuItem.path === 'account');
  }
  
  isMobileMenu() {
      return $(window).width() <= 991;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.isMobileMenu();
  }
}
