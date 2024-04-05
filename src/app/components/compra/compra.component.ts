import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Compra } from '../../models/compra.model';
import { Proveedor } from '../../models/proveedores.model';
import { CompraService } from '../../services/compra.service';
import { ProveedoresService } from '../../services/proovedores.service';
import { AuthService } from '../../services/auth.service';

// Declaramos jQuery de manera global
declare var $: any;

@Component({
  selector: 'app-compra',
  templateUrl: './compra.component.html',
  styleUrls: ['./compra.component.css']
})
export class CompraComponent implements AfterViewInit {
  compras: Compra[] = [];
  proveedores: Proveedor[] = [];
  compraForm: FormGroup;
  currentUser: any; // Usuario actual
  proveedorSeleccionado: Proveedor | null = null;

  constructor(
    private fb: FormBuilder,
    private compraService: CompraService,
    private proveedorService: ProveedoresService,
    private authService: AuthService,
  ) {
    this.compraForm = this.fb.group({
      proveedor: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
    this.proveedorSeleccionado = null; // Inicializar proveedorSeleccionado
  }

  ngAfterViewInit(): void {
    this.proveedorService.getProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.initProveedorAutocomplete();
    });

    this.authService.usuarioActual$.subscribe(user => {
      this.currentUser = user;
    });

    this.compraService.getCompras().subscribe(compras => {
      this.compras = compras;
    });
  }

  private initProveedorAutocomplete(): void {
    $('#busquedaProveedor').autocomplete({
      source: this.proveedores.map(proveedor => proveedor.nombre_proveedor),
      select: (event: { preventDefault: () => void; }, ui: { item: { value: any; }; }) => {
        this.compraForm.controls['proveedor'].setValue(ui.item.value);
        event.preventDefault();
      }
    });
  }

  mostrarProveedorSeleccionado(): void {
    const proveedorNombre = this.compraForm.controls['proveedor'].value;
    this.proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.nombre_proveedor === proveedorNombre) || null;

    if (!this.proveedorSeleccionado) {
      alert('Seleccione un proveedor válido.');
    }
  }


  procesarCompra(): void {
    const proveedorSeleccionadoNombre = this.compraForm.controls['proveedor'].value;
    const precio = this.compraForm.controls['precio'].value;
    const descripcion = this.compraForm.controls['descripcion'].value;

    if (!proveedorSeleccionadoNombre || !precio || !descripcion) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const proveedorSeleccionado = this.proveedores.find(proveedor => proveedor.nombre_proveedor === proveedorSeleccionadoNombre);

    if (!proveedorSeleccionado) {
      alert('Seleccione un proveedor válido.');
      return;
    }

    const compra: Compra = {
      id_compra: 0,
      fecha_compra: new Date(),
      precio_compra: precio,
      descripcion_compra: descripcion,
      total_compra: precio,
      id_proveedor: proveedorSeleccionado.id_proveedor,
      id_usuario: this.currentUser.id_usuario
    };

    this.compraService.agregarCompra(compra).then(() => {
      alert('Compra realizada exitosamente.');
      this.compraForm.reset();
    }).catch(error => {
      console.error('Error al procesar la compra:', error);
      alert('Ocurrió un error al procesar la compra. Por favor, intenta nuevamente.');
    });
  }
}
