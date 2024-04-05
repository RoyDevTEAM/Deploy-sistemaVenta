import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proveedor } from '../models/proveedores.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {
  private proveedoresCollection: AngularFirestoreCollection<Proveedor>;

  constructor(private firestore: AngularFirestore) {
    this.proveedoresCollection = this.firestore.collection<Proveedor>('proveedores');
  }
 // Método para obtener un proveedor por su nombre
 getProveedorByNombre(nombre: string): Observable<Proveedor | undefined> {
  return this.firestore.collection<Proveedor>('proveedores', ref =>
    ref.where('nombre_proveedor', '==', nombre)
  ).valueChanges({ idField: 'id' }).pipe(
    map(proveedores => {
      if (proveedores && proveedores.length > 0) {
        return { ...proveedores[0], id: proveedores[0].id } as Proveedor;
      } else {
        return undefined;
      }
    })
  );
}
  // Método para obtener todos los proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.proveedoresCollection.valueChanges({ idField: 'id' });
  }

  async agregarProveedor(proveedor: Proveedor): Promise<any> {
    try {
      const docRef = await this.proveedoresCollection.add(proveedor);
      const idDocumento = docRef.id;
      
      // Asignar el ID del documento al atributo id_proveedor del proveedor
      proveedor.id_proveedor = idDocumento;
  
      // Actualizar el documento con el ID del documento asignado como id_proveedor
      await docRef.update({ id_proveedor: idDocumento });
  
      return docRef;
    } catch (error) {
      console.error('Error al agregar proveedor:', error);
      throw error;
    }
  }
  
  


  // Método para obtener un proveedor por su ID
  getProveedorById(id: string): Observable<Proveedor | undefined> {
    return this.proveedoresCollection.doc<Proveedor>(id).valueChanges().pipe(
      map(proveedor => proveedor ? { ...proveedor, id } as Proveedor : undefined)
    );
  }

// Método para actualizar un proveedor
actualizarProveedor(id: string, data: any): Promise<void> {
  return this.proveedoresCollection.doc(id).update(data);
}

  // Método para eliminar un proveedor
  eliminarProveedor(id: string): Promise<void> {
    return this.proveedoresCollection.doc(id).delete();
  }
}
