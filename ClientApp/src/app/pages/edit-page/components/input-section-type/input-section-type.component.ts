import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { sections } from 'src/app/shared/my-types';


@Component({
  selector: 'app-input-section-type',
  templateUrl: './input-section-type.component.html',
  styleUrls: ['./input-section-type.component.scss']
})
export class InputSectionTypeComponent implements OnInit {

  @Output() addNewSubSection: EventEmitter<sections>;
  
  constructor() { 
    this.addNewSubSection = new EventEmitter<sections>();
  }
  
  ngOnInit() {
  }
  
  inputNewSubSection(sectionType: sections){
    this.addNewSubSection.emit(sectionType);
  }
}
