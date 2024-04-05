export interface PagoCredito {
  id_pago_credito: number;
  fecha_pago: Date;
  monto_pagado: number;
  saldo_pendiente: number;
  monto_cuota: number; // Nuevo atributo añadido
}
