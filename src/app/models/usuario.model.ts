// usuario.model.ts
export interface Usuario {
   
    id_usuario: string;
    id_rol: number;
    nombre_usuario: string;
    apellido_usuario: string;
    numero_carnet: string;
    telefono: string;
    direccion: string;
    usuario: string; //correo electronico
    contrasena: string;
    rol?:string;
  }