import { Directive, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { orientation } from './my-types';

@Directive({
  selector: '[checkSckrollPosition]'
})
export class CheckSckrollPositionDirective {
  
  @Input() scrollOrientation: orientation;
  @Output() yesAdding: EventEmitter<HTMLDivElement>;

  constructor(private elementRef: ElementRef) {
    this.yesAdding = new EventEmitter<HTMLDivElement>();
  }

  ngAfterViewInit(){
    switch(this.scrollOrientation) {
      case('horizontal'):{this.checkScrollRight(); break;}
      case('vertical'):{this.checkScrollBottom(); break;}
      default:{this.checkScrollBottom(); break;}
    }
  }

  @HostListener('window:resize') onResize(){
    switch(this.scrollOrientation) {
      case('horizontal'):{this.checkScrollRight(); break;}
      case('vertical'):{this.checkScrollBottom(); break;}
      default:{this.checkScrollBottom(); break;}
    }
  }
  
  private checkScrollRight(){
    let scroll = (this.elementRef.nativeElement as HTMLDivElement).scrollWidth - 
    (this.elementRef.nativeElement as HTMLDivElement).scrollLeft - 
    (this.elementRef.nativeElement as HTMLDivElement).clientWidth;
    if(scroll <= 0){
     this.yesAdding.emit(this.elementRef.nativeElement);
    }
  }

  private checkScrollBottom(){
    let scroll = (this.elementRef.nativeElement as HTMLDivElement).scrollHeight - 
    (this.elementRef.nativeElement as HTMLDivElement).scrollTop - 
    (this.elementRef.nativeElement as HTMLDivElement).clientHeight;
    if(scroll <= 0){
     this.yesAdding.emit(this.elementRef.nativeElement);
    }
  }

}
