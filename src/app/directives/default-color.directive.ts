import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appDefaultColor]'
})
export class DefaultColorDirective {

  @Input()
  appDefaultColor = '#e91e63de';

  constructor(private el: ElementRef) {
    this.changeBackground(this.appDefaultColor);
  }

  private changeBackground(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }

}
