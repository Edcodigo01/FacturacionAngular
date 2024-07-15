import { Component, ElementRef, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { TableComponent } from '../../shared/table/table.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-precios-adicionales',
  templateUrl: './precios-adicionales.component.html',
  styleUrls: ['./precios-adicionales.component.css'],
})
export class PreciosAdicionalesComponent {
  title = 'Precios ad. de productos';
  edit: any = {};
  table = {
    url: environment.api_url + 'inventario/precios-adicionales-productos',
    columns: [
      { name: 'Acc.', field: 'actions', type: '' },
      { name: 'Descripción.', field: 'descripcion', type: '' },
      { name: '% ganancia.', field: 'porcentaje_ganancia', type: '' },
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
        ico: 'fas fa-times-circle',
        tooltip: 'Eliminar',
        class: 'btn-danger',
        function: 'modal-delete',
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

  ngAfterViewInit() {
    this.childTable.getItems();
  }

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
    } 
  }

  success(message: any) {
    this.childTable.getItems();
    this.modalService.dismissAll();
    this.toastS.success(message);
  }
}
