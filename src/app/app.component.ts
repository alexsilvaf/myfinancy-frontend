import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'myfinancy-frontend';
  isMobileMenu: boolean;

  constructor() {
    this.isMobileMenu = window.innerWidth <= 991;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileMenu = window.innerWidth <= 991;
  }
}
