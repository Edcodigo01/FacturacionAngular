import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LoginComponent } from './components/auth/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { HomeComponent } from './components/home/home.component';
import { VentasComponent } from './components/documentos/ventas/ventas.component';
import { ProductosComponent } from './components/inventario/productos/productos.component';
import { AlmacenesComponent } from './components/inventario/almacenes/almacenes.component';
import { CategoriasComponent } from './components/inventario/categorias/categorias.component';
import { ClientesComponent } from './components/users/clientes/clientes.component';
import { TableComponent } from './components/shared/table/table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AddClienteComponent } from './components/users/clientes/add-cliente/add-cliente.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { FiltrosComponent } from './components/shared/filtros/filtros.component';
import { ModalDisableComponent } from './components/shared/modals/modal-disable/modal-disable.component';
import { ModalEnableComponent } from './components/shared/modals/modal-enable/modal-enable.component';
import { ModalDeleteComponent } from './components/shared/modals/modal-delete/modal-delete.component';
import { ModalEnableLotsComponent } from './components/shared/modals/modal-enable-lots/modal-enable-lots.component';
import { ModalDeleteLotsComponent } from './components/shared/modals/modal-delete-lots/modal-delete-lots.component';
import { MatSortModule } from '@angular/material/sort';
import { AddAlmacenComponent } from './components/inventario/almacenes/add-almacen/add-almacen.component';
import { AddCategoriaProductoComponent } from './components/inventario/categorias/add-categoria-producto/add-categoria-producto.component';
import { AddProductoComponent } from './components/inventario/productos/add-producto/add-producto.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FacturarComponent } from './components/documentos/ventas/facturar/facturar.component';
import { DatosClienteComponent } from './components/documentos/shared/datos-cliente/datos-cliente.component';
import { ClientesListaComponent } from './components/documentos/shared/datos-cliente/clientes-lista/clientes-lista.component';
import { DetallesFacturaComponent } from './components/documentos/shared/detalles-factura/detalles-factura.component';
import { PreciosAdicionalesComponent } from './components/inventario/precios-adicionales/precios-adicionales.component';
import { AddPrecioAdicionalComponent } from './components/inventario/precios-adicionales/add-precio-adicional/add-precio-adicional.component';
import { TotalesComponent } from './components/documentos/shared/totales/totales.component';
import { ListadoProductosComponent } from './components/documentos/shared/listado-productos/listado-productos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    VentasComponent,
    ProductosComponent,
    AlmacenesComponent,
    CategoriasComponent,
    ClientesComponent,
    TableComponent,
    AddClienteComponent,
    AutofocusDirective,
    FiltrosComponent,
    ModalDisableComponent,
    ModalEnableComponent,
    ModalDeleteComponent,
    ModalEnableLotsComponent,
    ModalDeleteLotsComponent,
    AddAlmacenComponent,
    AddCategoriaProductoComponent,
    AddProductoComponent,
    FacturarComponent,
    DatosClienteComponent,
    ClientesListaComponent,
    DetallesFacturaComponent,
    PreciosAdicionalesComponent,
    AddPrecioAdicionalComponent,
    TotalesComponent,
    ListadoProductosComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 4500,
      positionClass: 'toast-top-center',
      closeButton:true,
      maxOpened:3,
      autoDismiss:true
      // preventDuplicates: true,
    }),
    NgbModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    NgSelectModule,
  ],

  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
