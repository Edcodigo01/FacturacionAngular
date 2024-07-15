import { HttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  ElementRef,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { MatSort } from '@angular/material/sort';
import { ValidatorsService } from '../../../../services/validators.service';

import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-listado-productos',
  templateUrl: './listado-productos.component.html',
  styleUrls: ['./listado-productos.component.css'],
})
export class ListadoProductosComponent {
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private toastrS: ToastrService,
    private configM: NgbModalConfig,
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService,
    private authS: AuthService
  ) {
    configM.backdrop = 'static';
  }

  @Output()
  sendToF = new EventEmitter<any>();
  @Input() almacenes: any = [];
  @Input() categorias: any = [];
  @Input() inModal: boolean;
  @Input() innerWidth: number;
  @ViewChild(MatSort, { static: true }) sort: any;
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild('modalDetalleProducto') modalDetalleProducto!: ElementRef;
  @Input() productos = [];

  user_id: number;
  busquedaGeneral = '';
  btn_borrar_busqueda = false;
  codigoBarra = '';
  mat_table_loaded = false;
  url = environment.api_url + 'inventario/productos';
  columns: string[] = ['resumen', 'codigo', 'descripcion', 'precio','stock'];
  currentPage = 1;

  perPage = 10;
  dataSource: any;
  loading = false;
  selected: any = [];
  edit: any = '';
  busqueda = '';
  filtrosstring: any;
  actions: any;
  form: any = FormGroup;
  almacen_id: any = '';
  categoria_id: any = '';

  totales: any = {
    subtotal_iva: 0,
    iva: 0,
    no_iva: 0,
    descuento: 0,
    total_sin_iva: 0,
    total: 0,
  };
  previusData = [];

  timerStart = Date.now();

  ngOnInit() {
    this.user_id = this.authS.getId();
    this.almacenSelected();
    this.categorias.push({ id: '', nombre: 'Todas' });
    if (this.productos.length == 0) {
      this.getData();
    } else {
      this.initDataSourceTable(this.productos);
    }
  }

  getNameAlmacen(almacen_id:number){
    let almacen = this.almacenes.filter((el:any)=>el.id == almacen_id);
    return almacen[0].nombre;
  }

  almacenSelected() {
    if (this.almacenes.length != 0) {
      let almacenStorage = this.getLocale('almacen_id');

      let existStorage = [];
      if (almacenStorage) {
        existStorage = this.almacenes.filter(
          (el: any) => el.id == Number(almacenStorage)
        );
      }

      if (almacenStorage && existStorage.length == 1) {
        this.almacen_id = Number(almacenStorage);
      } else {
        this.almacen_id = this.almacenes[0].id;
      }
    }
  }

  getData() {
    this.loading = true;
    return this.http
      .get(
        `${this.url}?almacen_id=${this.almacen_id}&categoria_id=${this.categoria_id}`
      )
      .subscribe(
        (response: any) => {
          this.sendToF.emit({ action: 'preproductos', value: response });
          this.initDataSourceTable(response);
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
  }

  initDataSourceTable(response: any) {
    if (!this.mat_table_loaded) {
      this.dataSource = new MatTableDataSource([]);
    }
    this.dataSource.filterPredicate = function (data:any,filter:any) {
      return data.codigo.toLowerCase().includes(filter) || data.descripcion.toLowerCase().includes(filter);
   }
    this.dataSource.data = response;
    this.dataSource.paginator = this.paginator;
    this.loading = false;
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.sort.sort({ id: 'id', start: 'desc' });
  }

  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }

  doFilter(event:any) {
    this.codigoBarra = "";
    let filterValue = '';
    if(event){
       filterValue = event.target.value;
    }
    
    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.paginator.firstPage();
  } 

  buscarCodigoBarra() {
    this.busquedaGeneral = "";
    if (!this.codigoBarra) {
      return;
    }
    let p: any = this.productos.filter(
      (p: any) => p.codigo == this.codigoBarra
    );
    if (p.length != 0) {
      const { almacenes, ...res } = p[0];
      this.sendToFather('addProducto', res);
    } else {
      this.toastrS.warning(
        'No se encontro un producto con el código: "' +
          this.codigoBarra +
          '" en el almacén seleccionado.'
      );
    }
    this.codigoBarra = '';
  }

  filtrar() {}

  addProducto(p: any) {
    this.sendToFather('addProducto', p);
  }

  openModal(modal: any, edit: any = false, size: any = false) {
    if (edit) {
      this.edit = edit;
    } else {
      this.edit = '';
    }
    this.modalService.open(modal, { size: size ? size : 'lg' });
  }

  hideModal() {
    this.modalService.dismissAll();
  }

  getLocale(name: string) {
    return localStorage.getItem(`${this.user_id}_listado_p_${name}`);
  }

  setLocale(name: string, value: any) {
    localStorage.setItem(`${this.user_id}_listado_p_${name}`, value);
  }

  sendToFather(action: string, value: any) {
    this.sendToF.emit({ action: action, value: value });
  }
}
// this.modalService.dismissAll();
