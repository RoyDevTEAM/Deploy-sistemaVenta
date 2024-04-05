import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { ClienteComponent } from './components/cliente/cliente.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { VentaComponent } from './components/venta/venta.component';
import { ProductoComponent } from './components/producto/producto.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProveedoresComponent } from './components/proveedores/proveedores.component';
import { AcercaDeComponent } from './components/acerca-de/acerca-de.component';
import { ReporteComponent } from './components/reporte/reporte.component';
import { CompraComponent } from './components/compra/compra.component';
import { ReporteVentaComponent } from './reports/reporte-venta/reporte-venta.component'; // Importa el componente de reporte de ventas
import { ReporteCompraComponent } from './reports/reporte-compra/reporte-compra.component'; // Importa el componente de reporte de compras
import { ReporteClienteComponent } from './reports/reporte-cliente/reporte-cliente.component'; // Importa el componente de reporte de clientes
import { ReporteProductoComponent } from './reports/reporte-producto/reporte-producto.component'; // Importa el componente de reporte de productos

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { IsSellerGuard } from './guards/isSeller.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard], // Protege el acceso al dashboard
    children: [
      { path: 'cliente', component: ClienteComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'usuario', component: UsuarioComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'venta', component: VentaComponent, canActivate: [AuthGuard] }, // Protege el acceso solo para el vendedor
      { path: 'producto', component: ProductoComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'proveedores', component: ProveedoresComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'acerca-de', component: AcercaDeComponent }, // Acceso abierto
      { path: 'reporte', component: ReporteComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'compra', component: CompraComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
      { path: 'reports', children: [ // Rutas para la carpeta de reports como subruta de dashboard
        { path: 'reporte-venta', component: ReporteVentaComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
        { path: 'reporte-compra', component: ReporteCompraComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
        { path: 'reporte-cliente', component: ReporteClienteComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
        { path: 'reporte-producto', component: ReporteProductoComponent, canActivate: [AdminGuard] }, // Protege el acceso solo para el admin
        // Agrega aquí más rutas de reportes si es necesario
      ]}
    ]
  },
  // Redirecciona a dashboard si ninguna ruta coincide
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
