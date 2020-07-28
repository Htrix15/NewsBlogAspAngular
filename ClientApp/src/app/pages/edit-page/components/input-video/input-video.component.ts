import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleVideo } from 'src/app/services-models/article-video';
import { DataService } from 'src/app/services/data.service';
import { Section } from 'src/app/models/section';
import { positions } from 'src/app/shared/my-types';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';

@Component({
  selector: 'app-input-video',
  templateUrl: './input-video.component.html',
  styleUrls: ['./input-video.component.scss']
})
export class InputVideoComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionNumber: number;
  @Input() sectionPosition: positions;
  @Input() articleId: number;
  @Output() delSubSection: EventEmitter<void>; 
  @Output() submitSubSection:  EventEmitter<ISectionData>;
  public form: FormGroup;

  private putSubSectionSubscribe: Subscription;
  
  constructor(private dataService: DataService) { 
    this.delSubSection = new EventEmitter<void>(); 
    this.submitSubSection = new EventEmitter<ISectionData>();
  }

  ngOnInit() {
    this.form = new FormGroup({
      src: new FormControl(this.sectionData?.getVideo().src, [MyValidators.validateIframe()]),
      description: new FormControl(this.sectionData?.getVideo().description, Validators.maxLength(100))
    });
  }
  
  submit(){
    this.putSubSectionSubscribe = this.dataService.putUserDatas<Section, string>(
      new Section(this.articleId, 
        this.sectionNumber, 
        this.sectionPosition,
        'video',
        this.form.controls['src'].value,
        this.form.controls['description'].value
      ), 
    'put-sub-section-data').subscribe(sectionId =>
      this.submitSubSection.emit(
        new ArticleVideo(this.form.controls['src'].value, 
                        this.form.controls['description'].value, parseInt(sectionId)))
      );

  }
  delete(){
    this.delSubSection.emit();
  }

  ngOnDestroy(){
    if(this.putSubSectionSubscribe){ this.putSubSectionSubscribe.unsubscribe();}
  }
}
