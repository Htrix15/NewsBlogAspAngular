import { Component, OnInit, Input } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { positions } from 'src/app/shared/my-types';
import { ArticlePicture } from 'src/app/services-models/article-picture';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss']
})
export class SliderComponent implements OnInit {
  
  @Input() sectionData: ISectionData;
  @Input() sectionPosition: positions;

  public pictures:Array<ArticlePicture>;
  public indexShowImg: number;
  private countPicture: number;
  
  constructor() { 
    this.pictures = new Array<ArticlePicture>();
    this.indexShowImg = 0;
  }

  ngOnInit() {
    this.pictures = this.sectionData?.getPictures()?.pictures;
    this.countPicture = this.pictures.length-1;
  }

  getPicture(idx:number){
    this.indexShowImg = idx;
  }

  goLeft(){
    if(this.indexShowImg != 0){
      this.indexShowImg--; 
    } else{
      this.indexShowImg = this.countPicture;
    }
  }

  goRight(){
    if(this.indexShowImg != this.countPicture){
      this.indexShowImg++;
    } else {
      this.indexShowImg = 0;
    }
  }
}
