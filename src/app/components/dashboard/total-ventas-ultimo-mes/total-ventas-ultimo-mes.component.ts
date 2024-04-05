import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-total-ventas-ultimo-mes',
  templateUrl: './total-ventas-ultimo-mes.component.html',
  styleUrls: ['./total-ventas-ultimo-mes.component.css']
})
export class TotalVentasUltimoMesComponent implements OnInit {
  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.ventaService.generarReporteVentasUltimoMes().subscribe(
      ventas => {
        if (ventas.length > 0) {
          const ventasAgrupadas = this.agruparVentasPorFecha(ventas);
          this.renderChart(ventasAgrupadas);
        } else {
          console.warn('No hay ventas para el último mes.');
        }
      },
      error => {
        console.error('Error al obtener las ventas del último mes:', error);
      }
    );
  }

  private agruparVentasPorFecha(ventas: any[]): any[] {
    const ventasAgrupadas: any = {};
    ventas.forEach(venta => {
      const fecha = new Date(venta.fecha_venta.seconds * 1000).toLocaleDateString();
      ventasAgrupadas[fecha] = (ventasAgrupadas[fecha] || 0) + venta.total_venta;
    });
    return Object.entries(ventasAgrupadas).map(([fecha, total_venta]) => ({ fecha, total_venta }));
  }

  renderChart(ventasAgrupadas: any[]): void {
    const labels = ventasAgrupadas.map(venta => venta.fecha);
    const data = ventasAgrupadas.map(venta => venta.total_venta);

    const ctx = document.getElementById('chartContainer') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento con id "chartContainer".');
      return;
    }

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Total de Ventas',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Total de Ventas'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Fecha de Venta'
            }
          }
        }
      }
    });
  }
}
