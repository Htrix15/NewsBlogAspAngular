import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';

@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss']
})
export class TextComponent implements OnInit {
  @Input() sectionData: ISectionData;
  @ViewChild('section') section: ElementRef;
  
  constructor() { }

  ngOnInit() {
   
  }
  ngAfterViewInit(){
    this.section.nativeElement.innerHTML = this.sectionData?.getText()?.replace(/&nbsp;/g, ' ');
  }
}
