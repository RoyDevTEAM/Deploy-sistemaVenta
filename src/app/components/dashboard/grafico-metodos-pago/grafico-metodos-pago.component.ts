import { Component, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-grafico-metodos-pago',
  templateUrl: './grafico-metodos-pago.component.html',
  styleUrls: ['./grafico-metodos-pago.component.css']
})
export class GraficoMetodosPagoComponent implements OnInit {

  constructor(private ventaService: VentaService) { }

  ngOnInit(): void {
    this.ventaService.generarReporteDistribucionTipoPago().subscribe(
      metodosPago => {
        this.renderChart(metodosPago);
      },
      error => {
        console.error('Error al obtener los métodos de pago:', error);
      }
    );
  }

  renderChart(metodosPago: { tipo_pago: string; total_ventas: number }[]): void {
    const labels = metodosPago.map(metodo => metodo.tipo_pago);
    const data = metodosPago.map(metodo => metodo.total_ventas);

    const ctx = document.getElementById('metodosPagoChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('No se encontró el elemento con id "metodosPagoChart".');
      return;
    }

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Métodos de Pago'
          }
        }
      }
    });
  }

}
