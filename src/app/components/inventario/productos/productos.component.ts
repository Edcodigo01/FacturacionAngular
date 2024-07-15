import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TableComponent } from '../../shared/table/table.component';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
})
export class ProductosComponent {
  title = 'Productos';
  edit: any = {};
  table = {
    filtros: '?estado=Activos',
    url: environment.api_url + 'inventario/productos',
    url_enable_delete_lots: `${environment.api_url}inventario/productos-habilitar-eliminar-lote`,
    url_disabled: `${environment.api_url}inventario/productos-deshabilitar/`,
    columns: [
      { name: 'Acc.', field: 'actions', type: '' },
      { name: 'Descripción', field: 'descripcion', type: '' },
      { name: 'Código', field: 'codigo', type: '' },
      { name: 'P. compra', field: 'precio_compra', type: '' },
      { name: 'P. venta', field: 'precio_venta', type: '' },
     
    ],
    actions: [
      {
        numbre: '',
        ico: 'fas fa-edit',
        tooltip: 'Editar',
        class: 'btn-primary',
        function: 'modal-edit',
      },
      {
        numbre: '',
        ico: 'fas fa-ban',
        tooltip: 'Deshabilitar',
        class: 'btn-danger',
        function: 'modal-disable',
      },
    ],
  };
  loading = false;
  cargarTabla = true;
  datosFiltros = [];

  @ViewChild('formFiltros') formFiltros!: ElementRef;
  @ViewChild('modalAdd') modalAdd!: ElementRef;
  @ViewChild(TableComponent) childTable: any;

  constructor(
    private modalService: NgbModal,
    private configM: NgbModalConfig,
    private toastS: ToastrService,
    private titleS: Title,
    private http: HttpClient
  ) {
    this.titleS.setTitle(this.title);
    configM.backdrop = 'static';
  }

  // Luego de inicie se inica FiltrosComponent, este devuelve los filtros por emición, al recibirse se activa la tabla q listara los datos desde la api
  ngOnInit(){
    this.getRecursos();
  }

  openModal(modalAdd: any, edit: any = false, size: any = false) {
    let sizem = 'lg';
    if (edit) {
      this.edit = edit;
    } else {
      this.edit = {};
    }
    this.modalService.open(modalAdd, { size: size ? size : 'xl' });
  }

  receivedToChild(e: any) {
    if (e.action == 'closeModal') {
      this.modalService.dismissAll();
    } else if (e.action == 'modal-edit') {
      this.openModal(this.modalAdd, e.value);
    } else if (e.action == 'success') {
      this.success(e.value);
    } else if (e.action == 'filtros') {
      this.table.filtros = e.value;
      setTimeout(() => {
        if (this.cargarTabla == true) {
          this.childTable.getItems();
        } else {
          this.cargarTabla = true;
        }
      }, 100);
    }
  }

  success(message: any) {
    this.childTable.getItems();
    this.modalService.dismissAll();
    this.toastS.success(message);
  }

  getRecursos() {
    this.http.get(`${this.table.url}-recursos`).subscribe(
      (response: any) => {
        console.log(response);
        this.datosFiltros = response;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }
}
