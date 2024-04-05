import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categoriasCollection: AngularFirestoreCollection<Categoria>;

  constructor(private firestore: AngularFirestore) {
    this.categoriasCollection = this.firestore.collection<Categoria>('categorias');
  }

  // Método para obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.categoriasCollection.valueChanges({ idField: 'id' });
  }

  // Método para agregar una nueva categoría
  agregarCategoria(categoria: Categoria): Promise<any> {
    return this.categoriasCollection.add(categoria);
  }

  // Método para obtener una categoría por su ID
  getCategoriaById(id: string): Observable<Categoria | undefined> {
    return this.categoriasCollection.doc<Categoria>(id).valueChanges().pipe(
      map(categoria => categoria ? { ...categoria, id } as Categoria : undefined)
    );
  }
  
  // Método para obtener una categoría por su nombre
  getCategoriaByNombre(nombre: string): Observable<Categoria | undefined> {
    return this.firestore.collection<Categoria>('categorias', ref =>
      ref.where('nombre_categoria', '==', nombre)
    ).valueChanges({ idField: 'id' }).pipe(
      map(categorias => {
        if (categorias && categorias.length > 0) {
          return { ...categorias[0], id: categorias[0].id } as Categoria;
        } else {
          return undefined;
        }
      })
    );
  }

  // Método para actualizar una categoría
  actualizarCategoria(id: string, data: any): Promise<void> {
    return this.categoriasCollection.doc(id).update(data);
  }

  // Método para eliminar una categoría
  eliminarCategoria(id: string): Promise<void> {
    return this.categoriasCollection.doc(id).delete();
  }
}
