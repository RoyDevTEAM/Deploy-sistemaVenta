import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, from } from 'rxjs';
import { map, mergeMap, toArray } from 'rxjs/operators';
import { DetalleVenta } from '../models/detalle-venta.model';
import { ProductoService } from './producto.service';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private detalleVentaCollection: AngularFirestoreCollection<DetalleVenta>;

  constructor(
    private firestore: AngularFirestore,
    private productoService: ProductoService
  ) {
    this.detalleVentaCollection = this.firestore.collection<DetalleVenta>('detalle_ventas');
  }

  getDetallesVenta(): Observable<DetalleVenta[]> {
    return this.detalleVentaCollection.valueChanges({ idField: 'id' });
  }

  async agregarDetalleVenta(detalleVenta: DetalleVenta): Promise<any> {
    const numDetallesVenta = await this.detalleVentaCollection.ref.get().then(snapshot => snapshot.size);
    detalleVenta.id_detalle_venta = numDetallesVenta + 1;
    return this.detalleVentaCollection.add(detalleVenta);
  }

  getDetalleVentaById(id: string): Observable<DetalleVenta | undefined> {
    return this.detalleVentaCollection.doc<DetalleVenta>(id).valueChanges().pipe(
      map(detalleVenta => detalleVenta ? { ...detalleVenta, id } as DetalleVenta : undefined)
    );
  }

  actualizarDetalleVenta(id: string, data: any): Promise<void> {
    return this.detalleVentaCollection.doc(id).update(data);
  }

  eliminarDetalleVenta(id: string): Promise<void> {
    return this.detalleVentaCollection.doc(id).delete();
  }

  obtenerProductosPopulares(): Observable<{ nombre: string, cantidadVendida: number }[]> {
    return this.getDetallesVenta().pipe(
      mergeMap(detalles => {
        const ventasPorProducto: { [key: string]: number } = {};

        // Contar la cantidad vendida de cada producto
        detalles.forEach(detalle => {
          if (ventasPorProducto[detalle.id_producto.toString()]) {
            ventasPorProducto[detalle.id_producto.toString()] += detalle.cantidad;
          } else {
            ventasPorProducto[detalle.id_producto.toString()] = detalle.cantidad;
          }
        });

        // Obtener los nombres de los productos utilizando el servicio ProductoService
        const observables: Observable<{ nombre: string, cantidadVendida: number }>[] = [];
        Object.keys(ventasPorProducto).forEach(idProducto => {
          const nombreObservable = this.productoService.getProductoById(idProducto).pipe(
            map(producto => ({
              nombre: producto ? producto.nombre_producto : 'Nombre Desconocido',
              cantidadVendida: ventasPorProducto[idProducto]
            }))
          );
          observables.push(nombreObservable);
        });

        return from(observables).pipe(
          mergeMap(obs => obs),
          toArray()
        );
      })
    );
  }

  getDetallesVentaByIdVenta(idVenta: string): Observable<DetalleVenta[]> {
    return this.firestore.collection<DetalleVenta>('detalle_ventas', ref =>
      ref.where('id_venta', '==', idVenta)
    ).valueChanges({ idField: 'id' });
  }
}
