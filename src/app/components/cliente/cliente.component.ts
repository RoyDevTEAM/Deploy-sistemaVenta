import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../../models/cliente.model';
import { ClientesService } from '../../services/cliente.service';


declare var $: any; // Declara jQuery

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  clienteForm: FormGroup;
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number[] = [];
  modoEdicion: boolean = false;
  clienteSeleccionado: Cliente | null = null;
  terminoBusqueda!: string;
  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClientesService,
    private _snackBar: MatSnackBar
  ) {
    this.clienteForm = this.fb.group({
      nombre_cliente: ['', Validators.required],
      apellido_cliente: ['', Validators.required],
      numero_carnet: ['', Validators.required],
      telefono: ['', Validators.required],
      direccion: ['', Validators.required],
      estado: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clienteService.getClientes().subscribe(cliente => {
      this.clientes = cliente;
      this.clientesFiltrados = [...this.clientes];
      this.calcularTotalPages();
    });
  }

  toggleFormularioAgregarCliente(): void {
    $('#formularioAgregarCliente').toggle();
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  guardarCambiosCliente(): void {
    if (this.clienteForm.valid) {
      if (this.modoEdicion && this.clienteSeleccionado) {
        const clienteEditado: Cliente = {
          ...this.clienteSeleccionado,
          nombre_cliente: this.clienteForm.value.nombre_cliente,
          apellido_cliente: this.clienteForm.value.apellido_cliente,
          numero_carnet: this.clienteForm.value.numero_carnet,
          telefono: this.clienteForm.value.telefono,
          direccion: this.clienteForm.value.direccion,
          estado: this.clienteForm.value.estado
        };
        this.clienteService.actualizarCliente(this.clienteSeleccionado.id_cliente.toString(), clienteEditado)
          .then(() => {
            this.obtenerClientes();
            this.limpiarFormulario();
            this.mostrarFormulario = false;
            this.mostrarSnackBar('Cliente editado exitosamente');
          })
          .catch(error => {
            console.error('Error al actualizar el cliente:', error);
          });
      } else {
        const nuevoCliente: Cliente = {
          id_cliente: "", // Se generará automáticamente en la base de datos
          nombre_cliente: this.clienteForm.value.nombre_cliente,
          apellido_cliente: this.clienteForm.value.apellido_cliente,
          numero_carnet: this.clienteForm.value.numero_carnet,
          telefono: this.clienteForm.value.telefono,
          direccion: this.clienteForm.value.direccion,
          estado: this.clienteForm.value.estado
        };
        this.clienteService.agregarCliente(nuevoCliente)
          .then(() => {
            this.obtenerClientes();
            this.limpiarFormulario();
            this.mostrarSnackBar('Cliente agregado exitosamente');
          })
          .catch(error => {
            console.error('Error al agregar el cliente:', error);
          });
      }
    }
  }

  editarCliente(cliente: Cliente): void {
    this.modoEdicion = true;
    this.clienteSeleccionado = cliente;
    this.clienteForm.patchValue({
      nombre_cliente: cliente.nombre_cliente,
      apellido_cliente: cliente.apellido_cliente,
      numero_carnet: cliente.numero_carnet,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
      estado: cliente.estado
    });
    this.mostrarFormulario = true;
    $('#formularioAgregarCliente').show();
  }

  eliminarCliente(idCliente: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.clienteService.eliminarCliente(idCliente)
        .then(() => {
          this.clientes = this.clientes.filter(cliente => cliente.id_cliente.toString() !== idCliente);
          this.obtenerClientes();
        })
        .catch(error => {
          console.error('Error al eliminar el cliente:', error);
        });
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarClientes('');
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  buscarClientes(terminoBusqueda: string): void {
    if (!terminoBusqueda.trim()) {
      this.clientesFiltrados = [...this.clientes];
      this.calcularTotalPages();
      return;
    }

    this.clientesFiltrados = this.clientes.filter(cliente =>
      cliente.nombre_cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      cliente.apellido_cliente.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      cliente.numero_carnet.toLowerCase().includes(terminoBusqueda.toLowerCase())
    );
    this.calcularTotalPages();
  }

  mostrarSnackBar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  limpiarFormulario(): void {
    this.clienteForm.reset();
    this.modoEdicion = false;
    this.clienteSeleccionado = null;
  }

  calcularTotalPages(): void {
    const totalCliente = this.clientesFiltrados.length;
    this.totalPages = [];
    for (let i = 1; i <= Math.ceil(totalCliente / this.itemsPerPage); i++) {
      this.totalPages.push(i);
    }
  }

  cancelarEdicion(): void {
    this.limpiarFormulario();
  }
}
