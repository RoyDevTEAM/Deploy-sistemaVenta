import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto.model';
import { Subcategoria } from '../../models/subcategoria.model';
import { UnidadMedida } from '../../models/unidad-medida.model';
import { ProductoService } from '../../services/producto.service';
import { SubcategoriaService } from '../../services/subcategoria.service';
import { UnidadMedidaService } from '../../services/unidad-medida.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var $: any; // Declara jQuery

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = []; // Agregado
  productoForm: FormGroup;
  subcategorias: Subcategoria[] = [];
  medidas: UnidadMedida[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number[] = [];
  modoEdicion: boolean = false;
  productoSeleccionado: Producto | null = null;
  terminoBusqueda!: string;
  mostrarFormulario: boolean = false;

  constructor(
    private fb: FormBuilder,
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService,
    private unidadMedidaService: UnidadMedidaService,
    private _snackBar: MatSnackBar
  ) {
    this.productoForm = this.fb.group({
      nombre_producto: ['', Validators.required],
      precio_producto: ['', Validators.required],
      descripcion_producto: ['', Validators.required],
      stock: ['', Validators.required],
      id_subcategoria: [null, Validators.required],
      id_unidad_medida: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerSubcategorias();
    this.obtenerUnidadesMedida();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
      // Asegúrate de que las subcategorías estén disponibles antes de llamar a asignarSubcategoria
      if (this.subcategorias.length > 0) {
        this.asignarSubcategoria();
      } else {
        // Si las subcategorías aún no se han obtenido, puedes hacer una llamada separada
        // y luego asignar, o manejar la lógica aquí para asegurarte de que las subcategorías se obtengan primero.
        this.obtenerSubcategoriasYAsignar();
      }
      this.productosFiltrados = [...this.productos]; // Actualizar la lista de productos filtrados
      this.calcularTotalPages();
    });
  }
  obtenerSubcategorias(): void {
    this.subcategoriaService.getSubcategorias().subscribe(subcategorias => {
      this.subcategorias = subcategorias;
    });
  }
  obtenerSubcategoriasYAsignar(): void {
    this.subcategoriaService.getSubcategorias().subscribe(subcategorias => {
      this.subcategorias = subcategorias;
      // Una vez obtenidas las subcategorías, asignarlas a los productos
      this.asignarSubcategoria();
    });
  }
  
  asignarSubcategoria(): void {
    this.productos.forEach(producto => {
      const subcategoriaEncontrada = this.subcategorias.find(subcategoria => subcategoria.id_subcategoria === producto.id_subcategoria);
      if (subcategoriaEncontrada) {
        producto.nombre_subcategoria= subcategoriaEncontrada.nombre_subcategoria; // Asumiendo que quieres asignar el nombre de la subcategoría
      }
    });
  }
 

  obtenerUnidadesMedida(): void {
    this.unidadMedidaService.getUnidadesMedida().subscribe(medidas => {
      this.medidas = medidas;
    });
  }

  toggleFormularioAgregarProducto(): void {
    $('#formularioAgregarProducto').toggle();
    this.mostrarFormulario = !this.mostrarFormulario;
  }
  
  guardarCambiosProducto(): void {
    if (this.productoForm.valid) {
      if (this.modoEdicion && this.productoSeleccionado) {
        const productoEditado: Producto = {
          ...this.productoSeleccionado,
          nombre_producto: this.productoForm.value.nombre_producto,
          precio_producto: this.productoForm.value.precio_producto,
          descripcion_producto: this.productoForm.value.descripcion_producto,
          stock: this.productoForm.value.stock,
          id_subcategoria: this.productoForm.value.id_subcategoria,
          id_unidad_medida: this.productoForm.value.id_unidad_medida
        };
        this.productoService.actualizarProducto(this.productoSeleccionado.id_producto.toString(), productoEditado)
          .then(() => {
            this.obtenerProductos();
            this.limpiarFormulario();
            this.mostrarFormulario = false;
            this.mostrarSnackBar('Producto editado exitosamente');
          })
          .catch(error => {
            console.error('Error al actualizar el producto:', error);
          });
      } else {
        const nuevoProducto: Producto = {
          id_producto: "", // Se generará automáticamente en la base de datos
          nombre_producto: this.productoForm.value.nombre_producto,
          precio_producto: this.productoForm.value.precio_producto,
          descripcion_producto: this.productoForm.value.descripcion_producto,
          stock: this.productoForm.value.stock,
          id_subcategoria: this.productoForm.value.id_subcategoria,
          id_unidad_medida: this.productoForm.value.id_unidad_medida
        };
        this.productoService.agregarProducto(nuevoProducto)
          .then(() => {
            this.obtenerProductos();
            this.limpiarFormulario();
            this.mostrarSnackBar('Producto agregado exitosamente');
          })
          .catch(error => {
            console.error('Error al agregar el producto:', error);
          });
      }
    }
  }

  editarProducto(producto: Producto): void {
    this.modoEdicion = true;
    this.productoSeleccionado = producto;
    this.productoForm.patchValue({
      nombre_producto: producto.nombre_producto,
      precio_producto: producto.precio_producto,
      descripcion_producto: producto.descripcion_producto,
      stock: producto.stock,
      id_subcategoria: producto.id_subcategoria,
      id_unidad_medida: producto.id_unidad_medida
    });
    this.mostrarFormulario = true;
    $('#formularioAgregarProducto').show();
  }

  eliminarProducto(idProducto: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.productoService.eliminarProducto(idProducto)
        .then(() => {
          this.productos = this.productos.filter(producto => producto.id_producto.toString() !== idProducto);
          this.obtenerProductos();
        })
        .catch(error => {
          console.error('Error al eliminar el producto:', error);
        });
    }
  }
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarProductos('');
  }

  cambiarPagina(page: number): void {
    this.currentPage = page;
  }

  buscarProductos(terminoBusqueda: string): void {
    if (!terminoBusqueda.trim()) {
      this.productosFiltrados = [...this.productos];
      this.calcularTotalPages();
      return;
    }
  
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre_producto && producto.descripcion_producto && (
        producto.nombre_producto.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
        producto.descripcion_producto.toLowerCase().includes(terminoBusqueda.toLowerCase())
      )
    );
    this.calcularTotalPages();
  }
  

  // Método para filtrar productos por nombre, subcategoría y stock
  filtrarProductos(nombre: string, stock: number): void {
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre_producto.toLowerCase().includes(nombre.toLowerCase()) &&
     
      (stock === null || producto.stock === stock)
    );
    this.calcularTotalPages();
  }

  mostrarSnackBar(message: string): void {
    this._snackBar.open(message, 'Cerrar', {
      duration: 3000,
    });
  }

  limpiarFormulario(): void {
    this.productoForm.reset();
    this.modoEdicion = false;
    this.productoSeleccionado = null;
  }

  calcularTotalPages(): void {
    const totalProductos = this.productosFiltrados.length;
    this.totalPages = [];
    for (let i = 1; i <= Math.ceil(totalProductos / this.itemsPerPage); i++) {
      this.totalPages.push(i);
    }
  }

  // Método para cancelar la edición y limpiar el formulario
  cancelarEdicion(): void {
    this.limpiarFormulario();
  }
}
