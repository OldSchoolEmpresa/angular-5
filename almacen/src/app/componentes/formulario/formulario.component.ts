import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import bcrypt from 'bcryptjs';


@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent {
  form: FormGroup;
  showPassword = false;
  registroExitoso = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.form = new FormGroup({
      idEmpleado: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d{10}$/)
      ]),
      nombreEmpleado: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]),
      correoEmpleado: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      passwordEmpleado: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d).+$/)
      ])
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

 onSubmit() {
  if (this.form.invalid) {
    alert('⚠️ Por favor revisa los campos.');
    return;
  }

  const fv = this.form.value;

  const payload = {
    idEmpleado: fv.idEmpleado,
    nombreEmpleado: fv.nombreEmpleado,
    correoEmpleado: fv.correoEmpleado,
    passwordEmpleado: fv.passwordEmpleado // 🔒 sin cifrar aquí
  };

  this.authService.registrarEmpleado(payload).subscribe({
    next: () => {
      this.registroExitoso = true;
      setTimeout(() => alert('✅ Te registraste correctamente.'), 500);
      this.router.navigate(['/formulario']);
    },
    error: err => {
      console.error('Error detalle:', err.error);
      alert('❌ ' + (err.error.message || 'Error en validación'));
    }
  });
}
}