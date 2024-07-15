import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css'],
})
export class ModalDeleteComponent {
  @Input() url: string = '';
  @Input() edit_id: string = '';
  @Output()
  sendToF = new EventEmitter<any>();
  loading = false;

  constructor(private http: HttpClient) {}

  sendToFather(action: string, value: any = false) {
    this.sendToF.emit({ action: action, value: value });
  }

  eliminar() {
    this.loading = true;
    this.http.delete(`${this.url}/${this.edit_id}`).subscribe(
      (response: any) => {
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
