import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-totales',
  templateUrl: './totales.component.html',
  styleUrls: ['./totales.component.css'],
})
export class TotalesComponent {
  @Input() totales: any = [];
  form: any = FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.form = this.formBuilder.group({
      descuento: [
        this.totales?.descuento,
        [Validators.required, this.validatorsS.number],
      ],
    });
  }

  actualizarLimiteDescuento(value: number) {
    this.form
      .get('descuento')
      .setValidators([
        Validators.required,
        this.validatorsS.number,
        Validators.max(value),
      ]);
    this.form.get('descuento').updateValueAndValidity();
  }

  validarForm() {
    this.form.markAllAsTouched();
    if (this.form.status == 'INVALID') {
      return;
    }
    return true;
  }

  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }
}
