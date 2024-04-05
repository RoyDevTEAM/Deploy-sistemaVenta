import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PagoCredito } from '../models/pago-credito.model';

@Injectable({
  providedIn: 'root'
})
export class PagoCreditoService {
  private pagoCreditoCollection: AngularFirestoreCollection<PagoCredito>;

  constructor(private firestore: AngularFirestore) {
    this.pagoCreditoCollection = this.firestore.collection<PagoCredito>('pago_credito');
  }

  // Método para obtener todos los pagos de crédito
  getPagosCredito(): Observable<PagoCredito[]> {
    return this.pagoCreditoCollection.valueChanges({ idField: 'id' });
  }
// Método para agregar un nuevo pago de crédito
async agregarPagoCredito(pagoCredito: PagoCredito): Promise<any> {
  const numPagosCredito = await this.pagoCreditoCollection.ref.get().then(snapshot => snapshot.size);
  pagoCredito.id_pago_credito = (numPagosCredito + 1);
  return this.pagoCreditoCollection.add(pagoCredito);
}

  // Método para obtener un pago de crédito por su ID
  getPagoCreditoById(id: string): Observable<PagoCredito | undefined> {
    return this.pagoCreditoCollection.doc<PagoCredito>(id).valueChanges().pipe(
      map(pagoCredito => pagoCredito ? { ...pagoCredito, id } as PagoCredito : undefined)
    );
  }

  // Método para actualizar un pago de crédito
  actualizarPagoCredito(id: string, data: any): Promise<void> {
    return this.pagoCreditoCollection.doc(id).update(data);
  }

  // Método para eliminar un pago de crédito
  eliminarPagoCredito(id: string): Promise<void> {
    return this.pagoCreditoCollection.doc(id).delete();
  }
}
