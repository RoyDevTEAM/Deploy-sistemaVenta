// proveedor.model.ts
export interface Proveedor {
    id_proveedor: string;
    nombre_proveedor: string;
    contacto_proveedor: string;
    direccion_proveedor: string;
    telefono_proveedor: string;
    nit_proveedor: string;
    email_proveedor: string;
    estado: string; //  activo o inactivo
  }