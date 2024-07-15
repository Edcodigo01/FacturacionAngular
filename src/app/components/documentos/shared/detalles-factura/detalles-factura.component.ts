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

export interface Producto {
  id: number;
  descripcion: string;
  cantidad: number;
  precioOriginal: number;
  precio_venta: number;
  descuento: number;
  tipo_precio: string;
  almacenes: string;
}

@Component({
  selector: 'app-detalles-factura',
  templateUrl: './detalles-factura.component.html',
  styleUrls: ['./detalles-factura.component.css'],
})
export class DetallesFacturaComponent {
  @Output()
  sendToF = new EventEmitter<any>();
  @Input() almacenes: any = [];
  @Input() detalles: any = [];

  @Input() preciosadicionales: any = [];
  @ViewChild('modalListadoProductos') modalListadoProductos!: ElementRef;
  @ViewChild(MatSort, { static: true }) sort: any;

  columns: string[] = [
    'accion',
    'descripcion',
    'cantidad',
    'tipo_precio',
    'precio_venta',
    'descuento',
    'grabaiva',
    'total',
  ];

  dataSource: any;
  loading = false;
  loaded = false;
  selected: any = [];
  edit_id = '';
  busqueda = '';
  filtrosstring: any;
  actions: any;
  form: any = FormGroup;
  hideForm = false;
  almacen_id: any = '';
  totales: any = {
    subtotal_iva: 0,
    iva: 0,
    no_iva: 0,
    descuento: 0,
    total_sin_iva: 0,
    total: 0,
  };

  constructor(
    private http: HttpClient,
    private modalService: NgbModal,
    private toastS: ToastrService,
    private configM: NgbModalConfig,
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService
  ) {
    configM.backdrop = 'static';
  }

  ngOnInit() {
    if (this.almacenes.length != 0) {
      this.almacen_id = this.almacenes[0].id;
    }

    if (this.detalles.length != 0) {
      this.initDataSourceTable(this.detalles);
    }else{
      this.initDataSourceTable([]);
    }

    // this.detalles.forEach((element: Producto) => {
    //   this.addProducto(element);
    // });
  }

  initDataSourceTable(dataTable: any) {
    this.dataSource = new MatTableDataSource([]);
    this.dataSource.data = dataTable;
    this.loaded = true;
    this.loading = false;
    this.createForm();
    this.calcularTotales();
  }

  createForm(data: any = null) {
    if (!data) {
      data = this.dataSource.data;
      console.log('DATA RECIBIDA');
    }
    let formFields: any = [];
    data.forEach((e: any, i: any) => {
      formFields['precio_venta_' + i] = [
        data[i].precio_venta,
        [Validators.required, this.validatorsS.number],
      ];
      formFields['cantidad_' + i] = [
        data[i].cantidad,
        [Validators.required, this.validatorsS.number],
      ];
      formFields['total_' + i] = [
        data[i].total,
        [Validators.required, this.validatorsS.number],
      ];
      formFields['grabaiva_' + i] = [data[i].grabaiva];
      formFields['tipo_precio_' + i] = [data[i].tipo_precio];
      formFields['descuento_' + i] = [
        data[i].descuento,
        [Validators.required, this.validatorsS.number],
      ];
    });
    this.form = this.formBuilder.group(formFields);
    console.log(this.form);
    this.hideForm = false;
  }

  validarForm() {
    this.form.markAllAsTouched();
    if (this.form.status == 'INVALID') {
      return;
    }
    return true;
  }

  addProducto(p: any) {
    const data = this.dataSource.data;

    let exist: any = '';
    let count = 0;
    data.forEach((el: any, index: any) => {
      if (el.producto_id == p.producto_id) {
        count++;
        exist = index;
      }
    });

    if (count != 0) {
      const cantidad = Number(this.dataSource.data[exist].cantidad) + 1;
      this.dataSource.data[exist].cantidad = cantidad;

      setTimeout(() => {
        this.createForm();
        this.calcularTotalProducto(exist);
        // this.form.controls['cantidad_' + exist].setValue(cantidad);
      }, 200);
    } else {
      p.producto_id = p.id;
      p.cantidad = 1;
      p.precioOriginal = p.precio_venta;
      p.precio_venta = p.precio_venta;
      p.descuento = 0;
      p.tipo_precio = 'Predefinido';

      const { almacenes, id, created_at, updated_at, venta_id, ...res } = p;
      const producto = JSON.parse(JSON.stringify(res));

      data.unshift(producto);

      this.createForm(data); //  crea el form con los campos validacion nuevos para evitar error
      this.dataSource.data = data;
      setTimeout(() => {
        this.createForm(); //crea el form de nuevo actualizando los datos correctamente con los index
        this.calcularTotalProducto(0);
      }, 200);
    }
  }

