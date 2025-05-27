import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private router: Router) {}

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      return !!localStorage.getItem('token');
    }
    return false;
  }   

  // Método para cerrar sesión
  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        console.log('Token eliminado. Sesión cerrada.');
      } else {
        console.log('No hay token almacenado.');
      }
    }
    this.router.navigate(['/iniciar-sesion']); // Redirige al usuario a la página de inicio
  }
  
}
