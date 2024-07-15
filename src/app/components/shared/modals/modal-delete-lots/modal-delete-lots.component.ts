import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorsService } from 'src/app/services/validators.service';

@Component({
  selector: 'app-modal-delete-lots',
  templateUrl: './modal-delete-lots.component.html',
  styleUrls: ['./modal-delete-lots.component.css'],
})
export class ModalDeleteLotsComponent {
  loading = false;
  showPass = false;
  form: any = FormGroup;
  @Input() selected: any;
  @Input() url: any;
  @Output()
  sendToF = new EventEmitter<any>();

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      password: ['', [Validators.required]],
    });
  }

  sendToFather(action: string, value: any = false) {
    this.sendToF.emit({ action: action, value: value });
  }

  habilitarLotes(e: Event) {
    console.log('acasas');

    this.loading = true;
    this.form.markAllAsTouched();

    if (this.form.status == 'INVALID') {
      this.loading = false;
      return;
    }
   
    this.loading = true;
    let selected = this.selected.map((e: any) => e.id);

    this.http
      .post(`${this.url}?accion=eliminar`, {
        selected: selected,
        password: this.form['controls'].password.value,
      })
      .subscribe(
        (response: any) => {
          this.sendToFather(
            'success',
            response.message
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          if (this.validatorsS.detect_errors_server(error, this.form)) {
            return;
          }
        }
      );
  }

  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }
}
