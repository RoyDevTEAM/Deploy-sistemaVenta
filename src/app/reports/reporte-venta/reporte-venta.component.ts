import { Component, OnInit } from '@angular/core';
import { Venta } from '../../models/venta.model';
import { Cliente } from '../../models/cliente.model';
import { VentaService } from '../../services/venta.service';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as ngxPrint from 'ngx-print';
import { saveAs } from 'file-saver'; // Importa saveAs directamente
import { Timestamp } from '@firebase/firestore';


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';
import { ClientesService } from '../../services/cliente.service';

@Component({
  selector: 'app-reporte-venta',
  templateUrl: './reporte-venta.component.html',
  styleUrls: ['./reporte-venta.component.css']
})
export class ReporteVentaComponent implements OnInit {
  ventas: Venta[] = [];
  clientes: Cliente[] = [];
  filtroFechaInicio: Date = new Date();
  filtroFechaFin: Date = new Date();
  filtroTipoPago: string = '';
  totalVentas: number = 0;

  constructor(
    private ventaService: VentaService,
    private clientesService: ClientesService,
    private ngxPrintService: ngxPrint.NgxPrintService
  ) { }

  ngOnInit(): void {
    this.obtenerVentas();
    this.obtenerClientes();
  }

  obtenerVentas(): void {
    this.ventaService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
      this.calcularTotalVentas();
    });
  }

  obtenerClientes(): void {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  calcularTotalVentas(): void {
    this.totalVentas = this.ventas.reduce((total, venta) => total + venta.total_venta, 0);
  }

  filtrarVentas(): void {
    // Verificar si se han seleccionado fechas de inicio y fin
    if (!this.filtroFechaInicio || !this.filtroFechaFin) {
      alert('Debe seleccionar fechas de inicio y fin para filtrar las ventas.');
      return;
    }
  
    // Construir el objeto de filtro
    const filtro: any = {
      fechaInicio: this.filtroFechaInicio,
      fechaFin: this.filtroFechaFin,
      tipoPago: this.filtroTipoPago
    };
  
    // Llamar al servicio para obtener las ventas filtradas
    this.ventaService.getVentasFiltradas(filtro).subscribe(
      ventasFiltradas => {
        // Actualizar la lista de ventas con los resultados filtrados
        this.ventas = ventasFiltradas;
  
        // Calcular el total de ventas nuevamente
        this.calcularTotalVentas();
      },
      error => {
        // Manejar errores, si es necesario
        console.error('Error al obtener las ventas filtradas:', error);
      }
    );
  }
  
  imprimirPDF(): void {
    const tableBody = this.ventas.map(venta => [
      venta.id_venta.toString(),
      this.getNombreCliente(venta.id_cliente.toString()),
      venta.fecha_venta ? this.formatShortDate(venta.fecha_venta) : '',
      venta.tipo_pago,
      venta.total_venta.toString()
    ]);

    const documentDefinition: any = {
      content: [
        { text: 'Reporte de Ventas', style: 'header' },
        { text: `Fecha de inicio: ${this.filtroFechaInicio ? this.formatShortDate(this.filtroFechaInicio) : ''} - Fecha de fin: ${this.filtroFechaFin ? this.formatShortDate(this.filtroFechaFin) : ''}`, style: 'subheader' }, // Formatear las fechas de inicio y fin si existen
        { text: `Tipo de Pago: ${this.filtroTipoPago || 'Todos'}`, style: 'subheader' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['ID Venta', 'ID Cliente', 'Fecha Venta', 'Tipo Pago', 'Total Venta'], // Encabezados de la tabla
              ...tableBody // Filas de la tabla
            ]
          }
        },
        { text: `Total Ventas: ${this.totalVentas}`, bold: true, alignment: 'right', margin: [0, 20, 0, 0] }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 20] },
        subheader: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] }
      }
    };

    pdfMake.createPdf(documentDefinition).download('reporte_ventas.pdf');
  }

  formatShortDate(date: any): string {
    if (!date) return ''; // Manejar caso de fecha nula
  
    // Si la fecha es un objeto Timestamp de Firestore, convertirlo a un objeto Date
    if (date.toDate) {
      date = date.toDate();
    }
  
    // Formatear la fecha como se desee
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true
    };
  
    return date.toLocaleString('es-ES', options); // Utilizar toLocaleString para formatear la fecha
  }
  

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');
    worksheet.addRow(['ID Venta', 'ID Cliente', 'Fecha Venta', 'Tipo Pago', 'Total Venta']);
    this.ventas.forEach(venta => {
      worksheet.addRow([venta.id_venta, this.getNombreCliente(venta.id_cliente.toString()), venta.fecha_venta.toDateString(), venta.tipo_pago, venta.total_venta]);
    });
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte_ventas.xlsx');
    });
  }

  imprimir(): void {
    const printOptions: ngxPrint.PrintOptions = {
      printSectionId: 'section-to-print',
      printTitle: 'Reporte de Ventas',
      useExistingCss: false,
      bodyClass: 'ngx-print section-to-print',
      openNewTab: false,
      previewOnly: false,
      closeWindow: false,
      printDelay: 0
    };
    this.ngxPrintService.print(printOptions);
  }

  getNombreCliente(idCliente: string): string {
    const cliente = this.clientes.find(c => c.id_cliente.toString() === idCliente);
    return cliente ? `${cliente.nombre_cliente} ${cliente.apellido_cliente}` : 'Cliente no encontrado';
  }
}