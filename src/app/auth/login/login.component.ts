import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Importar SweetAlert2
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm || this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;

    try {
      await this.authService.loginWithEmail(email, password);

      // Obtener el rol del usuario después de iniciar sesión
      const isAdmin = await this.authService.isAdmin();
      const isSeller = await this.authService.isSeller();

      // Redirigir al componente correspondiente según el rol del usuario
      if (isAdmin) {
        this.router.navigate(['/dashboard']); // Redirigir al dashboard si es administrador
      } else if (isSeller) {
        this.router.navigate(['/venta']); // Redirigir a ventas si es vendedor
      } else {
        // Mostrar mensaje de error si el usuario no tiene un rol válido asignado
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Usuario no tiene un rol válido asignado. Contacte al administrador.',
          confirmButtonText: 'Cerrar'
        });
      }
    } catch (error) {
      // Mostrar mensaje de error al iniciar sesión
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al iniciar sesión. Verifique sus credenciales e intente nuevamente.',
        confirmButtonText: 'Cerrar'
      });
    }
  }
}
