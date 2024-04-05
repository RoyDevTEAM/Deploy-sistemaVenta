import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosCollection: AngularFirestoreCollection<Usuario>;
  usuarios: Observable<Usuario[]>;

  constructor(private firestore: AngularFirestore) {
    this.usuariosCollection = this.firestore.collection<Usuario>('usuarios');
    this.usuarios = this.usuariosCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Usuario;
          const id = action.payload.doc.id;
          return { id, ...data } as Usuario;
        });
      })
    );
  }

  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios;
  }
// Método para agregar un nuevo usuario con ID automático

async agregarUsuario(usuario: Usuario): Promise<any> {
  const numProductos = await this.usuariosCollection.ref.get().then(snapshot => snapshot.size);
  usuario.id_usuario = (numProductos + 1).toString();
  return this.usuariosCollection.add(usuario);
}

  // Método para obtener un usuario por su ID
  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.usuariosCollection.doc<Usuario>(id).valueChanges().pipe(
      map(usuario => usuario ? { ...usuario, id } as Usuario : undefined)
    );
  }

  // Método para actualizar un usuario
  actualizarUsuario(id: string, data: any): Promise<void> {
    return this.usuariosCollection.doc(id).update(data);
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: string): Promise<void> {
    return this.usuariosCollection.doc(id).delete();
  }
// Método para obtener todos los roles
getRoles(): Observable<any[]> {
  return this.firestore.collection('roles').valueChanges();
}

  // Método para obtener el nombre del rol de un usuario
  obtenerRolUsuario(idUsuario: string): Observable<string | undefined> {
    return this.getUsuarioById(idUsuario).pipe(
      switchMap((usuario: Usuario | undefined) => {
        if (!usuario || !usuario.id_rol) {
          return of(undefined);
        }
        return this.firestore.doc(`roles/${usuario.id_rol}`).valueChanges().pipe(
          map((rol: any) => rol ? rol.nombre : undefined)
        );
      })
    );
  }

  // Método para obtener el número de ventas realizadas por un usuario
  obtenerNumeroVentasUsuario(idUsuario: string): Observable<number> {
    // Suponiendo que tengas una colección de ventas y cada venta tenga un campo 'id_usuario'
    return this.firestore.collection<any>('ventas', ref =>
      ref.where('id_usuario', '==', idUsuario)
    ).valueChanges().pipe(
      map(ventas => ventas.length)
    );
  }
}
