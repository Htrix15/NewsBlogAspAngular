import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ArticleCategory } from 'src/app/models/article-category';
import { DataService } from 'src/app/services/data.service';
import { ArticleBase } from 'src/app/models/article-base';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MessagesService } from 'src/app/services/messages.service';
import { AuthService } from 'src/app/services/auth-service.service';



@Component({
  selector: 'app-category-page',
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})

export class CategoryPageComponent implements OnInit { 

  @ViewChild('scroller') scroller: ElementRef;

  private thisCategory:number;
  public articles: Array<ArticleBase>;
  private countAdditionalArticles: number;
  private countShowArticle: number;
  private lockAddArticle:boolean;
  private viewPublished:boolean;
  admin:boolean;

  private getArticlesSubscribe: Subscription; 
  private postArticlesSubscribe: Subscription; 
  private getAdminSubscribe: Subscription; 
  
  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private location:Location, 
    private dataService: DataService,
    private messagesService:MessagesService,
    private authService:AuthService) {
      this.articles = new Array<ArticleBase>();
      this.lockAddArticle = false;
      this.viewPublished = true;
      this.countAdditionalArticles = 0;
      this.countShowArticle = environment.countStartArticleByCategory;
      this.admin = false;
  }

  ngOnInit() {
    let idCategory = (this.location.getState() as ArticleCategory).id;
    if(idCategory){
      this.thisCategory = idCategory;
    }
    else{
      this.thisCategory = Number(this.route.snapshot.params['id']); 
    }

    this.getAdminSubscribe = this.authService.checkAdmin().subscribe(
      (yesAdmin)=>{ if(yesAdmin) {this.admin = true;} else {this.admin = false; this.authService.logout();}},
      ()=>{this.admin = false; this.authService.logout();});

  }

  showUnpublishedNews(button:HTMLButtonElement){
    this.viewPublished = !this.viewPublished;
    if(this.viewPublished){
      button.textContent = 'Неопубликованные статьи';
    } else{
      button.textContent = 'Опубликованные статьи';
    }
    this.countAdditionalArticles = 0;
    this.lockAddArticle = false;
    this.scroller.nativeElement.scrollTop = -1;
    this.articles = new Array<ArticleBase>();
    this.addingArticles(this.scroller.nativeElement);
  }

  autoAddingArticles(articlesBox:HTMLDivElement){
    this.addingArticles(articlesBox);
  }

  loadAdditionalArticles(articlesBox:Event){
    if(this.checkScroll(articlesBox.target as HTMLDivElement)){
      this.addingArticles(articlesBox.target as HTMLDivElement);
    }
  }
  
  private addingArticles(scroller: HTMLDivElement){
    if(!this.lockAddArticle){
      this.lockAddArticle = true;
      let queryParams = new Map<string, string>();
      queryParams.set("id", this.thisCategory.toString());
      queryParams.set("skip", this.countAdditionalArticles.toString());
      queryParams.set("take", this.countShowArticle.toString());
      queryParams.set("pub", `${this.viewPublished}`);

      this.getArticlesSubscribe = this.dataService.getUserDatas<ArticleBase[]>("get-add-articles", queryParams).subscribe(
        articles =>{
          if(articles.length!=0){
            this.articles = this.articles.concat(articles);
            this.countAdditionalArticles+=this.countShowArticle;
            this.lockAddArticle = false;
            setTimeout(()=> {
              if(this.checkScroll(scroller)){
                this.addingArticles(scroller);
              }
            }, 100);
          } else{
            this.lockAddArticle = true;
          }
        });
    } 
  }
  
  private checkScroll(scroller: HTMLDivElement): boolean{
    let scrollBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    return ((scrollBottom<environment.scrollLimitPxToAdding))
  }

  newNews(){
    this.postArticlesSubscribe = this.dataService.postUserDatas<ArticleCategory,ArticleBase>(new ArticleCategory(this.thisCategory,"new"),"add-article").subscribe(
      newArticle => { this.messagesService.setOKPostMessage();
        this.router.navigate([`/news/${newArticle.id}/edit`]);
      }
    );
  }

  goNews(idNews: number){
    this.router.navigate([`/news/${idNews}`]);
  }

  ngOnDestroy(){
    if(this.postArticlesSubscribe){this.postArticlesSubscribe.unsubscribe();}
    if(this.getArticlesSubscribe){this.getArticlesSubscribe.unsubscribe();}
    if(this.getAdminSubscribe){this.getAdminSubscribe.unsubscribe();}
  }

}
