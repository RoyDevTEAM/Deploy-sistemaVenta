import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CarritoService } from './carrito.service';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productosCollection: AngularFirestoreCollection<Producto>;
  productos: Observable<Producto[]>;

  constructor(
    private firestore: AngularFirestore,
    private carritoService: CarritoService
  ) {
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos = this.productosCollection.valueChanges({ idField: 'id' });
  }

  getProductos(): Observable<Producto[]> {
    return this.productos;
  }

  async agregarProducto(producto: Producto): Promise<any> {
    try {
      // Obtener una referencia al documento recién agregado
      const docRef = await this.productosCollection.add(producto);
      
      // Obtener el ID del documento recién agregado
      const idDocumento = docRef.id;
      
      // Asignar el ID del documento al atributo id_producto del producto
      producto.id_producto = idDocumento;
  
      // Actualizar el documento con el ID del documento asignado como id_producto
      await docRef.update({ id_producto: idDocumento });
  
      return docRef;
    } catch (error) {
      console.error('Error al agregar producto:', error);
      throw error;
    }
  }
  

  getProductoById(id: string): Observable<Producto | undefined> {
    return this.productosCollection.doc<Producto>(id).valueChanges().pipe(
      map(producto => producto ? { ...producto, id } as Producto : undefined)
    );
  }

  actualizarProducto(id: string, data: any): Promise<void> {
    return this.productosCollection.doc(id).update(data);
  }

  eliminarProducto(id: string): Promise<void> {
    return this.productosCollection.doc(id).delete();
  }
  async actualizarStock(productoId: string, cantidadVendida: number): Promise<boolean> {
    try {
      // Obtener el documento del producto por su ID
      const productoDoc = await this.productosCollection.doc(productoId).get().toPromise();
  
      // Verificar si el documento existe y no es undefined
      if (productoDoc && productoDoc.exists) {
        // Obtener el producto de los datos del documento
        const producto = productoDoc.data() as Producto;
  
        // Calcular el nuevo stock
        const nuevoStock = producto.stock - cantidadVendida;
  
        // Verificar si el nuevo stock es mayor o igual a cero
        if (nuevoStock >= 0) {
          // Actualizar el documento del producto con el nuevo stock
          await this.productosCollection.doc(productoId.toString()).update({ stock: nuevoStock });
          console.log('Stock actualizado correctamente.');
        } else {
          // Si el nuevo stock es negativo, establecer el stock en cero
          await this.productosCollection.doc(productoId.toString()).update({ stock: 0 });
          console.log('El producto se ha agotado.');
        }
  
        return true; // Devolver true para indicar que se actualizó el stock correctamente
      } else {
        throw new Error('El producto no existe en la base de datos.');
      }
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      return false; // Devolver false para indicar que hubo un error al actualizar el stock
    }
  }
  
  // Verifica si hay suficiente stock para agregar al carrito
  verificarStockSuficiente(productoId: string, cantidad: number): Observable<boolean> {
    return this.getProductoById(productoId).pipe(
      map(producto => !!producto && producto.stock >= cantidad),
      catchError(() => {
        console.error('Error al verificar el stock.');
        return [];
      })
    );
  }

  // Agrega un producto al carrito si hay suficiente stock
  agregarAlCarrito(producto: Producto, cantidad: number): Observable<boolean> {
    return this.verificarStockSuficiente(producto.id_producto.toString(), cantidad).pipe(
      map(suficiente => {
        if (suficiente) {
          this.carritoService.agregarAlCarrito(producto, cantidad);
        }
        return suficiente;
      })
    );
  }

// Método para obtener los 5 productos con menor stock, considerando como bajo un stock menor o igual a 10
getProductosBajoStock(): Observable<Producto[]> {
  return this.firestore.collection<Producto>('productos', ref => 
    ref.where('stock', '<=', 10)
       .orderBy('stock', 'asc')
       .limit(5)
  ).valueChanges({ idField: 'id_producto' });
}
  // Método para buscar productos por nombre
  buscarProductoPorNombre(nombre: string): Observable<Producto[]> {
    return this.firestore.collection<Producto>('productos', ref =>
      ref.where('nombre_producto', '==', nombre)
    ).valueChanges({ idField: 'id_producto' });
  }
}
