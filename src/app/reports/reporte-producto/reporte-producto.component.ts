import { Component, OnInit } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as FileSaver from 'file-saver';
import * as ngxPrint from 'ngx-print';
import { Producto } from '../../models/producto.model';
import { ProductoService } from '../../services/producto.service';
import { SubcategoriaService } from '../../services/subcategoria.service'; // Agregamos el servicio de subcategoría
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver'; // Importa saveAs directamente

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';

@Component({
  selector: 'app-reporte-producto',
  templateUrl: './reporte-producto.component.html',
  styleUrls: ['./reporte-producto.component.css']
})
export class ReporteProductoComponent implements OnInit {
  productos: Producto[] = [];
  subcategorias: string[] = [];
  selectedSubcategoria: string = '';
  stockMinimo: number = 10;

  constructor(
    private productoService: ProductoService,
    private subcategoriaService: SubcategoriaService, // Inyectamos el servicio de subcategoría
    private ngxPrintService: ngxPrint.NgxPrintService
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerSubcategorias();
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  obtenerSubcategorias(): void {
    this.subcategoriaService.getSubcategorias().subscribe(subcategorias => { // Utilizamos el servicio de subcategoría para obtener las subcategorías
      this.subcategorias = subcategorias.map(subcategoria => subcategoria.nombre_subcategoria);
    });
  }

  imprimirPDF(): void {
    const tableBody = this.productos.map(producto => [
      producto.id_producto,
      producto.nombre_producto,
      producto.descripcion_producto,
      producto.precio_producto.toString(),
      producto.stock.toString()
    ]);
  
    const documentDefinition: any = {
      content: [
        { text: 'Reporte de Productos', style: 'header' },
        { text: '\n' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
            body: [
              ['ID', 'Nombre', 'Descripción', 'Precio', 'Stock'], // Encabezados de la tabla
              ...tableBody // Filas de la tabla
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: 'center', margin: [0, 0, 0, 20] }
      }
    };
  
    pdfMake.createPdf(documentDefinition).download('reporte_productos.pdf');
  }
  
  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('Productos');

    worksheet.addRow(['ID', 'Nombre', 'Descripción', 'Precio', 'Stock']);

    this.productos.forEach(producto => {
      worksheet.addRow([producto.id_producto, producto.nombre_producto, producto.descripcion_producto, producto.precio_producto, producto.stock]);
    });

    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'reporte_productos.xlsx'); // Utiliza saveAs directamente
    });
  }

  imprimir(): void {
    const printOptions: ngxPrint.PrintOptions = {
      printSectionId: 'section-to-print',
      printTitle: 'Reporte de Productos',
      useExistingCss: false,
      bodyClass: 'ngx-print section-to-print',
      openNewTab: false,
      previewOnly: false,
      closeWindow: false,
      printDelay: 0
    };
    this.ngxPrintService.print(printOptions);
  }

  filtrarPorSubcategoria(): void {
    if (this.selectedSubcategoria !== '') {
      this.productos = this.productos.filter(producto => producto.nombre_subcategoria === this.selectedSubcategoria);
    } else {
      this.obtenerProductos();
    }
  }

  filtrarPorStockBajo(): void {
    this.productos = this.productos.filter(producto => producto.stock <= this.stockMinimo);
  }
}
