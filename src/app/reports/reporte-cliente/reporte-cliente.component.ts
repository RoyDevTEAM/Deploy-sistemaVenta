import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import * as ngxPrint from 'ngx-print';
import { ClientesService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.model';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-reporte-cliente',
  templateUrl: './reporte-cliente.component.html',
  styleUrls: ['./reporte-cliente.component.css']
})
export class ReporteClienteComponent implements OnInit {
  clientes: Cliente[] = [];
  apellido: string = '';

  constructor(private clientesService: ClientesService, private ngxPrintService: ngxPrint.NgxPrintService) { }

  ngOnInit(): void {
    this.obtenerClientes();
  }

  obtenerClientes(): void {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  imprimirPDF(): void {
    const tableBody = this.clientes.map(cliente => [
      cliente.nombre_cliente,
      cliente.apellido_cliente,
      cliente.numero_carnet,
      cliente.telefono,
      cliente.direccion,
      cliente.estado
    ]);
  
    const documentDefinition: any = {
      content: [
        { text: 'Reporte de Clientes', style: 'header' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['Nombre', 'Apellido', 'Carnet', 'Teléfono', 'Dirección'], // Encabezados de la tabla
              ...tableBody // Filas de la tabla
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 20] }
      }
    };
  
    pdfMake.createPdf(documentDefinition).download('reporte_clientes.pdf');
  }
  
  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Clientes');

    worksheet.addRow(['Nombre', 'Apellido', 'Carnet', 'Teléfono', 'Dirección']);

    this.clientes.forEach(cliente => {
      worksheet.addRow([cliente.nombre_cliente, cliente.apellido_cliente, cliente.numero_carnet, cliente.telefono, cliente.direccion]);
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte_clientes.xlsx'); // Utiliza saveAs directamente
    });
  }


  imprimir(): void {
    const printOptions: ngxPrint.PrintOptions = {
      printSectionId: 'section-to-print',
      printTitle: 'Reporte clientes',
      useExistingCss: false,
      bodyClass: 'ngx-print section-to-print',
      openNewTab: false,
      previewOnly: false,
      closeWindow: false,
      printDelay: 0
    };
    this.ngxPrintService.print(printOptions);
  }
}
