import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private rolesCollection: AngularFirestoreCollection<Rol>;

  constructor(private firestore: AngularFirestore) {
    this.rolesCollection = this.firestore.collection<Rol>('roles');
  }

  // Método para obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.rolesCollection.valueChanges({ idField: 'id_rol' });
  }

  // Método para agregar un nuevo rol
  async agregarRol(rol: Rol): Promise<any> {
    const numRoles = await this.rolesCollection.ref.get().then(snapshot => snapshot.size);
    rol.id_rol = numRoles + 1;
    return this.rolesCollection.add(rol);
  }

  // Método para obtener un rol por su ID
getRolById(id: string): Observable<Rol | undefined> {
  return this.rolesCollection.doc<Rol>(id).snapshotChanges().pipe(
    map(snapshot => {
      const data = snapshot.payload.data();
      const id_rol = snapshot.payload.id;
      // Verificar si existe data antes de asignar el id_rol
      return data ? { ...data, id_rol: parseInt(id_rol) } as Rol : undefined;
    })
  );
}


  // Método para actualizar un rol
  actualizarRol(id: string, data: any): Promise<void> {
    return this.rolesCollection.doc(id).update(data);
  }

  // Método para eliminar un rol
  eliminarRol(id: string): Promise<void> {
    return this.rolesCollection.doc(id).delete();
  }

  // Método para obtener roles por nombre
  getRolesPorNombre(nombre: string): Observable<Rol[]> {
    return this.firestore.collection<Rol>('roles', ref =>
      ref.where('rol', '==', nombre)
    ).valueChanges({ idField: 'id_rol' });
  }
}
