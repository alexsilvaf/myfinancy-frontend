import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-logged-user-layout',
  templateUrl: './logged-user-layout.component.html',
  styleUrl: './logged-user-layout.component.scss'
})
export class LoggedUserLayoutComponent implements OnInit {
  isMobileMenu: boolean;

  ngOnInit(){
    this.isMobileMenu = window.innerWidth <= 991;
  }

  @HostListener('window:resize')
  onResize() {
    this.isMobileMenu = window.innerWidth <= 991;
  }
}
