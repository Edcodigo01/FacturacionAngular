import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TableComponent } from '../../shared/table/table.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
})
export class CategoriasComponent {
  title = 'Categorías de productos';
  edit: any = {};
  table = {
    filtros: '?estado=Activos',
    url: environment.api_url + 'inventario/categorias',
    url_enable_delete_lots: `${environment.api_url}inventario/categorias-habilitar-eliminar-lote`,
    url_disabled: `${environment.api_url}inventario/categorias-deshabilitar/`,
    columns: [
      { name: 'Acc.', field: 'actions', type: '' },
      { name: 'Nombre.', field: 'nombre', type: '' },
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

  @ViewChild('formFiltros') formFiltros!: ElementRef;
  @ViewChild('modalAdd') modalAdd!: ElementRef;
  @ViewChild(TableComponent) childTable: any;

  constructor(
    private modalService: NgbModal,
    private configM: NgbModalConfig,
    private toastS: ToastrService,
    private titleS: Title
  ) {
    this.titleS.setTitle(this.title);
    configM.backdrop = 'static';
  }

  // ngOnInit(){
  // Este component espera a que inicie FiltrosComponent, este devuelve los filtros por emición, al recibirse se activa la tabla q listara los datos desde la api
  // }

  openModal(modalAdd: any, edit: any = false, size: any = false) {
    let sizem = 'lg';
    if (edit) {
      this.edit = edit;
    } else {
      this.edit = {};
    }
    this.modalService.open(modalAdd, { size: size ? size : 'sm' });
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
}
