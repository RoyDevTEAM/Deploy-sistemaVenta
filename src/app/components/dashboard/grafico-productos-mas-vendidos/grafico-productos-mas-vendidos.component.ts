import { Component, OnInit } from '@angular/core';
import Chart, { ChartType } from 'chart.js/auto';
import { DetalleVentaService } from '../../../services/detalle-venta.service';

@Component({
  selector: 'app-grafico-productos-mas-vendidos',
  templateUrl: './grafico-productos-mas-vendidos.component.html',
  styleUrls: ['./grafico-productos-mas-vendidos.component.css']
})
export class GraficoProductosMasVendidosComponent implements OnInit {
  productosPopulares: { nombre: string, cantidadVendida: number }[] = [];
  private chart: Chart | null = null; // Referencia al gráfico

  constructor(private detalleVentaService: DetalleVentaService) { }

  ngOnInit(): void {
    this.detalleVentaService.obtenerProductosPopulares().subscribe(
      productos => {
        console.log('Productos populares recibidos:', productos); // Para depuración
        this.productosPopulares = productos;
        if (productos.length > 0) {
          this.renderBarChart(productos); // Cambia a renderBarChart
        }
      },
      error => {
        console.error('Error al obtener los productos más vendidos:', error);
      }
    );
  }

  renderBarChart(productos: { nombre: string, cantidadVendida: number }[]): void {
    // Destruye el gráfico anterior si existe
    if (this.chart) {
      this.chart.destroy();
    }

    const nombres = productos.map(producto => producto.nombre);
    const cantidades = productos.map(producto => producto.cantidadVendida);

    const ctx = document.getElementById('myChart') as HTMLCanvasElement; // Cambiar a myChart para seguir las convenciones
    if (!ctx) {
      console.error('No se encontró el elemento con id "myChart".');
      return;
    }

    this.chart = new Chart(ctx, {
      type: 'bar' as ChartType, // Cambiar a 'bar'
      data: {
        labels: nombres,
        datasets: [{
          label: 'Cantidad Vendida', // Etiqueta para el conjunto de datos
          data: cantidades,
          backgroundColor: 'rgba(0, 123, 255, 0.5)', // Un color sólido para todas las barras
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        indexAxis: 'y', // Poner en 'y' para barras horizontales, quitar para barras verticales
        scales: {
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}
