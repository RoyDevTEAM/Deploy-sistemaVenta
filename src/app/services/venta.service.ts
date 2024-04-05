import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Venta } from '../models/venta.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventasCollection: AngularFirestoreCollection<Venta>;
  ventas: Observable<Venta[]>;

  constructor(private firestore: AngularFirestore) {
    this.ventasCollection = this.firestore.collection<Venta>('ventas');
    this.ventas = this.ventasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return this.ventas;
  }
 // Método para agregar una nueva venta
 async agregarVenta(venta: Venta): Promise<any> {
  const numVentas = await this.ventasCollection.ref.get().then(snapshot => snapshot.size);
  venta.id_venta = (numVentas + 1);
  return this.ventasCollection.add(venta);
}
  // Método para obtener una venta por su ID
  getVentaById(id: string): Observable<Venta | undefined> {
    return this.ventasCollection.doc<Venta>(id).valueChanges().pipe(
      map(venta => venta ? { ...venta, id } as Venta : undefined)
    );
  }

  // Método para actualizar una venta
  actualizarVenta(id: string, data: any): Promise<void> {
    return this.ventasCollection.doc(id).update(data);
  }

  // Método para eliminar una venta
  eliminarVenta(id: string): Promise<void> {
    return this.ventasCollection.doc(id).delete();
  }

  // Método para obtener ventas filtradas por algún criterio
  getVentasFiltradas(filtro: any): Observable<Venta[]> {
    return this.firestore.collection<Venta>('ventas', ref => {
      let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      
      // Aplicar los filtros necesarios según el criterio que desees
      if (filtro.fechaInicio && filtro.fechaFin) {
        query = query.where('fecha_venta', '>=', filtro.fechaInicio).where('fecha_venta', '<=', filtro.fechaFin);
      }
      if (filtro.tipoPago) {
        query = query.where('tipo_pago', '==', filtro.tipoPago);
      }
  
      return query;
    }).valueChanges({ idField: 'id' });
  }
  

  generarReporteVentas(fechaInicio: Date, fechaFin: Date): Observable<Venta[]> {
    return this.firestore.collection<Venta>('ventas', ref =>
      ref.where('fecha_venta', '>=', fechaInicio)
         .where('fecha_venta', '<=', fechaFin)
    ).valueChanges({ idField: 'id' });
  }

  generarReporteVentasUltimoMes(): Observable<Venta[]> {
    // Calcular la fecha de hace un mes
    const fechaInicio = new Date();
    fechaInicio.setMonth(fechaInicio.getMonth() - 1);
    fechaInicio.setHours(0, 0, 0, 0);

    // Calcular la fecha de hoy
    const fechaFin = new Date();
    fechaFin.setHours(23, 59, 59, 999);

    return this.generarReporteVentas(fechaInicio, fechaFin);
  }
  generarReporteDistribucionTipoPago(): Observable<{ tipo_pago: string; total_ventas: number }[]> {
    return this.firestore.collection<Venta>('ventas').valueChanges({ idField: 'id' }).pipe(
      map(ventas => {
        const distribucion: { [key: string]: number } = {};
        ventas.forEach(venta => {
          const tipoPago = venta.tipo_pago;
          distribucion[tipoPago] = (distribucion[tipoPago] || 0) + venta.total_venta;
        });
        return Object.entries(distribucion).map(([tipo_pago, total_ventas]) => ({ tipo_pago, total_ventas }));
      })
    );
  }
  
}