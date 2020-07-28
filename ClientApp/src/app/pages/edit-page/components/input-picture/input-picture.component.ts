import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticlePicture } from 'src/app/services-models/article-picture';
import { DataService } from 'src/app/services/data.service';
import { positions } from 'src/app/shared/my-types';
import { Section } from 'src/app/models/section';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-picture',
  templateUrl: './input-picture.component.html',
  styleUrls: ['./input-picture.component.scss']
})
export class InputPictureComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionNumber: number;
  @Input() sectionPosition: positions;
  @Input() articleId: number;
  @Output() delSubSection: EventEmitter<void>;
  @Output() submitSubSection: EventEmitter<ISectionData>;

  public form: FormGroup;
  private putSubSectionSubscribe: Subscription;
  private oldPictureSrc: string;
  
  constructor(private dataService: DataService) { 
    this.delSubSection = new EventEmitter<void>(); 
    this.submitSubSection = new EventEmitter<ISectionData>();
  }

  ngOnInit() {
    this.form = new FormGroup({
      description: new FormControl(this.sectionData?.getPicture().description, Validators.maxLength(100)),
      src: new FormControl( this.sectionData?.getPicture().src as string, Validators.required)
    });
    this.oldPictureSrc = this.sectionData?.getPicture().src as string;
  }

  onSelectFile(event: Event){
    if((<HTMLInputElement>event.target).files[0]!==undefined){
      const reader = new FileReader();
      reader.onload = () => {
        this.sectionData.getPicture().src = reader.result;
        this.sectionData.getPicture().file = (<HTMLInputElement>event.target).files[0]; 
        this.form.controls['src'].setValue('new img');
      }
      reader.readAsDataURL((<HTMLInputElement>event.target).files[0]);
    }
  }

  submit(){
    const formData = new FormData();
    if (this.sectionData.getPicture().file){
      formData.append('formData', this.sectionData.getPicture().file);
    }
    formData.append('JSON', JSON.stringify(
      new Section(this.articleId, 
                  this.sectionNumber, 
                  this.sectionPosition,
                  'picture', 
                  this.sectionData.getPicture().file?this.oldPictureSrc:this.sectionData.getPicture().src.toString(),  
                  this.form.controls['description'].value)));

    this.putSubSectionSubscribe = this.dataService.putMultipartDatas<Section>(formData, 'put-multipart-data', new Map<string, string>().set('type','section')).subscribe(
      (section) => {
        this.oldPictureSrc = section.src;
        this.submitSubSection.emit(
          new ArticlePicture(this.sectionData.getPicture().src,
                             this.form.controls['description'].value, 
                             section.id,
                             this.sectionData.getPicture().file));             
      }
    );
  }

  delete(){
    this.delSubSection.emit();
  }

  ngOnDestroy(){
    if(this.putSubSectionSubscribe){ this.putSubSectionSubscribe.unsubscribe();}
  }
}
