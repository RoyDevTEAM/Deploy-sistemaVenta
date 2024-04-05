// detalle-compra.model.ts
export interface DetalleCompra {
    id_detalle_compra: string;
    id_producto: string;
    id_compra: string;
    cantidad_detalle_compra: number;
    precio_compra: number;
    fecha_vencimiento_producto: Date;
    subtotal_compra: number;
  }
  