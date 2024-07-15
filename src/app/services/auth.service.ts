import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {}

  login(values: any) {
    return this.http.post(`${environment.api_url}login`, values);
  }

  logout() {
    localStorage.removeItem('access_token');
    window.location.href = '/iniciar-sesion';
  }

  saveAuth(resp: any) {
    localStorage.setItem('access_token', resp.accessToken);
    localStorage.setItem('user', JSON.stringify(resp.user));
    window.location.href = '/';
  }

  getAuth() {
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    return user;
  }
  getId() {
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
    }
    return user.id;
  }
}
