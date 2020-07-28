import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Article } from 'src/app/models/article';
import { ArticleSlider } from 'src/app/services-models/article-slider';
import { ArticlePicture } from 'src/app/services-models/article-picture';
import { ArticleCitation } from 'src/app/services-models/article-citation';
import { ArticleText } from 'src/app/services-models/article-text';
import { ArticleVideo } from 'src/app/services-models/article-video';
import { positions, sections } from 'src/app/shared/my-types';
import { ISectionData } from 'src/app/shared/i-section-data';
import { ArticleCategory } from 'src/app/models/article-category';
import { ActivatedRoute, Router } from '@angular/router';
import { ArticleSection } from 'src/app/services-models/article-section';
import { Section } from 'src/app/models/section';
import { DataService } from 'src/app/services/data.service';
import { SectionSort } from 'src/app/services-models/section-sort';
import { MessagesService } from 'src/app/services/messages.service';
import { MyMessage } from 'src/app/services-models/my-message';
import { Subscription } from 'rxjs';
import { MyValidators } from 'src/app/shared/MyValidators';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.scss']
})
export class EditPageComponent implements OnInit {

  public loadHeadData:boolean;
  public form:FormGroup;
  public article:Article;
  public categories:Array<ArticleCategory>;
  public showInputHeadPictureArea:boolean;
  public waitingMove:boolean;

