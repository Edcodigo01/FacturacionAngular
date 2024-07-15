import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacturarService {
  constructor(private http: HttpClient) {}

  get(values: any) {
    return this.http.get(`${environment.api_url}facturar`, values);
  }
}
