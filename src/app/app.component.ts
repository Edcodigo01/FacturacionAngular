import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'FacturacionED';
  hideN = false;
  subscribe: any;
  user: any;
  loaded = false;
  hideSidebar = false;
  sidebarCollapse = false;
  constructor(
    private router: Router,
    private authS: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.user = this.authS.getAuth();
    this.subscribe = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        if (e.url.includes('iniciar-sesion')) {
          this.hideN = true;
          this.loaded = true;
        } else {
          this.hideSidebar = true;
          setTimeout(() => {
            this.hideSidebar = false;
          }, 200);
        }
        if (e.url.includes('facturar')) {
          this.sidebarCollapse = true;
        } else {
          this.sidebarCollapse = false;
        }
      }
    });
  }

  logout() {
    this.authS.logout();
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}