  eliminarDetalle(i: number) {
    const data = this.dataSource.data.filter((el: any, index: any) => {
      return i != index;
    });
    this.dataSource.data = data;
    setTimeout(() => {
      this.createForm();
      this.calcularTotales();
    }, 200);
  }

  calcularTotalProducto(i: any) {
    let total_sin_iva =
      this.form.controls['cantidad_' + i].value *
        this.form.controls['precio_venta_' + i].value -
      this.form.controls['descuento_' + i].value;

    let total: any = total_sin_iva;
    let total_iva = 0;

    const grabaiva = this.form.controls['grabaiva_' + i].value;
    if (grabaiva) {
      total_iva = (total_sin_iva * 12) / 100;
      total += total_iva;
    }
    total = Number(total).toFixed(2);

    this.dataSource.data[i].total_iva = total_iva;
    this.dataSource.data[i].total_sin_iva = total_sin_iva;
    this.dataSource.data[i].cantidad =
      this.form.controls['cantidad_' + i].value;
    this.dataSource.data[i].tipo_precio =
      this.form.controls['tipo_precio_' + i].value;
    this.dataSource.data[i].precio_venta_ =
      this.form.controls['precio_venta_' + i].value;
    this.dataSource.data[i].descuento =
      this.form.controls['descuento_' + i].value;
    this.dataSource.data[i].grabaiva =
      this.form.controls['grabaiva_' + i].value;
    this.dataSource.data[i].total = total;
    this.form.controls['total_' + i].setValue(total);
    this.calcularTotales();
  }

  // updateArrayData(
  //   i: any,
  //   total: any = null,
  //   total_iva: any = null,
  //   total_sin_iva: any = null
  // ) {

  // }

  validarCamposTabla() {}

  cambiarPrecio(i: any) {
    this.dataSource.data[i].tipo_precio = 'Otro';
    this.calcularTotalProducto(i);
  }

  cambiarTipoPrecio(e: any, i: any) {
    let id = e.target.value;
    let exist = this.preciosadicionales.filter((el: any) => el.id == id);
    let precio_venta = 0;
    if (exist.length != 0) {
      precio_venta =
        (exist[0].porcentaje_ganancia *
          this.dataSource.data[i].precioOriginal) /
          100 +
        this.dataSource.data[i].precioOriginal;
    } else {
      precio_venta = this.dataSource.data[i].precioOriginal;
    }
    this.dataSource.data[i].precio_venta = precio_venta;
    this.form.controls['precio_venta_' + i].setValue(precio_venta);
    this.calcularTotalProducto(i);
  }

  calcularTotales() {
    let no_iva: number = 0;
    let iva: number = 0;
    let descuento: number = 0;
    let total_sin_iva: number = 0;
    let total: number = 0;
    let stotaliva: any = 0;

    this.dataSource.data.forEach((el: any, i: any) => {
      if (el.grabaiva) {
        stotaliva = Number(stotaliva) + Number(el.total);
      } else if (!el.grabaiva) {
        no_iva += Number(el.total);
      }
      iva += Number(el.total_iva);
      descuento += Number(el.descuento);
      total_sin_iva += Number(el.total_sin_iva);
      total += Number(el.total);
    });

    this.totales = {
      subtotal_iva: Number(stotaliva).toFixed(2),
      iva: Number(no_iva).toFixed(2),
      no_iva: Number(iva).toFixed(2),
      descuento: Number(descuento).toFixed(2),
      total_sin_iva: Number(total_sin_iva).toFixed(2),
      total: Number(total).toFixed(2),
    };
    this.sendToF.emit({ action: 'totales', value: this.totales });
  }

  ngAfterViewInit() {
    // this.dataSource.sort = this.sort;
    // this.sort.sort({ id: 'id', start: 'desc' });
  }

  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }

  openModal(modal: any, edit: any = false, size: any = false) {
    if (edit) {
      this.edit_id = edit;
    } else {
      this.edit_id = '';
    }
    this.modalService.open(modal, { size: size ? size : 'lg' });
  }

  hideModal() {
    this.modalService.dismissAll();
  }
}
