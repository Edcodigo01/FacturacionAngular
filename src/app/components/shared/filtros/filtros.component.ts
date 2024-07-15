import { Input } from '@angular/core';
import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrls: ['./filtros.component.css'],
})
export class FiltrosComponent {
  @ViewChild('btnfiltros') btnfiltros!: ElementRef;
  filtrosDefault: any;
  filtros: any;
  @Input() title: any = false;
  @Input() datosFiltros: any = {};
  @Output()
  sendToF = new EventEmitter<any>();

  ngOnInit() {
   
    if (!this.title) {
      this.filtrosDefault = {
        estado: 'Activos',
      };
    } else if (this.title == 'Productos') {
      let almacenDefault = '';
      if(this.datosFiltros.almacenes.length != 0){
          almacenDefault = this.datosFiltros.almacenes[0].id;
      }

      this.filtrosDefault = {
        estado: 'Activos',
        almacen_id: almacenDefault,
        categoria_id: "",
        // test: '',
      };
    }
    this.filtros = Object.assign({}, this.filtrosDefault);
  }

  ngAfterViewInit() {
    // Este componente verifica los filtros predeterminados, envia al padre sus valores, para q este llame los datos para tabla.
    this.btnfiltros.nativeElement.click();
  }

  setValueDefault() {}

  getFiltros(e: any) {
    let filtros = '?';
    let count = 0;
    if (e.submitter.className.includes('btn-secondary')) {
      this.filtros = Object.assign({}, this.filtrosDefault);
    }

    Object.keys(this.filtros).forEach((el) => {
      let f = this.filtros[el];
      if (f) {
        if (count == 0) {
          filtros += `${el}=${f}`;
        } else {
          filtros += `&${el}=${f}`;
        }
        count++;
      }
    });

    this.sendToFather('filtros', filtros);
  }

  onChangeNgSelect(e: any, name: string, bind_value: any) {
    console.log(e);
    
    let value = "";
    if (e) {
      value = e[bind_value];
    }

    setTimeout(() => {
      this.filtros[name] = value;
    }, 200);
  }

  sendToFather(action: any, value: any) {
    this.sendToF.emit({ action: 'filtros', value: value });
  }
}
