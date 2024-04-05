// producto.model.ts
export interface Producto {
    id_producto: string;
    id_unidad_medida: string;
    id_subcategoria: string;
    nombre_producto: string;
    precio_producto: number;
    descripcion_producto: string;
    stock: number;
    nombre_subcategoria?: string;

  }