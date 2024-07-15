import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuardService } from './guards/auth-guard.service';
import { ProductosComponent } from './components/inventario/productos/productos.component';
import { CategoriasComponent } from './components/inventario/categorias/categorias.component';
import { AlmacenesComponent } from './components/inventario/almacenes/almacenes.component';
import { VentasComponent } from './components/documentos/ventas/ventas.component';
import { ClientesComponent } from './components/users/clientes/clientes.component';
import { FacturarComponent } from './components/documentos/ventas/facturar/facturar.component';
import { PreciosAdicionalesComponent } from './components/inventario/precios-adicionales/precios-adicionales.component';

const routes: Routes = [
  {
    path: 'iniciar-sesion',
    component: LoginComponent,
    // canActivate: [],
  },
  // {
  //   path: 'Inicio',
  //   pathMatch: 'full',
  //   component: FacturarComponent,
  //   canActivate: [AuthGuardService],
  // },

  // {
  //   path: '/user',
  //   component: User,
  //   children: [
  //     { path: ':id', component: UserWithParam, name: 'Usernew' }
  //   ]
  // }

  {
    path: 'facturar',
    // pathMatch: 'full',
    component: FacturarComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: ':id',
        component: FacturarComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
  // {
  //   path: 'facturar/:id',
  //   pathMatch: 'full',
  //   component: FacturarComponent,
  //   canActivate: [AuthGuardService],
  // },
  {
    path: 'ventas',
    component: VentasComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: 'inventario',
    children: [
      {
        path: 'productos',
        component: ProductosComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'precios-adicionales',
        component: PreciosAdicionalesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'categorias',
        component: CategoriasComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'almacenes',
        component: AlmacenesComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },

  {
    path: 'clientes',
    component: ClientesComponent,
    canActivate: [AuthGuardService],
  },
  { path: '**', pathMatch: 'full', redirectTo: 'facturar' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
