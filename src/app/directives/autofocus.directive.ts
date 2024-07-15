import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  constructor(private element: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    console.log("focus asdasd");
    
    this.element.nativeElement.focus();
  }
}
