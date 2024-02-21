import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appRedBorder]'
})
export class RedBorderDirective {

  constructor(private el: ElementRef) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.setBorderColor('red');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.setBorderColor('white');
  }

  private setBorderColor(color: string) {
    this.el.nativeElement.style.boxShadow = color ? `0 0 10px ${color}, 0 0 20px ${color}, 0 0 40px ${color}` : null;
  }
}
