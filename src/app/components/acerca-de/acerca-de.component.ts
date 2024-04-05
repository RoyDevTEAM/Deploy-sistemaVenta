import { Component } from '@angular/core';
import { Empresa } from '../../models/empresa.model';
import { EmpresaService } from '../../services/empresa.service';

@Component({
  selector: 'app-acerca-de',
  templateUrl: './acerca-de.component.html',
  styleUrls: ['./acerca-de.component.css']
})
export class AcercaDeComponent {
  empresas: Empresa[] = [];
  empresa: Empresa = {
    id_empresa: '',
    nombre: '',
    descripcion: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    sitioWeb: '',
    sector: '',
    fechaFundacion: new Date(),
    logoUrl: ''
  };
  logoFile: File | null = null;
  isEditing: boolean = false;
  empresaIdToEdit: string = '';
  isFormVisible: boolean = false;

  constructor(private empresaService: EmpresaService) {
    this.obtenerEmpresas();
  }

  guardarEmpresa(): void {
    if (this.empresa.nombre && this.empresa.descripcion && this.logoFile) {
      if (this.isEditing && this.empresaIdToEdit) {
        // Editar empresa existente
        this.empresaService.actualizarEmpresa(this.empresaIdToEdit, this.empresa)
          .then(() => {
            this.obtenerEmpresas(); // Actualizar la lista de empresas después de editar una
            this.limpiarFormulario();
            this.isEditing = false;
            this.toggleFormVisibility();
          })
          .catch(error => console.error('Error al editar empresa:', error));
      } else {
        // Agregar nueva empresa
        this.empresaService.agregarEmpresa(this.empresa, this.logoFile)
          .then(() => {
            this.obtenerEmpresas(); // Actualizar la lista de empresas después de agregar una nueva
            this.limpiarFormulario();
            this.toggleFormVisibility();
          })
          .catch(error => console.error('Error al agregar empresa:', error));
      }
    }
  }

  editarEmpresa(empresa: Empresa): void {
    // Asignar valores de la empresa a editar al formulario
    this.empresa = { ...empresa };
    this.empresaIdToEdit = empresa.id_empresa;
    this.isEditing = true;
    this.toggleFormVisibility();
  }

  obtenerEmpresas(): void {
    this.empresaService.getEmpresas().subscribe(empresas => {
      this.empresas = empresas;
    });
  }

  eliminarEmpresa(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta empresa?')) {
      this.empresaService.eliminarEmpresa(id)
        .then(() => {
          this.obtenerEmpresas(); // Actualizar la lista de empresas después de eliminar una
          this.limpiarFormulario();
          this.isEditing = false;
          this.toggleFormVisibility();
        })
        .catch(error => console.error('Error al eliminar empresa:', error));
    }
  }

  onFileSelected(event: any): void {
    this.logoFile = event.target.files[0];
  }

  limpiarFormulario(): void {
    this.empresa = {
      id_empresa: '',
      nombre: '',
      descripcion: '',
      direccion: '',
      telefono: '',
      correoElectronico: '',
      sitioWeb: '',
      sector: '',
      fechaFundacion: new Date(),
      logoUrl: ''
    };
    this.logoFile = null;
    this.toggleFormVisibility(); // Ocultar el formulario al limpiar
  }

  toggleFormVisibility(): void {
    this.isFormVisible = !this.isFormVisible;
  }
}
