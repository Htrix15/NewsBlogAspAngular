import { Component, OnInit, Input } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { positions } from 'src/app/shared/my-types';

@Component({
  selector: 'app-picture',
  templateUrl: './picture.component.html',
  styleUrls: ['./picture.component.scss']
})
export class PictureComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionPosition: positions;
  
  constructor() { }

  ngOnInit() {
  }
}
