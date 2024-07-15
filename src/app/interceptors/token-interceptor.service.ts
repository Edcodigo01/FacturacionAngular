import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (request.url.includes('/api/login')) {
      return next.handle(request);
    }

    const token = localStorage.getItem('access_token');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          this.toastr.warning('El usuario no ha sido autenticado.', 'Error');
          this.authService.logout();
        } else if (err.error.message == 'This action is unauthorized.') {
          window.location.href = '/';
        } else if (err.error.message == 'The given data was invalid.') {
          this.toastr.warning('Los datos enviados no son correctos.', 'Error');
        } else if (err.error.message) {
          this.toastr.warning(err.error.message, 'Error');
        } else if (!err.ok) {
          this.toastr.warning(
            'No se pudo conectar con el servidor, verifique su conexión a internet.',
            'Error'
          );
        }
        // const error = err.error.message || err.statusText;
        return throwError(err);
      })
    );
  }
}
