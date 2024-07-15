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
  selector: 'app-add-precio-adicional',
  templateUrl: './add-precio-adicional.component.html',
  styleUrls: ['./add-precio-adicional.component.css'],
})
export class AddPrecioAdicionalComponent {
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
    {
      this.form = this.formBuilder.group({
        id: [this.edit?.id],
        descripcion: [this.edit?.descripcion, [Validators.required]],
        porcentaje_ganancia: [this.edit?.porcentaje_ganancia, [Validators.required,this.validatorsS.number]],

      });
    }
    
    
    this.loadedForm = true;
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
