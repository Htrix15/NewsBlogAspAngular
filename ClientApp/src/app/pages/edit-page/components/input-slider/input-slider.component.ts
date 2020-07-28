import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticlePicture } from 'src/app/services-models/article-picture';
import { DataService } from 'src/app/services/data.service';
import { Section } from 'src/app/models/section';
import { positions } from 'src/app/shared/my-types';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-input-slider',
  templateUrl: './input-slider.component.html',
  styleUrls: ['./input-slider.component.scss']
})
export class InputSliderComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionNumber: number;
  @Input() sectionPosition: positions;
  @Input() articleId: number;
  @Output() delSubSection: EventEmitter<void>;
  @Output() submitSubSection:  EventEmitter<ISectionData>;

  public forms: FormArray; 
  private putSubSectionSubscribe: Subscription;
  private oldPictureSrc: Array<string>;
  private countSlideElements:number;
  blockAddSlideElements:boolean;

  constructor(private dataService: DataService) { 
    this.delSubSection = new EventEmitter<void>(); 
    this.submitSubSection = new EventEmitter<ISectionData>();
    this.forms = new FormArray([]);
    this.oldPictureSrc = new Array<string>();
    this.countSlideElements = 0;
    this.blockAddSlideElements = false;
  }

  ngOnInit() {
    for(let item of this.sectionData.getPictures().pictures){
      this.forms.push(
        new FormGroup({
          src: new FormControl(item?.src, Validators.required),
          description: new FormControl(item?.description, Validators.maxLength(100))
          })
      );
      this.oldPictureSrc.push(item?.src as string);
      this.countSlideElements++;
      if(this.countSlideElements==environment.maxCountSlideElements){
        this.blockAddSlideElements = true;
        break;
      }
    }
    if(this.forms.length<2){
      this.addSliderSection();
      this.addSliderSection();
    }
  }

  onSelectFile(event: Event, idx: number){
    if( (<HTMLInputElement>event.target).files[0]!==undefined){
      const reader = new FileReader();
      reader.onload = () => {
        this.sectionData.getPictures().pictures[idx].src = reader.result;
        this.sectionData.getPictures().pictures[idx].file = (<HTMLInputElement>event.target).files[0];
        this.sectionData.getPictures().pictures[idx].id = idx;
        (this.forms.controls[idx] as FormGroup).controls['src'].setValue('new img');
      }
      reader.readAsDataURL((<HTMLInputElement>event.target).files[0]);
    }
  }
  
  addSliderSection(){
    this.forms.push(
      new FormGroup({
        src: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.maxLength(100))
        })
    );
    this.sectionData.getPictures().pictures.push(new ArticlePicture());
    this.countSlideElements++;
    if(this.countSlideElements>=environment.maxCountSlideElements){
      this.blockAddSlideElements = true;
    }
  }

  delSliderSection(idx:number){
    this.sectionData.getPictures().pictures.splice(idx, 1);
    this.forms.removeAt(idx);
    this.countSlideElements--;
    this.blockAddSlideElements = false;
  }

  submit(){
    for(let i=0; i< this.sectionData.getPictures().pictures.length; i++ ){
      this.sectionData.getPictures().pictures[i].description = 
      (this.forms.controls[i] as FormGroup).controls['description']?.value;
    }

    const formData = new FormData();
    let picturesDescs = Array<string>();

    for(let i=0; i< this.sectionData.getPictures().pictures.length; i++){
      if(this.sectionData.getPictures().pictures[i].file){
        formData.append('formData', this.sectionData.getPictures().pictures[i].file);
      } else {
        formData.append('formData',new File([], null));
      }
      picturesDescs.push(this.sectionData.getPictures().pictures[i].description?
      this.sectionData.getPictures().pictures[i].description:"");
    }

    formData.append('JSON', JSON.stringify(
      new Section(this.articleId, 
                  this.sectionNumber, 
                  this.sectionPosition,
                  'slider', 
                  JSON.stringify(this.oldPictureSrc),
                  JSON.stringify(picturesDescs))));

    this.putSubSectionSubscribe = this.dataService.putMultipartDatas<Section>(formData, 'put-multipart-data', new Map<string, string>().set('type','section')).subscribe(
      section => {
        this.oldPictureSrc = JSON.parse(section.src);
        this.sectionData.id =section.id;
        this.submitSubSection.emit(this.sectionData);
      }
    );
    //--------
    
  }
  delete(){
    this.delSubSection.emit();
  }

  ngOnDestroy(){
    if(this.putSubSectionSubscribe){ this.putSubSectionSubscribe.unsubscribe();}
  }

}

