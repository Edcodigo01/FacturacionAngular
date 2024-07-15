import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent {
  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private toastS: ToastrService,
    private configM: NgbModalConfig
  ) {
    configM.backdrop = 'static';
  }

  @Input() title: any;
  @Input() nameDataResponse: any;
  @Input() predata: any = false;
  @Input() url: any;
  @Input() url_disabled: any;
  @Input() url_delete: any;
  @Input() url_enable_delete_lots: string = '';
  @Input() filtrosstring: any = '';
  @Input() columns: any;
  @Input() actions: any;
  @Input() multiselect: boolean = false;

  @Input() footerTotales = false;
  @Input() footerNoTotales: any = [];
  @Input() hideBtnLotes = false;
  @Input() prebusqueda: any = false;
  @Input() premitirSeleccion: any = false;

  @Output()
  sendToF = new EventEmitter<any>();

  @ViewChild('empTbSort') empTbSort = new MatSort();
  @ViewChild(MatPaginator) paginator: MatPaginator = <MatPaginator>{};
  @ViewChild(MatSort, { static: true }) sort: any;

  @ViewChild('modalEnable') modalEnable!: ElementRef;
  @ViewChild('modalEnableLots') modalEnableLots!: ElementRef;
  @ViewChild('modalDeleteLots') modalDeleteLots!: ElementRef;
  @ViewChild('modalDisable') modalDisable!: ElementRef;
  @ViewChild('modalDelete') modalDelete!: ElementRef;

  loading:boolean;
  displayedColumns: string[] = [];
  dataSource: any;
  empresaselec = '';
  loaded = false;
  dataCount = 0;
  selected: any = [];
  selectAllcheck: boolean = false;
  btnLotes: boolean = false;

  btnDeshabilitar = true;
  edit_id = '';
  busqueda = '';

  ngOnInit() {
    //lA TABLA SE INICIA DESDE EL COMPONENTE PADRE PARA TENER LISTO LOS FILTROS, EXCEPTO CUANDO RECIBE "PREDATA" PREVIAMENTE
    this.displayedColumns = this.columns.map((t: any) => t.field);
    this.dataSource = new MatTableDataSource([]);

    if (this.predata) {
      this.initDataSourceTable(this.predata);
    }
  }

  getItems() {
    this.loading = true;

    return this.http.get(this.url + this.filtrosstring).subscribe(
      (response: any) => {
        console.log('table');
        console.log(response);
        let dataTable;
        if (this.nameDataResponse) {
          dataTable = response[this.nameDataResponse];
        } else if (response?.data) {
          dataTable = response.data;
        } else {
          dataTable = response;
        }
        this.initDataSourceTable(dataTable);
      },
      (error) => {
        this.loading = false;
        this.loaded = true;
      }
    );
  }

  initDataSourceTable(dataTable: any) {
    console.log(dataTable);
    let selectableByFilter = false;
    this.selectAllcheck = false;
    if (this.filtrosstring?.includes('estado=Deshabilitados')) {
      selectableByFilter = true;
      this.btnDeshabilitar = false;
    } else {
      this.btnDeshabilitar = true;
    }

    if (this.multiselect || selectableByFilter) {
      let exist = this.columns.filter((e: any) => {
        return e.field == 'select';
      });
      if (!exist[0]) {
        this.columns.unshift({ field: 'select', name: '' });
      }
      this.btnLotes = true;
    } else {
      this.columns = this.columns.filter((e: any) => {
        return e.field != 'select';
      });
      this.btnLotes = false;
    }
    this.displayedColumns = this.columns.map((t: any) => t.field);

    if (this.nameDataResponse) {
      this.dataSource.data = dataTable;
    } else {
      this.dataSource.data = dataTable;
    }

    this.loaded = true;
    this.loading = false;
    this.dataCount = Object.keys(this.dataSource.data).length;


    if (this.prebusqueda) {
      this.busqueda = this.prebusqueda.trim();
      this.dataSource.filter = this.prebusqueda.trim().toLocaleLowerCase();
    }
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel = 'Por pág:';
    this.dataSource.sort = this.sort;
    this.sort.sort({ id: 'id', start: 'desc' });
    this.dataSource.paginator = this.paginator;


  }
  pageEvents(e: any) {
    this.selectAllcheck = false;
    let elementPageNow = this.dataSource.connect().value;
    elementPageNow.forEach((element: any) => {
      element.selected = false;
    });
    this.selected = [];
  }

  sendToFather(action: any, value: any) {
    if (action == 'modal-disable') {
      this.openModal(this.modalDisable, value.id, 'sm');
      return;
    } else if (action == 'modal-delete') {
      this.openModal(this.modalDelete, value.id, 'sm');
      return;
    }
    this.sendToF.emit({ action: action, value: value });
  }

  doFilter = (val: any) => {
    var value = val.target.value;
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  selectAllRow(e: any) {
    let elementPageNow = this.dataSource.connect().value;
    if (e.srcElement.checked) {
      elementPageNow.forEach((element: any) => {
        element.selected = true;
      });
      this.selected = elementPageNow;
    } else {
      elementPageNow.forEach((element: any) => {
        element.selected = false;
      });
      this.selected = [];
    }
  }

  selectRow(e: any) {
    console.log(e.target.checked);

    let value = e.target.value;
    let checked = e.target.checked;
    let selected = this.selected;

    let exist = selected.filter((el: any) => {
      return el.id == value;
    });

    let elementPageNow = this.dataSource.connect().value;
    if (checked) {
      let nselected = elementPageNow.filter((el: any) => {
        return el.id == value;
      });
      selected.push(nselected[0]);
    } else {
      selected = selected.filter((el: any) => {
        return el.id != value;
      });
    }

    this.selected = selected;
    if (this.selected.length == elementPageNow.length) {
      this.selectAllcheck = true;
    } else {
      this.selectAllcheck = false;
    }
  }

  success(message: any) {
    this.getItems();
    this.modalService.dismissAll();
    this.toastS.success(message);
  }

  receivedToChild(e: any) {
    console.log(e);
    if (e.action == 'closeModal') {
      this.modalService.dismissAll();
    } else if (e.action == 'success') {
      this.success(e.value);
    }
  }
  // MODALS
  openModal(modal: any, edit: any = false, size: any = false) {
    if (edit) {
      this.edit_id = edit;
    } else {
      this.edit_id = '';
    }
    this.modalService.open(modal, { size: size ? size : 'lg' });
  }

  formatNumber(n: number) {
    return Number(n).toFixed(2);
  }

  formatDate(d: any) {
    return moment(d).format('DD-MM-YYYY');
  }

  for(value: any) {
    return value.map((t: any) => t.name);
  }

  sumaTotal(col: any) {
    if (this.footerNoTotales.includes(col.field)) {
      return '';
    }

    if (isNaN(this.dataSource.data[0][col.field])) {
      return 'TOTAL';
    }

    let total = this.dataSource.data
      .map((t: any) => t[col.field])
      .reduce((acc: any, value: any) => Number(acc) + Number(value), 0);

    return Number(total).toFixed(2);
  }

  actionsExcept(actions: any) {
    if (!this.btnDeshabilitar) {
      return this.actions.filter((e: any) => e.function != 'modal-disable');
    }
    return this.actions;
  }

  seleccion(sel: any,field:any) {
    if (this.premitirSeleccion && field != 'action') {
      this.sendToFather('seleccion', sel);
    }
  }

  guardarSeleccion(){
    this.sendToFather('seleccionados',this.selected)
  }
}
