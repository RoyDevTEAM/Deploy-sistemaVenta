// venta.model.ts
export interface Venta {
    id_venta: number;
    id_descuento: number;
    id_cliente: number;
    id_usuario: string;
    fecha_venta: Date;
    tipo_pago: string;
    total_venta: number;
    nombre_cliente?: string;

  }