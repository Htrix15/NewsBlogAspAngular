import { Component, OnInit} from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ArticleBase } from 'src/app/models/article-base';
import { ArticleCategory } from 'src/app/models/article-category';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth-service.service';
import { MessagesService } from 'src/app/services/messages.service';
import { MyMessage } from 'src/app/services-models/my-message';


@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {

  public articles:Array<ArticleBase>;
  public categories: Array<ArticleCategory>;
  public checkError:boolean;
  public showReturn:boolean;

  private countAdditionalArticles:Map<number, number>; 
  private countShowArticle:number;
  private lockAdditionalArticles:Map<number, boolean>;
  private mainSubscribe: Subscription;
  private addingArticlesSubscribe: Subscription;
  private authSubscribe: Subscription;

  constructor(private dataService: DataService, 
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService,
    private messageService: MessagesService) { 
      this.articles = new Array<ArticleBase>();
      this.categories = new Array<ArticleCategory>();
      this.checkError = false;
      this.countAdditionalArticles = new Map<number, number>();
      this.lockAdditionalArticles = new Map<number, boolean>();
      this.countShowArticle = environment.countStartArticleByCategory;
      this.showReturn = false;
  }

  ngOnInit() {

    this.mainSubscribe = this.route.data.subscribe(resolver =>{ 
      this.articles = resolver.data.articles;
      this.categories = resolver.data.categories;  
     }, 
      ()=>{this.router.navigate(['/error']);}
      ); 

    this.categories?.forEach(category => 
      this.lockAdditionalArticles.set(category.id, false));
    
    this.authSubscribe = this.authService.getUserAuth(location.href).subscribe(()=>{}, 
      ()=>{this.messageService.setMessage(new MyMessage(true,"Что-то не так с авторизацией, попробуйте зайтич ерез другой сервис"))});
    
    if(localStorage.getItem('return')){
      this.showReturn=true;
    }  
  }

  returnToArticle(checkReturn:boolean){
    let articleId = localStorage.getItem('return');
    if(checkReturn && articleId){
      localStorage.removeItem('return')
      this.router.navigate(['/news', articleId]);
      this.showReturn=false;
    } else {
      localStorage.removeItem('return')
      this.showReturn=false;
    }
  }


  private addingArticles(idCategory: number, scroller: HTMLDivElement){
    if(!this.lockAdditionalArticles.get(idCategory)){
      let count = 0;
      this.lockAdditionalArticles.set(idCategory, true);

      if(this.countAdditionalArticles.has(idCategory)){
        count = this.countAdditionalArticles.get(idCategory) + this.countShowArticle;
      } else {
        count = this.countShowArticle;
      }
      this.countAdditionalArticles.set(idCategory, count);

      let queryParams = new Map<string, string>();
      queryParams.set("id", idCategory.toString());
      queryParams.set("skip", count.toString());
      queryParams.set("take", this.countShowArticle.toString());
      queryParams.set("pub", 'true');

      this.addingArticlesSubscribe = this.dataService.getUserDatas<ArticleBase[]>("get-add-articles", queryParams).subscribe(
        articles =>{
          if(articles.length!=0){
            this.articles = this.articles.concat(articles);
            this.lockAdditionalArticles.set(idCategory, false);
            setTimeout(()=> {
              if(this.checkScroll(scroller)){
                this.addingArticles(idCategory, scroller);
              }
            }, 100);
            if(articles.length<environment.countStartArticleByCategory){
              this.lockAdditionalArticles.set(idCategory, true);
            }
          } else{
            this.lockAdditionalArticles.set(idCategory, true);
          }
        },
        () => {} 
      );
    }
  }

  private checkScroll(articlesBox: HTMLDivElement): boolean{
    let scrollRight = articlesBox.scrollWidth - articlesBox.scrollLeft - articlesBox.clientWidth;
    return ((scrollRight<environment.scrollLimitPxToAdding))
  }

  autoAddingArticles(articlesBox:HTMLDivElement, idCategory:number){
    this.addingArticles(idCategory, articlesBox);
  }

  scrollAdditionalArticles(articlesBox:Event, idCategory: number){
    if(this.checkScroll(articlesBox.target as HTMLDivElement)){
      this.addingArticles(idCategory, articlesBox.target as HTMLDivElement);
    }
  }

  routing(id:string){
    this.router.navigate(['/news', id]);
  }

  ngOnDestroy(){
    if(this.mainSubscribe){this.mainSubscribe.unsubscribe();}  
    if(this.addingArticlesSubscribe){this.addingArticlesSubscribe?.unsubscribe();}
    if(this.authSubscribe){this.authSubscribe.unsubscribe();}
  }
}
