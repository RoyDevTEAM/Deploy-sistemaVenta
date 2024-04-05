import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentaComponent } from './components/venta/venta.component';
import { ProductoComponent } from './components/producto/producto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { HeaderComponent } from './components/shared/header/header.component';
import { FooterComponent } from './components/shared/footer/footer.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { TotalVentasUltimoMesComponent } from './components/dashboard/total-ventas-ultimo-mes/total-ventas-ultimo-mes.component';
import { GraficoVentasMesComponent } from './components/dashboard/grafico-ventas-mes/grafico-ventas-mes.component';
import { GraficoProductosMasVendidosComponent } from './components/dashboard/grafico-productos-mas-vendidos/grafico-productos-mas-vendidos.component';
import { GraficoMetodosPagoComponent } from './components/dashboard/grafico-metodos-pago/grafico-metodos-pago.component';
import { CardMetasVentasComponent } from './components/dashboard/card-metas-ventas/card-metas-ventas.component';
import { CardProductosBajosStockComponent } from './components/dashboard/card-productos-bajos-stock/card-productos-bajos-stock.component';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { CompraComponent } from './components/compra/compra.component';
import { PagoCreditoComponent } from './components/pago-credito/pago-credito.component';
import { ReporteClienteComponent } from './reports/reporte-cliente/reporte-cliente.component';
import { ReporteProductoComponent } from './reports/reporte-producto/reporte-producto.component';
import { ReporteVentaComponent } from './reports/reporte-venta/reporte-venta.component';
import { ReporteCompraComponent } from './reports/reporte-compra/reporte-compra.component';

@NgModule({
  declarations: [
    AppComponent,
    ClienteComponent,
    UsuarioComponent,
    VentaComponent,
    ProductoComponent,
    DashboardComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    ProveedoresComponent,
    AcercaDeComponent,
    ReporteComponent,
    TotalVentasUltimoMesComponent,
    GraficoVentasMesComponent,
    GraficoProductosMasVendidosComponent,
    GraficoMetodosPagoComponent,
    CardMetasVentasComponent,
    CardProductosBajosStockComponent,
    CompraComponent,
    PagoCreditoComponent,
    ReporteClienteComponent,
    ReporteProductoComponent,
    ReporteVentaComponent,
    ReporteCompraComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    MatOptionModule,
    MatAutocompleteModule,
    MatInputModule,
    CommonModule,
    MatSnackBarModule,
    ChartModule,
    HighchartsChartModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
