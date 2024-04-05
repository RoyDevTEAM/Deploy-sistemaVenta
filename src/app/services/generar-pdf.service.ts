import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Venta } from '../models/venta.model';
import { DetalleVenta } from '../models/detalle-venta.model';
import { AuthService } from './auth.service';
import { ProductoService } from './producto.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GenerarPdfService {

  constructor(
    private authService: AuthService,
    private productoService: ProductoService
  ) { }

  generarPDF(venta: Venta, detallesVenta: DetalleVenta[]): void {
    this.authService.getUserName().subscribe(userName => {
      const doc = new jsPDF();
      let posY = 20;

      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('Symetrica', 105, posY, { align: 'center' });
      posY += 10;

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Comprobante de Venta', 105, posY, { align: 'center' });
      posY += 10;
      doc.setFontSize(14);
      doc.text(`ID de Venta: ${venta.id_venta}`, 10, posY);
      posY += 7;
      doc.text(`Fecha: ${venta.fecha_venta.toISOString()}`, 10, posY);
      posY += 7;
      doc.text(`Usuario: ${userName}`, 10, posY); // Mostrar el nombre del usuario
      posY += 10;

      const columns = ['Producto', 'Cantidad', 'Precio Unitario'];
      const data = detallesVenta.map(detalle => {
        // Obtener el nombre del producto en lugar de su ID
        return this.obtenerNombreProducto(detalle.id_producto).subscribe(nombre => {
          return [nombre, detalle.cantidad.toString(), detalle.subtotal.toString()];
        });
      });

      const options = {
        startY: posY,
        head: [columns],
        body: data
      };

      (doc as any).autoTable(options);

      posY += data.length * 7 + 20; // Agregamos un espacio fijo para la fila del total

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: ${venta.total_venta}`, 10, posY);

      doc.save('factura.pdf');
    });
  }

  obtenerNombreProducto(idProducto: number): Observable<string> {
    return this.productoService.getProductoById(idProducto.toString()).pipe(map(producto => {
      return producto ? producto.nombre_producto : ''; // Si el producto existe, devolver su nombre, de lo contrario devolver una cadena vacía
    }));
  }
}
