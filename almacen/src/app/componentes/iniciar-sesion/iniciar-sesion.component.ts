import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service'; // ajusta si la ruta cambia

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent {
  correoEmpleado: string = '';
  passwordEmpleado: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
  const datos = {
    correoEmpleado: this.correoEmpleado,
    passwordEmpleado: this.passwordEmpleado
  };

  this.authService.loginEmpleado(datos).subscribe(
    res => {
      if (res.success) {
        console.log('Token recibido:', res.token); // 🔍 Mostrar el token en consola
        localStorage.setItem('token', res.token);
        alert('Inicio de sesión exitoso ✅'); // ✅ Alerta de éxito
        this.router.navigate(['/miscelanea']);
      } else {
        alert('Correo o contraseña incorrectos ❌'); // ❌ Alerta de error lógico
      }
    },
    error => {
      console.error('Error en la solicitud:', error);
      alert('Correo o contraseña incorrectos ❌'); // ❌ Alerta de error técnico
    }
  );
}
}