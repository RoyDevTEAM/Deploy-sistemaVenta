// compra.model.ts
export interface Compra {
    id_compra: number;
    fecha_compra: Date;
    precio_compra: number;
    descripcion_compra: string;
    total_compra: number;
    id_proveedor: string;
    id_usuario: string;
  }