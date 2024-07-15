import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-add-cliente',
  templateUrl: './add-cliente.component.html',
  styleUrls: ['./add-cliente.component.css'],
})
export class AddClienteComponent {
  @Output()
  sendToF = new EventEmitter<any>();
  @Input() edit: any;
  @Input() url: any;
  form: any = FormGroup;
  loading = false;
  loadedForm: any = false;
  @ViewChild('modalCreate') modalCreate!: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.formC();
  }

  formC() {
    this.form = this.formBuilder.group({
      id: [this.edit?.id],
      razon_social: [
        this.edit?.razon_social,
        [Validators.required, Validators.minLength(3)],
      ],
      tipo_ident: [
        this.edit?.tipo_ident ? this.edit?.tipo_ident : 'RUC',
        Validators.required,
      ],
      identificacion: [this.edit?.identificacion],
      nombre_comercial: [this.edit?.nombre_comercial],
      email: [this.edit?.email, this.validatorsS.email],
      telefono: [this.edit?.telefono, this.validatorsS.onlyNumber],
      ciudad: [this.edit?.ciudad],
      direccion: [this.edit?.direccion],
    });

    this.loadedForm = true;

    const tipo_ident = this.form.controls['tipo_ident'].value;
    this.cambiarValidadorIdent(tipo_ident);

    this.form.get('tipo_ident').valueChanges.subscribe((value: any) => {
      this.cambiarValidadorIdent(value);
    });
  }

  closeModal() {
    this.sendToF.emit({ action: 'closeModal' });
  }

  store() {
    this.loading = true;
    this.form.markAllAsTouched();

    if (this.form.status == 'INVALID') {
      this.loading = false;
      return;
    }

    this.http.post(this.url, this.form.value).subscribe(
      (response: any) => {
        console.log('response');
        console.log(response);
        this.sendToF.emit({
          action: 'actualizarClientes',
          value: response.message,
          cliente: response.cliente,
        });
        this.loading = false;
      },
      (error) => {
        console.log('error');

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

  cambiarValidadorIdent(tipo_ident: string) {
    if (tipo_ident == 'CONSUMIDOR FINAL') {
      this.form.get('identificacion').clearValidators();
    } else if (tipo_ident == 'RUC') {
      this.form
        .get('identificacion')
        .setValidators([
          Validators.required,
          this.validatorsS.onlyNumber,
          Validators.minLength(13),
        ]);
    } else if (tipo_ident == 'CÉDULA') {
      this.form
        .get('identificacion')
        .setValidators([
          Validators.required,
          this.validatorsS.onlyNumber,
          Validators.minLength(10),
        ]);
    } else if (tipo_ident == 'PASAPORTE') {
      this.form
        .get('identificacion')
        .setValidators(Validators.required, [
          Validators.required,
          this.validatorsS.onlyNumber,
          Validators.minLength(8),
        ]);
    }
    this.form.get('identificacion').updateValueAndValidity();
  }

  is_tipo_ident(value: string) {
    let val: any = this.form.controls['tipo_ident'].value;
    if (value == 'CONSUMIDOR FINAL' && val == value) {
      return true;
    } else if (value == 'RUC' && val == value) {
      return true;
    } else if (value == 'CÉDULA' && val == value) {
      return true;
    } else if (value == 'PASAPORTE' && val == value) {
      return true;
    } else if (value == '!= CONSUMIDOR FINAL' && val != 'CONSUMIDOR FINAL') {
      return true;
    } else {
      return false;
    }
  }
}
