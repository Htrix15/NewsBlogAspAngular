import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { positions } from 'src/app/shared/my-types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionPosition: positions;
  
  @ViewChild('section') section: ElementRef;
  
  private iFrameVideo:string;
  
  private widthPxVideoSideSection:number;
  private heightPxVideoSideSection:number;

  private widthPxVideoCenterSection:number;
  private heightPxVideoCenterSection:number; 
  
  private widthExp: RegExp;
  private heightExp: RegExp; 

  constructor() { 
    this.widthPxVideoSideSection = environment.widthPxVideoSideSection;
    this.heightPxVideoSideSection = environment.heightPxVideoSideSection;

    this.widthPxVideoCenterSection = environment.widthPxVideoCenterSection;
    this.heightPxVideoCenterSection = environment.heightPxVideoCenterSection;

    this.widthExp = new RegExp('width=\"(\\d*?)\"');
    this.heightExp = new RegExp('height=\"(\\d*?)\"');
  }

  ngOnInit() {
    this.iFrameVideo =  this.sectionData?.getVideo()?.src;
    if(this.iFrameVideo){
      if(this.sectionPosition =='left' || this.sectionPosition== 'right'){
        this.iFrameVideo = this.iFrameVideo
          .replace(this.widthExp,`width="${this.widthPxVideoSideSection}"`)
          .replace(this.heightExp,`height="${this.heightPxVideoSideSection}"`);
      } else if(this.sectionPosition == 'center'){
          this.iFrameVideo = this.iFrameVideo
          .replace(this.widthExp,`width="${this.widthPxVideoCenterSection}"`)
          .replace(this.heightExp,`height="${this.heightPxVideoCenterSection}"`);
      }
    }
  }
  ngAfterViewInit(){
    this.section.nativeElement.innerHTML = this.iFrameVideo;
  }
}