  private getCategoriesSubscribe: Subscription;
  private getArticleSubscribe: Subscription;
  private delArticleSubscribe: Subscription;
  private putArticleSubscribe: Subscription;
  private postArticleSectionSubscribe: Subscription;
  private delArticleSectionSubscribe: Subscription;
  private delArticleSubSectionSubscribe: Subscription;
  private putArticleSubSectionSubscribe: Subscription;
  private addSubSectionSubscribe: Subscription;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private dataService: DataService,
    private authService: AuthService,
    private messagesService: MessagesService){
      this.categories = new Array<ArticleCategory>();
      this.showInputHeadPictureArea = false;
      this.waitingMove = false;
      this.loadHeadData = false;
  }
  ngOnInit() {
    this.article = new Article(null,null,null);
    this.getArticleSubscribe = this.route.data.subscribe(resolver =>{ 
      if((resolver.data as Article).published==false){
        this.authService.checkAdmin().subscribe(
          (yesAdmin)=>{ if(yesAdmin){
             this.article = resolver.data;
             this.setHeadFormData();
            } else{
              this.authService.logout();
              this.router.navigate(['/admin/logon']);
            }
          },
          ()=>{
              this.authService.logout();
              this.router.navigate(['/admin/logon']);
          });
      } else {
        this.article = resolver.data;
        this.setHeadFormData();
     }
    });

    this.getCategoriesSubscribe = this.route.parent.parent.data.subscribe(resolver =>{ 
      this.categories = resolver.data.categories;
    });

   
  }
  private setHeadFormData(){
    this.form = new FormGroup({
      head: new FormControl(this.article?.head, [MyValidators.validateEmptyText(), Validators.maxLength(60)]), 
      shortDescription: new FormControl(this.article?.shortDescription, [MyValidators.validateEmptyText(), Validators.maxLength(200)]),
      articleCategory: new FormControl(this.article.category?.id),
      hotNews: new FormControl(this.article?.hotNews),
      published: new FormControl(this.article?.published),
      src: new FormControl(this.article?.srcHeadPicture, Validators.required)
    });
    this.loadHeadData = true;
  }


  //----------------------------------------
  updateFileHeadPicture(file: File){
    this.form.controls['src'].setValue('new img');
    this.article.fileHeadPicture = file;
  }
  
  updateSrcHeadPicture(src: string){
    this.article.srcHeadPicture = src;
  }
  

  submitArticleHead(){
    const formData = new FormData();
    if (this.article.fileHeadPicture){
      formData.append('formData', this.article.fileHeadPicture);
    }
    this.article.head = this.form.controls['head'].value;
    this.article.shortDescription = this.form.controls['shortDescription'].value;
    this.article.hotNews = this.form.controls['hotNews'].value;
    this.article.category = new ArticleCategory(this.form.controls['articleCategory'].value,"");
    this.article.published = this.form.controls['published'].value;
    formData.append('JSON', JSON.stringify(this.article));
    this.putArticleSubscribe = this.dataService.putMultipartDatas(formData, 'put-multipart-data', new Map<string, string>().set('type','article')).subscribe();
  }
  
  deleteArticle(){
    let queryParams = new Map<string, string>();
      queryParams.set('id', this.article.id.toString());
    this.delArticleSubscribe = this.dataService.delUserDatas('delete-article', queryParams).subscribe( () => {
      this.router.navigate([''], {queryParams:{'rest':'true'}});
    } );
  }
  //----------------------------------------

  addArticleSection(){
    this.postArticleSectionSubscribe = this.dataService.postUserDatas<Section, Section>(new Section(this.article.id, 0,'center', 'startInput'),'new-section')
        .subscribe(section => {
          this.messagesService.setOKPostMessage();
          (this.article.sections as Map<number, ArticleSection>).set(section.sectionNumber, new ArticleSection());
          (this.article.sections as Map<number, ArticleSection>).get(section.sectionNumber).inputSectionId = section.id;
        });
  }

  moveSection(sectionIdx: number, direction: number){
    if(this.isMapArticleSection(this.article.sections)
      ){
        this.waitingMove = true;
        let newSectionNumber = sectionIdx + direction;
        let overflow = false;
        if(!this.article.sections.has(newSectionNumber)){
          do{
            newSectionNumber+=direction;
            if(newSectionNumber==-1 || newSectionNumber>100){
              overflow = true; break;
            }
          } while(!this.article.sections.has(newSectionNumber))
        }
        if(!overflow){
          let newSctionSort = new Array<SectionSort>();
          
          let thisSubSections = this.article.sections.get(sectionIdx).getSectionIdAndNewNumber(newSectionNumber);
          let swapSubSections = this.article.sections.get(newSectionNumber).getSectionIdAndNewNumber(sectionIdx);

          newSctionSort = newSctionSort.concat(thisSubSections.length>0?thisSubSections:this.article.sections.get(sectionIdx).getInputSectionIdAndNewNumber(newSectionNumber));
          newSctionSort = newSctionSort.concat(swapSubSections.length>0?swapSubSections:this.article.sections.get(newSectionNumber).getInputSectionIdAndNewNumber(sectionIdx));
          
          this.putArticleSubSectionSubscribe = this.dataService.putUserDatas<Array<SectionSort>, null>(newSctionSort, "new-sort").subscribe(()=>{
            if(this.isMapArticleSection(this.article.sections)){
              let temp = this.article.sections.get(newSectionNumber);
              this.article.sections.set(newSectionNumber,  this.article.sections.get(sectionIdx));
              this.article.sections.set(sectionIdx, temp);
              this.waitingMove = false;
            }
          }, 
          ()=>{this.waitingMove = false});
        } else {
          this.waitingMove = false;
          this.messagesService.setMessage(new MyMessage(true, "Article is bed, you have to recreate it!"));
        }
    }
  }

  deleteSection(sectionIdx: number){
    let queryParams = new Map<string, string>();
    queryParams.set("idArt", this.article.id.toString());
    queryParams.set("idSect", sectionIdx.toString());
    this.delArticleSectionSubscribe = this.dataService.delUserDatas('del-article-section', queryParams).subscribe(
      () =>{(this.article.sections as Map<number, ArticleSection>).delete(sectionIdx);}
    );
  }
  //-----------------------------
  
  private isMapArticleSection(data: Map<number, ArticleSection> | Array<Section>): data is Map<number, ArticleSection> {
    return (<Map<number, ArticleSection>>data).keys !== void 0}

  startInputSubSection(sectionNumber: number, sectionPosition: positions){
    if(this.isMapArticleSection(this.article.sections)){
      switch(sectionPosition){
        case 'left': {this.article.sections.get(sectionNumber).leftSectionType = 'startInput';
                      setTimeout(()=>{ 
                        if(this.isMapArticleSection(this.article.sections) && 
                          this.article.sections.get(sectionNumber).leftSectionType == 'startInput') 
                          this.article.sections.get(sectionNumber).leftSectionType = undefined
                        }, 2500); 
                      break;}
        case 'center': {this.article.sections.get(sectionNumber).centerSectionType = 'startInput'; 
                      setTimeout(()=>{ 
                        if(this.isMapArticleSection(this.article.sections) && 
                           this.article.sections.get(sectionNumber).centerSectionType == 'startInput') 
                        this.article.sections.get(sectionNumber).centerSectionType = undefined
                        }, 2500); 
                      break;}
        case 'right': {this.article.sections.get(sectionNumber).rightSectionType = 'startInput'; 
                      setTimeout(()=>{
                        if(this.isMapArticleSection(this.article.sections) && 
                          this.article.sections.get(sectionNumber).rightSectionType == 'startInput')
                        this.article.sections.get(sectionNumber).rightSectionType = undefined
                      }, 2500); 
                      break;}
        default: {console.warn('section positions type not found');}
      }
    }
  }

  addSubSection(sectionType: sections, sectionPosition: positions, sectionNumber: number){
    let newSubSection = new Section(this.article.id, sectionNumber,sectionPosition,sectionType);
    this.addSubSectionSubscribe = this.dataService.postUserDatas<Section, Section>(newSubSection, "post-sub-section-data").subscribe(
      ()=>{
        this.addOrDeleteSubSections(sectionType, sectionPosition, sectionNumber)
      }
    );
  }

  private addOrDeleteSubSections(sectionType: sections, sectionPosition: positions, sectionNumber: number){
    if(this.isMapArticleSection(this.article.sections)){
      switch(sectionPosition){
        case 'left': {this.article.sections.get(sectionNumber).leftSectionType = sectionType;
                      this.article.sections.get(sectionNumber).leftSectionData =  this.bulderSubSection(sectionType);
                    break;}
        case 'center': {this.article.sections.get(sectionNumber).centerSectionType = sectionType; 
                        this.article.sections.get(sectionNumber).centerSectionData = this.bulderSubSection(sectionType);
                      break;}
        case 'right': {this.article.sections.get(sectionNumber).rightSectionType = sectionType; 
                        this.article.sections.get(sectionNumber).rightSectionData = this.bulderSubSection(sectionType);
                      break;}
        default: {console.warn('section positions type not found');}
      }
   }
  }

  private bulderSubSection(sectionType: sections): ISectionData{
    switch(sectionType){
      case 'citation': {return new ArticleCitation();}
      case 'picture': {return new ArticlePicture();}
      case 'slider': {return new ArticleSlider()}
      case 'text': {return new ArticleText();}
      case 'video': { return new ArticleVideo()}
      default: return undefined;
    }
  }

  updateSubSection(sectionData: ISectionData, sectionPosition: positions, sectionNumber: number){
    if(this.isMapArticleSection(this.article.sections)){
      switch(sectionPosition){
        case 'left': {this.article.sections.get(sectionNumber).leftSectionData =  sectionData;
                    break;}
        case 'center': {this.article.sections.get(sectionNumber).centerSectionData = sectionData;
                      break;}
        case 'right': {this.article.sections.get(sectionNumber).rightSectionData = sectionData;
                      break;}
        default: {console.warn('section positions type not found');}
      }
    }
  }

  delSubSection(sectionPosition: positions, sectionNumber: number){
    let queryParams = new Map<string, string>();
    queryParams.set('idArt', this.article.id.toString());
    queryParams.set('idSect', sectionNumber.toString());
    queryParams.set('pos', sectionPosition.toString());
    this.delArticleSubSectionSubscribe = this.dataService.delUserDatas('delete-sub-section', queryParams).subscribe(
      ()=>{ 
        this.addOrDeleteSubSections(undefined, sectionPosition, sectionNumber);
        if((this.article.sections as Map<number, ArticleSection>).get(sectionNumber).checkEmpty()){
          (this.article.sections as Map<number, ArticleSection>).delete(sectionNumber);
        }
       }
      );
  }

  //------------------------------
  ngOnDestroy(){
    if(this.getCategoriesSubscribe){this.getCategoriesSubscribe.unsubscribe();}
    if(this.getArticleSubscribe){this.getArticleSubscribe.unsubscribe();}
    if(this.delArticleSubscribe){this.delArticleSubscribe.unsubscribe();}
    if(this.putArticleSubscribe){this.putArticleSubscribe.unsubscribe();}
    if(this.postArticleSectionSubscribe){this.postArticleSectionSubscribe.unsubscribe();}
    if(this.delArticleSubSectionSubscribe){this.delArticleSubSectionSubscribe.unsubscribe();}
    if(this.putArticleSubSectionSubscribe){this.putArticleSubSectionSubscribe.unsubscribe();}
    if(this.delArticleSectionSubscribe){this.delArticleSectionSubscribe.unsubscribe();}
    if(this.addSubSectionSubscribe){this.addSubSectionSubscribe.unsubscribe();}
  }
}
