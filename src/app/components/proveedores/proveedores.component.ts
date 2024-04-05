import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Proveedor } from '../../models/proveedores.model';
import { ProveedoresService } from '../../services/proovedores.service';

declare var $: any; // Declara jQuery

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  proveedoresFiltrados: Proveedor[] = [];
  proveedorForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number[] = [];
  modoEdicion: boolean = false;
  proveedorSeleccionado: Proveedor | null = null;
  terminoBusqueda!: string;
  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proveedorService: ProveedoresService,
    private _snackBar: MatSnackBar
  ) {
    this.proveedorForm = this.fb.group({
      nombre_proveedor: ['', Validators.required],
      contacto_proveedor: ['', Validators.required],
      direccion_proveedor: ['', Validators.required],
      telefono_proveedor: ['', Validators.required],
      nit_proveedor: ['', Validators.required],
      email_proveedor: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerProveedores();
  }

  obtenerProveedores(): void {
    this.proveedorService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.proveedoresFiltrados = [...this.proveedores];
      this.calcularTotalPages();
    });
  }

  toggleFormularioAgregarProveedor(): void {
    $('#formularioAgregarProveedor').toggle();
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardarCambiosProveedor(): void {
    if (this.proveedorForm.valid) {
      if (this.modoEdicion && this.proveedorSeleccionado) {
        const proveedorEditado: Proveedor = {
          ...this.proveedorSeleccionado,
          nombre_proveedor: this.proveedorForm.value.nombre_proveedor,
          contacto_proveedor: this.proveedorForm.value.contacto_proveedor,
          direccion_proveedor: this.proveedorForm.value.direccion_proveedor,
          telefono_proveedor: this.proveedorForm.value.telefono_proveedor,
          nit_proveedor: this.proveedorForm.value.nit_proveedor,
          email_proveedor: this.proveedorForm.value.email_proveedor,
          estado: this.proveedorForm.value.estado
        };
        this.proveedorService.actualizarProveedor(this.proveedorSeleccionado.id_proveedor.toString(), proveedorEditado)
          .then(() => {
            this.obtenerProveedores();
            this.limpiarFormulario();
            this.mostrarFormulario = false;
            this.mostrarSnackBar('Proveedor editado exitosamente');
          })
          .catch(error => {
            console.error('Error al actualizar el proveedor:', error);
          });
      } else {
        const nuevoProveedor: Proveedor = {
          id_proveedor: "", // Se generará automáticamente en la base de datos
          nombre_proveedor: this.proveedorForm.value.nombre_proveedor,
          contacto_proveedor: this.proveedorForm.value.contacto_proveedor,
          direccion_proveedor: this.proveedorForm.value.direccion_proveedor,
          telefono_proveedor: this.proveedorForm.value.telefono_proveedor,
          nit_proveedor: this.proveedorForm.value.nit_proveedor,
          email_proveedor: this.proveedorForm.value.email_proveedor,
          estado: this.proveedorForm.value.estado
        };
        this.proveedorService.agregarProveedor(nuevoProveedor)
          .then(() => {
            this.obtenerProveedores();
            this.limpiarFormulario();
            this.mostrarSnackBar('Proveedor agregado exitosamente');
          })
          .catch(error => {
            console.error('Error al agregar el proveedor:', error);
          });
      }
    }
  }

  editarProveedor(proveedor: Proveedor): void {
    this.modoEdicion = true;
    this.proveedorSeleccionado = proveedor;
    this.proveedorForm.patchValue({
      nombre_proveedor: proveedor.nombre_proveedor,
      contacto_proveedor: proveedor.contacto_proveedor,
      direccion_proveedor: proveedor.direccion_proveedor,
      telefono_proveedor: proveedor.telefono_proveedor,
      nit_proveedor: proveedor.nit_proveedor,
      email_proveedor: proveedor.email_proveedor,
      estado: proveedor.estado
    });
    this.mostrarFormulario = true;
    $('#formularioAgregarProveedor').show();
  }

  eliminarProveedor(idProveedor: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(idProveedor)
        .then(() => {
          this.proveedores = this.proveedores.filter(proveedor => proveedor.id_proveedor.toString() !== idProveedor);
          this.obtenerProveedores();
        })
        .catch(error => {
          console.error('Error al eliminar el proveedor:', error);
        });
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarProveedores('');
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  buscarProveedores(terminoBusqueda: string): void {
    if (!terminoBusqueda.trim()) {
      this.proveedoresFiltrados = [...this.proveedores];
      this.calcularTotalPages();
      return;
    }

    this.proveedoresFiltrados = this.proveedores.filter(proveedor =>
      proveedor.nombre_proveedor.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      proveedor.nit_proveedor.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      proveedor.email_proveedor.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    this.calcularTotalPages();
  }

  mostrarSnackBar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  limpiarFormulario(): void {
    this.proveedorForm.reset();
    this.modoEdicion = false;
    this.proveedorSeleccionado = null;
  }

  calcularTotalPages(): void {
    const totalProveedores = this.proveedoresFiltrados.length;
    this.totalPages = [];
    for (let i = 1; i <= Math.ceil(totalProveedores / this.itemsPerPage); i++) {
      this.totalPages.push(i);
    }
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }
}
