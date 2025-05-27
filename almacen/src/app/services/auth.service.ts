import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registrarEmpleado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/empleado`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  loginEmpleado(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }
}
