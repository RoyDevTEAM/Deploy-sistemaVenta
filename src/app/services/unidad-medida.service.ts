import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UnidadMedida } from '../models/unidad-medida.model';

@Injectable({
  providedIn: 'root'
})
export class UnidadMedidaService {
  private unidadesMedidaCollection: AngularFirestoreCollection<UnidadMedida>;

  constructor(private firestore: AngularFirestore) {
    this.unidadesMedidaCollection = this.firestore.collection<UnidadMedida>('unidades_medida');
  }

  // Método para obtener todas las unidades de medida
  getUnidadesMedida(): Observable<UnidadMedida[]> {
    return this.unidadesMedidaCollection.valueChanges({ idField: 'id' });
  }

  // Método para agregar una nueva unidad de medida
  agregarUnidadMedida(unidadMedida: UnidadMedida): Promise<any> {
    return this.unidadesMedidaCollection.add(unidadMedida);
  }

  // Método para obtener una unidad de medida por su ID
  getUnidadMedidaById(id: string): Observable<UnidadMedida | undefined> {
    return this.unidadesMedidaCollection.doc<UnidadMedida>(id).valueChanges().pipe(
      map(unidadMedida => unidadMedida ? { ...unidadMedida, id } as UnidadMedida : undefined)
    );
  }
  
  // Método para obtener una unidad de medida por su nombre
  getUnidadMedidaByNombre(nombre: string): Observable<UnidadMedida | undefined> {
    return this.firestore.collection<UnidadMedida>('unidades_medida', ref =>
      ref.where('nombre_medida', '==', nombre)
    ).valueChanges({ idField: 'id' }).pipe(
      map(unidades => {
        if (unidades && unidades.length > 0) {
          return { ...unidades[0], id: unidades[0].id } as UnidadMedida;
        } else {
          return undefined;
        }
      })
    );
  }

  // Método para actualizar una unidad de medida
  actualizarUnidadMedida(id: string, data: any): Promise<void> {
    return this.unidadesMedidaCollection.doc(id).update(data);
  }

  // Método para eliminar una unidad de medida
  eliminarUnidadMedida(id: string): Promise<void> {
    return this.unidadesMedidaCollection.doc(id).delete();
  }
}
