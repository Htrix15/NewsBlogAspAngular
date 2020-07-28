import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Article } from 'src/app/models/article';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth-service.service';

@Component({
  selector: 'app-news-page',
  templateUrl: './news-page.component.html',
  styleUrls: ['./news-page.component.scss']
})
export class NewsPageComponent implements OnInit {

  public article: Article;
  private mainSubscribe: Subscription;


  constructor(private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService) {
  }

  ngOnInit() {
    this.article = new Article(null,null,null);
    this.mainSubscribe = this.route.data.subscribe(resolver =>{ 
      if((resolver.data as Article).published==false){
        this.authService.checkAdmin().subscribe(
          (yesAdmin)=>{ if(yesAdmin){
              this.article = resolver.data;
            } else {
              this.authService.logout();
              this.router.navigate(['/admin/logon']);
            }
          }
          ,
          ()=>{
              this.authService.logout();
              this.router.navigate(['/admin/logon']);
          });
      } else {
        this.article = resolver.data;
     }
    }, ()=>this.router.navigate(['/error']));

  }

  ngOnDestroy() {
    if(this.mainSubscribe){this.mainSubscribe.unsubscribe()}  
  }
}
