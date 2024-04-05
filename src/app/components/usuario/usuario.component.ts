import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from '../../models/usuario.model';
import { Rol } from '../../models/rol.model';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth.service';
import { RolesService } from '../../services/roles.service';
declare var $: any; // Declara jQuery
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuarioForm: FormGroup;
  usuariosFiltrados: Usuario[] = [];
  roles: Rol[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number[] = [];
  modoEdicion: boolean = false;
  usuarioSeleccionado: Usuario | null = null;
  terminoBusqueda!: string;
 // Nuevo método para mostrar/ocultar el formulario de agregar usuario
 toggleFormularioAgregarUsuario(): void {
  $('#formularioAgregarUsuario').toggle();
  this.mostrarFormulario = !this.mostrarFormulario;

}// Nuevo método para inicializar el filtrado de usuarios
inicializarFiltradoUsuarios(): void {
  $('#terminoBusqueda').on('input', () => {
    const terminoBusqueda = $('#terminoBusqueda').val().trim();
    this.buscarUsuarios(terminoBusqueda);
  });
}
 // Método para cancelar la edición y limpiar el formulario
 cancelarEdicion(): void {
  this.limpiarFormulario();
}
mostrarFormulario: boolean = false; // Variable para controlar la visibilidad del formulario


  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private roleService:RolesService,
    private _snackBar: MatSnackBar,
  ) {
    this.usuarioForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido_usuario: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      direccion: ['', Validators.required],
      id_rol: [null, Validators.required],
      numero_carnet: ['', Validators.required],
      telefono: ['', Validators.required],
      contrasena: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.obtenerRoles();

  }

  obtenerUsuarios(): void {
    this.usuarioService.getUsuarios().subscribe(usuarios => {
      this.usuarios = usuarios;
      if (this.roles.length > 0) {
        this.asignarRol();
      } else {
        this.obtenerRolesYAsignar();
      }
      this.usuariosFiltrados = [...this.usuarios]; // Actualizar la lista de usuarios filtrados
      this.calcularTotalPages();
    });
  }
  

  obtenerRoles(): void {
    this.roleService.getRoles().subscribe(roles => {
      this.roles = roles;
    });
  }
// Nuevo método para obtener roles y luego asignarlos
obtenerRolesYAsignar(): void {
  this.roleService.getRoles().subscribe(roles => {
    this.roles = roles;
    this.asignarRol();
  });
}

asignarRol(): void {
  this.usuarios.forEach(usuario => {
    // Encuentra el rol correspondiente sin necesidad de suscribirse nuevamente
    const rolEncontrado = this.roles.find(rol => rol.id_rol.toString() === usuario.id_rol.toString());
    if (rolEncontrado) {
      usuario.rol = rolEncontrado.rol;
    }
  });}
  calcularTotalPages(): void {
    const totalUsuarios = this.usuariosFiltrados.length;
    this.totalPages = [];
    for (let i = 1; i <= Math.ceil(totalUsuarios / this.itemsPerPage); i++) {
      this.totalPages.push(i);
    }
  }
  

  guardarCambiosUsuario(): void {
    if (this.usuarioForm.valid) {
      if (this.modoEdicion && this.usuarioSeleccionado) {
        // Modo Edición
        const usuarioEditado: Usuario = {
          ...this.usuarioSeleccionado,
          nombre_usuario: this.usuarioForm.value.nombre,
          id_rol: this.usuarioForm.value.id_rol,
          apellido_usuario: this.usuarioForm.value.apellido_usuario,
          usuario: this.usuarioForm.value.correo,
          direccion: this.usuarioForm.value.direccion,
          contrasena: this.usuarioForm.value.contrasena,
          numero_carnet: this.usuarioForm.value.numero_carnet,
          telefono: this.usuarioForm.value.telefono
        };
        this.usuarioService.actualizarUsuario(this.usuarioSeleccionado.id_usuario, usuarioEditado)
          .then(() => {
            this.obtenerUsuarios();
            this.limpiarFormulario();
            this.mostrarFormulario = false;
            this.mostrarSnackBar('usuario editado exitosamente');
          })
          .catch(error => {
            console.error('Error al actualizar el usuario:', error);
          });
      } else {
        // Modo Agregar
        const nuevoUsuario: Usuario = {
          id_usuario: '', // Se generará automáticamente en la base de datos
          nombre_usuario: this.usuarioForm.value.nombre,
          id_rol: this.usuarioForm.value.id_rol,
          apellido_usuario: this.usuarioForm.value.apellido_usuario,
          usuario: this.usuarioForm.value.correo,
          direccion: this.usuarioForm.value.direccion,
          contrasena: this.usuarioForm.value.contrasena,
          numero_carnet: this.usuarioForm.value.numero_carnet,
          telefono: this.usuarioForm.value.telefono
        };
        this.authService.registerWithEmail(this.usuarioForm.value.correo, this.usuarioForm.value.contrasena, nuevoUsuario)
          .then(() => {
            this.obtenerUsuarios();
            this.limpiarFormulario();
            this.mostrarSnackBar('usuario agregado exitosamente');

          })
          .catch(error => {
            console.error('Error al registrar el usuario:', error);
          });
      }
    }
  }

  editarUsuario(usuario: Usuario): void {
    this.modoEdicion = true;
    this.usuarioSeleccionado = usuario;
    this.usuarioForm.patchValue({
      nombre: usuario.nombre_usuario,
      id_rol: usuario.id_rol,
      apellido_usuario: usuario.apellido_usuario,
      correo: usuario.usuario,
      direccion: usuario.direccion,
      numero_carnet: usuario.numero_carnet,
      telefono: usuario.telefono
    });
    // Muestra el formulario
    this.mostrarFormulario = true;
    $('#formularioAgregarUsuario').show();
  }

  eliminarUsuario(idUsuario: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(idUsuario)
        .then(() => {
          this.usuarios = this.usuarios.filter(usuario => usuario.id_usuario !== idUsuario);
          this.obtenerUsuarios();
        })
        .catch(error => {
          console.error('Error al eliminar el usuario:', error);
        });
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarUsuarios('');
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  buscarUsuarios(terminoBusqueda: string): void {
    if (!terminoBusqueda.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }

    this.usuariosFiltrados = this.usuarios.filter(usuario =>
      usuario.nombre_usuario.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      usuario.apellido_usuario.toLowerCase().includes(terminoBusqueda.toLowerCase())||
      usuario.numero_carnet.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    this.calcularTotalPages(); // Llamar al método para recalcular el total de páginas

  }
 mostrarSnackBar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }
  limpiarFormulario(): void {
    this.usuarioForm.reset();
    this.modoEdicion = false;
    this.usuarioSeleccionado = null;
  }
}
