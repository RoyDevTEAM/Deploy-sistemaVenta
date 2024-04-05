import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Subcategoria } from '../models/subcategoria.model';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriaService {
  private subcategoriasCollection: AngularFirestoreCollection<Subcategoria>;

  constructor(private firestore: AngularFirestore) {
    this.subcategoriasCollection = this.firestore.collection<Subcategoria>('subcategorias');
  }

  // Método para obtener todas las subcategorías
  getSubcategorias(): Observable<Subcategoria[]> {
    return this.subcategoriasCollection.valueChanges({ idField: 'id_subcategoria' });
  }

  // Método para agregar una nueva subcategoría
  agregarSubcategoria(subcategoria: Subcategoria): Promise<any> {
    return this.subcategoriasCollection.add(subcategoria);
  }

  // Método para obtener una subcategoría por su ID
  getSubcategoriaById(id: string): Observable<Subcategoria | undefined> {
    return this.subcategoriasCollection.doc<Subcategoria>(id).valueChanges().pipe(
      map(subcategoria => subcategoria ? { ...subcategoria, id } as Subcategoria : undefined)
    );
  }
  
  // Método para obtener una subcategoría por su nombre
  getSubcategoriaByNombre(nombre: string): Observable<Subcategoria | undefined> {
    return this.firestore.collection<Subcategoria>('subcategorias', ref =>
      ref.where('nombre_subcategoria', '==', nombre)
    ).valueChanges({ idField: 'id' }).pipe(
      map(subcategorias => {
        if (subcategorias && subcategorias.length > 0) {
          return { ...subcategorias[0], id: subcategorias[0].id } as Subcategoria;
        } else {
          return undefined;
        }
      })
    );
  }

  // Método para actualizar una subcategoría
  actualizarSubcategoria(id: string, data: any): Promise<void> {
    return this.subcategoriasCollection.doc(id).update(data);
  }

  // Método para eliminar una subcategoría
  eliminarSubcategoria(id: string): Promise<void> {
    return this.subcategoriasCollection.doc(id).delete();
  }
}
