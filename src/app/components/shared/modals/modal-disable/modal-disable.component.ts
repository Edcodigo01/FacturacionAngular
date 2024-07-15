import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-disable',
  templateUrl: './modal-disable.component.html',
  styleUrls: ['./modal-disable.component.css'],
})
export class ModalDisableComponent {
  @Input() url: string = '';
  @Input() edit_id: string = '';
  @Output()
  sendToF = new EventEmitter<any>();
  loading = false;

  constructor(private http: HttpClient) {}

  sendToFather(action: string, value: any = false) {
    this.sendToF.emit({ action: action, value: value });
  }

  deshabilitar() {
    this.loading = true;
    this.http.delete(`${this.url}${this.edit_id}`).subscribe(
      (response: any) => {
        console.log(response);
        
        this.sendToFather('success', response.message);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }
}
