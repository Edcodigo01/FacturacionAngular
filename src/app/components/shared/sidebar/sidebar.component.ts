import { Component, Input, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  @Input() user: any;
  constructor(private renderer: Renderer2) {
    // this.renderer.listen('window', 'click', (e: Event) => {
    //   console.log(e);
      
    // });
  }
  // ngOnInit(): void {
  //   let result = document.getElementsByClassName("nav-item");
  //   console.log(result);

  // }
}
