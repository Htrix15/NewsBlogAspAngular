import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener, HostBinding } from '@angular/core';
import { ISectionData } from 'src/app/shared/i-section-data';
import { ArticleText } from 'src/app/services-models/article-text';
import { positions } from 'src/app/shared/my-types';
import { DataService } from 'src/app/services/data.service';
import { Section } from 'src/app/models/section';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})
export class InputTextComponent implements OnInit {

  @Input() sectionData: ISectionData;
  @Input() sectionNumber: number;
  @Input() sectionPosition: positions;
  @Input() articleId: number;
  @Output() delSubSection: EventEmitter<void>;
  @Output() submitSubSection:  EventEmitter<ISectionData>;
  @ViewChild('textBox') textBox: ElementRef;

  private putSubSectionSubscribe: Subscription;
  
  invalidText:boolean;
  textLength:number;
  maxTextLength:number;

  constructor(private dataService: DataService) { 
    this.delSubSection = new EventEmitter<void>(); 
    this.submitSubSection = new EventEmitter<ISectionData>();
    this.maxTextLength = 1000;
    this.invalidText = false;
    this.textLength = 0;
  }

  ngOnInit() {
    this.invalidText = !MyValidators.validTextLength(this.sectionData?.getText(), 1000);
    this.textLength = this.sectionData?.getText()?this.sectionData?.getText().length:0;
  }

  ngAfterViewInit(){
    let str = this.sectionData?.getText();
    this.textBox.nativeElement.innerHTML = str&&!this.invalidText?str:null;
  }

  inputText(text:string){
    this.textLength = text.length;
    this.invalidText = !MyValidators.validTextLength(text, this.maxTextLength);
  }

  setTextStyle(comand:string, option=''){
    document.execCommand(comand, false, option);
  }

  setLink(){
    let link = prompt('Введите URL','http:\/\/');
    if(MyValidators.validTextLength(link,200)){
      document.execCommand('createLink', false, link);
    } else{
      this.invalidText = true;
    }
  }

  submit(){
    this.putSubSectionSubscribe = this.dataService.putUserDatas<Section, string>(
      new Section(this.articleId, 
        this.sectionNumber, 
        this.sectionPosition,
        'text',
        null, 
        null,
        (this.textBox.nativeElement.innerHTML as string).replace(/&nbsp;/g, ' ')
      ), 
    'put-sub-section-data').subscribe(sectionId =>
      this.submitSubSection.emit(new ArticleText(this.textBox.nativeElement.innerHTML, parseInt(sectionId)))
    );
  }
  delete(){
    this.delSubSection.emit();
  }

  ngOnDestroy(){
    if(this.putSubSectionSubscribe){ this.putSubSectionSubscribe.unsubscribe();}
  }
}
