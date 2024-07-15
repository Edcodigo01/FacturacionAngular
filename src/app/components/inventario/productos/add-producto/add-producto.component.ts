import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-producto',
  templateUrl: './add-producto.component.html',
  styleUrls: ['./add-producto.component.css'],
})

export class AddProductoComponent {
  @Output()
  sendToF = new EventEmitter<any>();
  @Input() edit: any;
  @Input() url: any;
  @Input() datosFiltros: any = {};

  form: any = FormGroup;
  loading = false;
  loadedForm: any = false;
  existentes: any = [0, 4];
  cantidades: any = [];
  @ViewChild('modalCreate') modalCreate!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService,
    private http: HttpClient,
    private ToastrS: ToastrService
  ) {}

  ngOnInit(): void {
    this.formC();
  }

  formC() {
    if (this.edit?.almacenes) {
      this.edit.almacenes.forEach((element: any) => {
        this.edit['almacen_' + element.almacen_id] = true;
        this.edit['cantidad_' + element.almacen_id] = element.cantidad;
      });
    }

    let formFields: any = {
      id: [this.edit?.id],
      descripcion: [this.edit?.descripcion, [Validators.required]],
      codigo: [this.edit?.codigo],
    
      precio_compra: [
        this.edit?.precio_compra,
        [Validators.required, this.validatorsS.number],
      ],
      porcentaje_ganancia: [
        this.edit?.porcentaje_ganancia ? this.edit.porcentaje_ganancia : 5,
        [Validators.required, this.validatorsS.number, Validators.max(100)],
      ],
      precio_venta: [
        this.edit?.precio_venta ? this.edit.precio_venta : 0,
        [Validators.required],
      ],
      categoria_producto_id: [this.edit?.categoria_producto_id],
      iva: [this.edit?.iva ? this.edit.iva : 1.12],
      ganancia: [this.edit?.ganancia ? this.edit.ganancia : 0],
      grabaiva: [this.edit?.grabaiva ? this.edit.grabaiva : 0],
      precio_venta_sin_iva: [this.edit?.precio_venta_sin_iva],
      // almacenes: this.formBuilder.array(almacenes)
    };

    // AÑADIR CAMPOS ALMACENES ID Y CANTIDAD DINAMICOS
    this.datosFiltros.almacenes.forEach((a: any) => {
      formFields['almacen_' + a.id] = [
        this.edit['almacen_' + a.id] ? this.edit['almacen_' + a.id] : '',
      ];
      formFields['cantidad_' + a.id] = [
        this.edit['cantidad_' + a.id] ? this.edit['cantidad_' + a.id] : '',
      ];
    });

    this.form = this.formBuilder.group(formFields);
    this.validatorsOnLoad();
    this.activarDeteccionCambios();
    this.loadedForm = true;
  }

  activarDeteccionCambios() {
    this.form.get('precio_compra').valueChanges.subscribe((value: any) => {
      this.calcularTotal();
    });
    this.form
      .get('porcentaje_ganancia')
      .valueChanges.subscribe((value: any) => {
        this.calcularTotal();
      });
    this.form.get('grabaiva').valueChanges.subscribe((value: any) => {
      this.calcularTotal();
    });

    // detección cambios almacenes
    this.datosFiltros.almacenes.forEach((a: any) => {
      this.form.get('almacen_' + a.id).valueChanges.subscribe((value: any) => {
        if (value) {
          this.form
            .get('cantidad_' + a.id)
            .setValidators([Validators.required]);
        } else {
          this.form.get('cantidad_' + a.id).clearValidators();
        }
        this.form.get('cantidad_' + a.id).updateValueAndValidity();
      });
    });
  }

  validatorsOnLoad() {
    this.datosFiltros.almacenes.forEach((a: any) => {
      if (this.edit['almacen_' + a.id]) {
        this.form.get('almacen_' + a.id).setValidators([Validators.required]);
        this.form.get('cantidad_' + a.id).setValidators([Validators.required]);
        this.form.get('almacen_' + a.id).updateValueAndValidity();
        this.form.get('cantidad_' + a.id).updateValueAndValidity();
      }
    });
  }

  calcularTotal() {
    let precio_compra = this.form.controls['precio_compra'].value;
    let porcentaje_ganancia = this.form.controls['porcentaje_ganancia'].value;
    let grabaiva = this.form.controls['grabaiva'].value;
    let iva = this.form.controls['iva'].value;
    let ganancia = (precio_compra * porcentaje_ganancia) / 100;
    let precio_venta_sin_iva = Number(ganancia + Number(precio_compra)).toFixed(
      2
    );
    let precio_venta = Number(
      grabaiva
        ? Number(precio_venta_sin_iva) + Number(iva)
        : precio_venta_sin_iva
    ).toFixed(2);
    // ganancia
    // precio_venta
    // precio_venta_sin_iva
    this.form.get('precio_venta').setValue(precio_venta);
    this.form.get('ganancia').setValue(ganancia);
    this.form.get('precio_venta_sin_iva').setValue(precio_venta_sin_iva);

    this.form.get('precio_venta').updateValueAndValidity();
    this.form.get('ganancia').updateValueAndValidity();
    this.form.get('precio_venta_sin_iva').updateValueAndValidity();
  }

  closeModal() {
    this.sendToF.emit({ action: 'closeModal' });
  }

  store() {
    this.form.markAllAsTouched();

    if (this.form.status == 'INVALID') {
      return;
    }

    let values = this.form.value;
    let almacenesSelect: any = [];
    let almacenesSelectCount = 0;

    Object.keys(values).forEach((element) => {
      if (element.includes('almacen_')) {
        if (values[element]) {
          let almacen_id = element.replace('almacen_', '');
          let cantidad = values['cantidad_' + almacen_id];
          almacenesSelect.push({ almacen_id: almacen_id, cantidad: cantidad });
          almacenesSelectCount++;
        }
      }
    });

    if (almacenesSelectCount == 0) {
      this.ToastrS.warning('Debe seleccionar al menos un almacén.');
      return;
    }

    values.almacenes = almacenesSelect;

    this.http.post(this.url, values).subscribe(
      (response: any) => {
        console.log(response);
        this.sendToF.emit({ action: 'success', value: response.message });
        this.loading = false;
      },
      (error) => {
        console.log(error);
        let detect_errors_server = this.validatorsS.detect_errors_server(
          error,
          this.form
        );
        this.loading = false;
        if (detect_errors_server) {
          return;
        }
      }
    );
  }

  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }
}
