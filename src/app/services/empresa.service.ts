import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Empresa } from '../models/empresa.model';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private empresasCollection: AngularFirestoreCollection<Empresa>;

  constructor(
    private firestore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.empresasCollection = this.firestore.collection<Empresa>('empresas');
  }

  // Método para obtener todas las empresas
  getEmpresas(): Observable<Empresa[]> {
    return this.empresasCollection.valueChanges({ idField: 'id_empresa' });
  }
  // Método para agregar una nueva empresa con su logo
   
  // Método para agregar una nueva empresa con su logo
  agregarEmpresa(empresa: Empresa, logoFile: File): Promise<any> {
    const filePath = `logos/${logoFile.name}`;
    const fileRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, logoFile);

    return new Promise<any>((resolve, reject) => {
      uploadTask.snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe(url => {
            empresa.logoUrl = url;
            this.empresasCollection.add(empresa)
              .then(() => resolve(undefined)) // No se necesita ningún argumento para resolve()
              .catch(error => reject(error));
          });
        })
      ).subscribe();
    });
  }
  // Método para actualizar una empresa
  actualizarEmpresa(id: string, data: any): Promise<void> {
    return this.empresasCollection.doc(id).update(data);
  }

  // Método para eliminar una empresa
  eliminarEmpresa(id: string): Promise<void> {
    return this.empresasCollection.doc(id).delete();
  }

  // Otros métodos que puedan ser necesarios...

}
