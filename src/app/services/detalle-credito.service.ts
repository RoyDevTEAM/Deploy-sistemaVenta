import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetalleCredito } from '../models/detalle-credito.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleCreditoService {
  private detalleCreditoCollection: AngularFirestoreCollection<DetalleCredito>;

  constructor(private firestore: AngularFirestore) {
    this.detalleCreditoCollection = this.firestore.collection<DetalleCredito>('detalle_credito');
  }

  // Método para obtener todos los detalles de crédito
  getDetallesCredito(): Observable<DetalleCredito[]> {
    return this.detalleCreditoCollection.valueChanges({ idField: 'id' });
  }

   // Método para agregar un nuevo detalle de crédito
   async agregarDetalleCredito(detalleCredito: DetalleCredito): Promise<any> {
    const numDetallesCredito = await this.detalleCreditoCollection.ref.get().then(snapshot => snapshot.size);
    detalleCredito.id_detalle_credito = (numDetallesCredito + 1);
    return this.detalleCreditoCollection.add(detalleCredito);
  }

  // Método para obtener un detalle de crédito por su ID
  getDetalleCreditoById(id: string): Observable<DetalleCredito | undefined> {
    return this.detalleCreditoCollection.doc<DetalleCredito>(id).valueChanges().pipe(
      map(detalleCredito => detalleCredito ? { ...detalleCredito, id } as DetalleCredito : undefined)
    );
  }

  // Método para actualizar un detalle de crédito
  actualizarDetalleCredito(id: string, data: any): Promise<void> {
    return this.detalleCreditoCollection.doc(id).update(data);
  }

  // Método para eliminar un detalle de crédito
  eliminarDetalleCredito(id: string): Promise<void> {
    return this.detalleCreditoCollection.doc(id).delete();
  }
}
