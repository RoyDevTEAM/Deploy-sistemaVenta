// detalle-venta.model.ts
export interface DetalleVenta {
    id_detalle_venta: number;
    id_venta: number;
    id_producto: string;
    cantidad: number;
    subtotal: number;
  }