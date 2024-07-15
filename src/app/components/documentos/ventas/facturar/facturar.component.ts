import { Component, HostListener, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TotalesComponent } from '../../shared/totales/totales.component';
import { DetallesFacturaComponent } from '../../shared/detalles-factura/detalles-factura.component';
import { ToastrService } from 'ngx-toastr';
import { DatosClienteComponent } from '../../shared/datos-cliente/datos-cliente.component';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.css'],
})
export class FacturarComponent {
  constructor(
    private http: HttpClient,
    private toastrS: ToastrService,
    private router: Router,
    private activatedR: ActivatedRoute
  ) {}
  id: number;
  title = 'Facturar';
  url_ventas = environment.api_url + 'comercio/ventas';
  url_productos = environment.api_url + 'inventario/productos';
  loading = false;
  recursos: any = [];
  totales = {
    subtotal_iva: 0,
    iva: 0,
    no_iva: 0,
    descuento: 0,
    total_sin_iva: 0,
    total: 0,
  };
  innerWidth = window.innerWidth;
  preproductos = []; //se usa para almacenar los productos extraidos del componente lista-productos y al llamar modal productos no debera hacer get de nuevo
  cliente = {};
  observaciones = '';
  load = false;
  // almacenes = [];
  // preproductosFiltrados = [];// igual q el anterior pero es para la respuesta de busqueda rapida de productos si fuesen varios resultados
  // varibales productos
  // almacen_id = "";
  // productos = [];
  // varibales productos fin
  @ViewChild(TotalesComponent) TotalesComponent: any;
  @ViewChild(DetallesFacturaComponent) DetallesFacturaComponent: any;
  @ViewChild(DatosClienteComponent) DatosClienteComponent: any;

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.innerWidth = window.innerWidth;
  }

  ngOnInit() {
    this.activatedR?.firstChild?.params.subscribe((params) => {
      this.id = params['id'];
    });
    this.getData();
  }

  getData() {
    this.loading = true;
    return this.http.get(`${this.url_ventas}/${this.id}`).subscribe(
      (response: any) => {
        console.log('recursos');
        console.log(response);
        this.recursos = response;
        if (!response.venta) {
          this.id = 0;
          setTimeout(() => {
            this.router.navigate(['facturar'], {
              replaceUrl: true,
            });
          });
        }
        if (response.cliente) {
          this.cliente = JSON.parse(response?.cliente);
        }
        this.loading = false;
        
      },
      (error) => {
        this.loading = false;
        console.log(error);
      }
    );
  }

  receivedToChild(e: any) {
    if (e.action == 'actualizarClientes') {
      this.recursos.clientes = e.value;
    } else if (e.action == 'totales') {
      this.totales = e.value;
      this.TotalesComponent.actualizarLimiteDescuento(this.totales.total);
    } else if (e.action == 'preproductos') {
      this.preproductos = e.value;
    } else if (e.action == 'addProducto') {
      this.addProducto(e.value);
    } else if (e.action == 'cliente') {
      this.cliente = e.value;
    }
  }

  addProducto(value: any) {
    this.DetallesFacturaComponent.addProducto(value);
  }

  guardarFactura() {
    // Cliente
    let cliente: any = '';
    if (Object.keys(this.cliente).length != 0) {
      cliente = this.cliente;
    }

    // Detalles
    const validarDetalles = this.DetallesFacturaComponent.validarForm();
    if (!validarDetalles) {
      console.log('Error en detalles');
    }
    const detalles = this.DetallesFacturaComponent.dataSource.data;
    if (detalles.length == 0) {
      this.toastrS.warning('Debe agregar al menos un detalle.');
    }

    const validarTotales = this.TotalesComponent.validarForm();

    if (!validarDetalles || !validarTotales) {
      this.toastrS.warning(
        'Uno o varios campos están escritos de forma incorrecta.'
      );
    }

    const data = {
      id: this.id,
      cliente,
      detalles,
      totales: this.totales,
    };

    this.loading = true;
    this.http.post(this.url_ventas, data).subscribe(
      (response: any) => {
        console.log(response);

        setTimeout(() => {
          this.router.navigate(['facturar/' + response.id], {
            replaceUrl: true,
          });
        });
        this.loading = false;
      },
      (error) => {
        console.log(error);
        this.loading = false;
      }
    );
  }
}
