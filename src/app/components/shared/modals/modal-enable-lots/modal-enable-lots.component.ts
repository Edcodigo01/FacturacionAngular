import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-modal-enable-lots',
  templateUrl: './modal-enable-lots.component.html',
  styleUrls: ['./modal-enable-lots.component.css'],
})

export class ModalEnableLotsComponent {
  loading = false;
  @Input() selected: any;
  @Input() url: any;
  @Output()
  sendToF = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  sendToFather(action: string, value: any = false) {
    this.sendToF.emit({ action: action, value: value });
  }

  habilitarLotes() {
    this.loading = true;
    let selected = this.selected.map((e: any) => e.id);

    this.http
      .post(`${this.url}?accion=habilitar`, {
        selected: selected,
      })
      .subscribe(
        (response: any) => {
          console.log(response);
          
          this.sendToFather(
            'success',
            'Los elementos han sido habilitados con éxito.'
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          console.log(error);
        }
      );
  }
}
