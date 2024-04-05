import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Compra } from '../models/compra.model';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private comprasCollection: AngularFirestoreCollection<Compra>;
  compras: Observable<Compra[]>;

  constructor(private firestore: AngularFirestore) {
    this.comprasCollection = this.firestore.collection<Compra>('compras');
    this.compras = this.comprasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las compras
  getCompras(): Observable<Compra[]> {
    return this.compras;
  }

  // Método para agregar una nueva compra
  async agregarCompra(compra: Compra): Promise<any> {
    const numCompras = await this.comprasCollection.ref.get().then(snapshot => snapshot.size);
    compra.id_compra = (numCompras + 1);
    return this.comprasCollection.add(compra);
  }

  // Método para obtener una compra por su ID
  getCompraById(id: string): Observable<Compra | undefined> {
    return this.comprasCollection.doc<Compra>(id).valueChanges().pipe(
      map(compra => compra ? { ...compra, id } as Compra : undefined)
    );
  }

  // Método para actualizar una compra
  actualizarCompra(id: string, data: any): Promise<void> {
    return this.comprasCollection.doc(id).update(data);
  }

  // Método para eliminar una compra
  eliminarCompra(id: string): Promise<void> {
    return this.comprasCollection.doc(id).delete();
  }

  // Método para obtener compras filtradas por algún criterio
  getComprasFiltradas(filtro: any): Observable<Compra[]> {
    return this.firestore.collection<Compra>('compras', ref => {
      let query: firebase.default.firestore.CollectionReference | firebase.default.firestore.Query = ref;
      // Aplicar los filtros necesarios según el criterio que desees
      if (filtro.fecha) {
        query = query.where('fecha_compra', '==', filtro.fecha);
      }
      if (filtro.proveedor) {
        query = query.where('id_proveedor', '==', filtro.proveedor);
      }

      return query;
    }).valueChanges({ idField: 'id' });
  }
}
