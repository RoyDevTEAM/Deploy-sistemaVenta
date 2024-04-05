import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual$: Observable<any>; // Cambiado el tipo de Observable
  isLoggedIn$: Observable<boolean>;

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.usuarioActual$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.collection<Usuario>('usuarios').doc<any>(user.uid).valueChanges();
        } else {
          // Si no hay usuario, devolvemos un Observable nulo
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error en AuthService:', error);
        return of(null);
      })
    );

    this.isLoggedIn$ = this.afAuth.authState.pipe(
      map(user => !!user),
      tap(isLoggedIn => {
        localStorage.setItem('userLoggedIn', isLoggedIn ? 'true' : 'false');
      })
    );
  }
    // Método para comprobar si el usuario está autenticado
  isLoggedIn(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  // Método para obtener el nombre del usuario
  getUserName(): Observable<string> {
    return this.usuarioActual$.pipe(map(usuario => usuario ? usuario.nombre_usuario : ''));
  }

  // Método para registrar un usuario con correo electrónico y contraseña
  async registerWithEmail(
    email: string,
    password: string,
    usuario: Usuario
  ): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = credential.user;

      if (user) {
        await this.createUserProfile(user.uid, email, usuario);
      } else {
        throw new Error('El usuario no se ha creado correctamente.');
      }
    } catch (error) {
      throw error;
    }
  }

  private async createUserProfile(
  uid: string,
  email: string,
  usuario: Usuario
): Promise<void> {
  try {
    await this.firestore.collection('usuarios').doc(uid).set({
      ...usuario,
      id_usuario: uid,
      email: email, // Utiliza el correo electrónico como nombre de usuario
      contrasena: null // No almacena la contraseña en el perfil de usuario
    });
  } catch (error) {
    throw error;
  }
}


  // Método para iniciar sesión con correo electrónico y contraseña
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('userLoggedIn', 'true'); // Almacenar estado de inicio de sesión en localStorage
    } catch (error) {
      throw error;
    }
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('userLoggedIn'); // Eliminar estado de inicio de sesión de localStorage al cerrar sesión
    } catch (error) {
      throw error;
    }
  }

 // Método para comprobar si el usuario es administrador
isAdmin(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        return of(false); // Si no hay usuario, devuelve false
      } else {
        return this.firestore.collection('usuarios', ref => ref.where('id_usuario', '==', user.uid)).valueChanges().pipe(
          map((usuarios: any[]) => {
            // Comprueba si el usuario tiene el rol de administrador
            return usuarios.some(usuario => usuario.id_rol === 'ebWvklPGlRK5kLKMXss9'); // Suponiendo que el ID del rol de administrador es 1
          })
        );
      }
    })
  );
}

// Método para comprobar si el usuario es vendedor
isSeller(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        return of(false); // Si no hay usuario, devuelve false
      } else {
        return this.firestore.collection('usuarios', ref => ref.where('id_usuario', '==', user.uid)).valueChanges().pipe(
          map((usuarios: any[]) => {
            // Comprueba si el usuario tiene el rol de vendedor
            return usuarios.some(usuario => usuario.id_rol === 2); // Suponiendo que el ID del rol de vendedor es 2
          })
        );
      }
    })
  );
}

}
