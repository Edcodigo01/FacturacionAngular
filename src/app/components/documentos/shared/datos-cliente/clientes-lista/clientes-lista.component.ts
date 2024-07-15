import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TableComponent } from 'src/app/components/shared/table/table.component';

@Component({
  selector: 'app-clientes-lista',
  templateUrl: './clientes-lista.component.html',
  styleUrls: ['./clientes-lista.component.css'],
})
export class ClientesListaComponent {
  @Output()
  sendToF = new EventEmitter<any>();
  @Input() users: any = [];
  @Input() clientes: any = [];
  @Input() prebusqueda: any = "dayton";
  @ViewChild(TableComponent) TableComponent: any;

  url = environment.api_url + 'clientes';
  timerStart = Date.now();
  loading = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    // this.getData();
  }

  ngAfterViewInit() {
    this.TableComponent.getItems();
  }

  table = {
    url: environment.api_url + 'clientes',
    columns: [
     
      { name: 'Razón Social.', field: 'razon_social', type: '' },
      { name: 'Tipo I.', field: 'tipo_ident', type: '' },
      { name: 'Identificación.', field: 'identificacion', type: '' },
    ],
  };

  closeModal() {
    this.sendToF.emit({ action: 'closeModal' });
  }

  receivedToChild(e: any) {
    if (e.action == 'closeModal') {
      this.closeModal();
    } else if (e.action == 'seleccion') {
      this.sendToF.emit({ action: 'seleccion', value: e.value });
    } 

    
  }

  // getData() {
  //   return this.http.get(`${this.url}`).subscribe(
  //     (response: any) => {
  //       console.log(response);
  //       this.loading = false;
  //     },
  //     (error) => {
  //       this.loading = false;
  //       console.log(error);
  //     }
  //   );
  // }
}
