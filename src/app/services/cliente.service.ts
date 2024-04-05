import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private clientesCollection: AngularFirestoreCollection<Cliente>;

  constructor(private firestore: AngularFirestore) {
    this.clientesCollection = this.firestore.collection<Cliente>('clientes');
  }
 // Método para obtener un proveedor por su nombre
 getClienteByNombre(nombre: string): Observable<Cliente | undefined> {
  return this.firestore.collection<Cliente>('clientes', ref =>
    ref.where('nombre_cliente', '==', nombre)
  ).valueChanges({ idField: 'id' }).pipe(
    map(clientes => {
      if (clientes && clientes.length > 0) {
        return { ...clientes[0], id: clientes[0].id } as Cliente;
      } else {
        return undefined;
      }
    })
  );
}
  // Método para obtener todos los proveedores
  getClientes(): Observable<Cliente[]> {
    return this.clientesCollection.valueChanges({ idField: 'id' });
  }

  async agregarCliente(cliente: Cliente): Promise<any> {
    try {
      const docRef = await this.clientesCollection.add(cliente);
      const idDocumento = docRef.id;
      
      // Asignar el ID del documento al atributo id_proveedor del proveedor
      cliente.id_cliente = idDocumento;
  
      // Actualizar el documento con el ID del documento asignado como id_proveedor
      await docRef.update({ id_cliente: idDocumento });
  
      return docRef;
    } catch (error) {
      console.error('Error al agregar cliente:', error);
      throw error;
    }
  }
  
  


  // Método para obtener un proveedor por su ID
  getClienteById(id: string): Observable<Cliente | undefined> {
    return this.clientesCollection.doc<Cliente>(id).valueChanges().pipe(
      map(cliente => cliente ? { ...cliente, id } as Cliente : undefined)
    );
  }

// Método para actualizar un proveedor
actualizarCliente(id: string, data: any): Promise<void> {
  return this.clientesCollection.doc(id).update(data);
}

  // Método para eliminar un proveedor
  eliminarCliente(id: string): Promise<void> {
    return this.clientesCollection.doc(id).delete();
  }
}
