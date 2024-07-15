import { HttpClient } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  NgbModal,
  NgbModalConfig,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import { ValidatorsService } from 'src/app/services/validators.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ClientesListaComponent } from './clientes-lista/clientes-lista.component';

@Component({
  selector: 'app-datos-cliente',
  templateUrl: './datos-cliente.component.html',
  styleUrls: ['./datos-cliente.component.css'],
})
export class DatosClienteComponent {
  @Output()
  sendToF = new EventEmitter<any>();
  @Input() clientes: any;
  @Input() edit: any;
  @Input() url: any;

  url_clientes = environment.api_url + 'clientes';
  @Input() cliente: any = {};
  form: any = FormGroup;
  loading = false;
  loadedForm: any = false;
  prebusqueda: any = false;
  @ViewChild('modalClientes') modalClientes!: ElementRef;
  @ViewChild('ToolTipTemplate') ToolTipTemplate: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private validatorsS: ValidatorsService,
    private modalService: NgbModal,
    private configM: NgbModalConfig,
    private ToastrS: ToastrService,
    private http: HttpClient
  ) {
    configM.backdrop = 'static';
  }

  ngOnInit() {
   
    this.formC();
  }

  openModal(
    modal: any,
    edit: any = false,
    size: any = false,
    busqueda: any = false
  ) {
    if (edit) {
      this.edit = edit;
    } else {
      this.edit = {};
    }
    if (busqueda) {
      this.prebusqueda = busqueda;
    } else {
      this.prebusqueda = false;
    }

    this.modalService.open(modal, { size: size ? size : 'xl' });
  }

  updateClientes() {
    this.http.get(this.url_clientes + '?estado=Activos').subscribe(
      (r: any) => {
        this.clientes = r.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  receivedToChild(e: any) {
    console.log(e);

    if (e.action == 'closeModal') {
      this.modalService.dismissAll();
    } else if (e.action == 'seleccion') {
      this.cliente = e.value;
      this.sendToFather('cliente', this.cliente);
      this.modalService.dismissAll();
    } else if (e.action == 'actualizarClientes') {
      this.modalService.dismissAll();
      if (e?.cliente) {
        this.cliente = e.cliente;
        this.sendToFather('cliente', this.cliente);
      }
      console.log(e);

      this.updateClientes();
    }
  }

  formC() {
    this.form = this.formBuilder.group({
      busqueda: [''],
    });
  }

  buscarCliente(e: Event) {
    let busqueda = this.form.value.busqueda;
    this.http
      .get(this.url_clientes + '?estado=Activos&busqueda=' + busqueda)
      .subscribe(
        (r: any) => {
          console.log(r);
          if (r.data.length == 1) {
            this.cliente = r.data[0];
            this.sendToFather('cliente', this.cliente);

            this.form.controls.busqueda.setValue('');
          } else if (r.data.length >= 2) {
            this.openModal(this.modalClientes, false, false, busqueda);
          } else {
            this.form.controls.busqueda.setErrors({ no_encontrado: true });
            this.form.controls.busqueda.markAsTouched();
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  clienteConsumidor() {
    this.cliente = {};
    this.sendToFather('cliente', {});
  }
  sendToFather(action: string, value: any) {
    return this.sendToF.emit({ action, value });
  }
  validate(name: string) {
    return this.validatorsS.sow_message(this.form, name);
  }
}
