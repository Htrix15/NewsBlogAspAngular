import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ArticleCitation } from 'src/app/services-models/article-citation';
import { positions } from 'src/app/shared/my-types';
import { DataService } from 'src/app/services/data.service';
import { Section } from 'src/app/models/section';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';

@Component({
  selector: 'app-input-citation-text',
  templateUrl: './input-citation-text.component.html',
  styleUrls: ['./input-citation-text.component.scss']
})
export class InputCitationTextComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionNumber: number;
  @Input() sectionPosition: positions;
  @Input() articleId: number;
  @Output() delSubSection: EventEmitter<void>;
  @Output() submitSubSection: EventEmitter<ISectionData>;
  private putSubSectionSubscribe: Subscription;
  
  public form: FormGroup;
  
  constructor(private dataService: DataService) { 
    this.delSubSection = new EventEmitter<void>(); 
    this.submitSubSection = new EventEmitter<ISectionData>();
  }

  ngOnInit() {
    this.form = new FormGroup({
      text: new FormControl(this.sectionData?.getCitation().text, [MyValidators.validateEmptyText(), Validators.maxLength(500)]),
      author: new FormControl(this.sectionData?.getCitation().author, [MyValidators.validateEmptyText(), Validators.maxLength(100)])
    });
  }
  
  submit(){
    this.putSubSectionSubscribe = this.dataService.putUserDatas<Section, string>(
      new Section(this.articleId, 
        this.sectionNumber, 
        this.sectionPosition,
        'citation',
        null,
        this.form.controls['author'].value,
        this.form.controls['text'].value
      ), 
    'put-sub-section-data').subscribe(sectionId =>
      this.submitSubSection.emit(
        new ArticleCitation(this.form.controls['text'].value,
                            this.form.controls['author'].value,
                            parseInt(sectionId))));

  }
  
  delete(){
    this.delSubSection.emit();
  }

  ngOnDestroy(){
    if(this.putSubSectionSubscribe){ this.putSubSectionSubscribe.unsubscribe();}
  }
}
