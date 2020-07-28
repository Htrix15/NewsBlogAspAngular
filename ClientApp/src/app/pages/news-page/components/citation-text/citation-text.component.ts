import { Component, OnInit, Input } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';

@Component({
  selector: 'app-citation-text',
  templateUrl: './citation-text.component.html',
  styleUrls: ['./citation-text.component.scss']
})
export class CitationTextComponent implements OnInit {

  @Input() sectionData: ISectionData;
  
  constructor() { }

  ngOnInit() {
  }

}
