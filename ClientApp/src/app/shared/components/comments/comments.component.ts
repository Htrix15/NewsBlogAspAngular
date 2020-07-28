import { Component, OnInit, ElementRef, ViewChild, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth-service.service';
import { DataService } from 'src/app/services/data.service';
import { Subscription } from 'rxjs';
import { UserCommentBase } from 'src/app/models/user-comment-base';
import { AuthUser } from 'src/app/services-models/auth-user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { UserComment } from 'src/app/models/user-comment';
import { MyValidators } from 'src/app/shared/MyValidators';
import { authType } from 'src/app/shared/my-types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit {

  public noShowComment: boolean;
  public startInputNewComment: boolean;
  private lockAddComments:boolean;
  public comments: Array<UserCommentBase>;
  public authUser: AuthUser;
  public authAdmin: boolean;
  public adminPages: boolean;
  private countAdditionalComments: number;
  private countShowComments: number;
  public answerComments: Map<number, number>;
  public formNewComment: FormGroup;

  @ViewChild('scroller') scroller: ElementRef;
  @Input() articleId:number;

  private deleteCommentSubscribe: Subscription;
  private adminDeleteCommentSubscribe: Subscription;
  private newCommentSubscribe: Subscription;
  private editCommentSubscribe: Subscription;
  private getAddAnswerCommentsSubscribe: Subscription;
  private getAddCommentsSubscribe: Subscription;


  constructor(  private authService: AuthService,
    private router: Router,
    private dataService: DataService) { 
      this.noShowComment = true; 
      this.authAdmin = false;
      this.lockAddComments = false;
      this.comments = new Array<UserCommentBase>();
      this.startInputNewComment = false;
      this.formNewComment = new FormGroup({});
      this.countAdditionalComments = 0;
      this.countShowComments = environment.countShowComments;
      this.answerComments = new Map<number, number>();
      this.adminPages = false;
    }

  ngOnInit() {
    if(this.articleId!=null){
      this.authUser = this.authService.getUser();
    } else{
      this.adminPages=true;
      this.authAdmin=true;
      this.noShowComment=false;
      this.articleId = -1;
      this.authUser = new AuthUser("admin@admin.ru", "Admin","Admin","Admin","vk");
    }

  }


  showComments(){
    this.noShowComment = false;
    this.authService.checkAdmin().subscribe(
      (yesAdmin)=>{ this.authAdmin = yesAdmin
        this.authUser = new AuthUser("admin@admin.ru", "Admin","Admin","Admin","vk")},
      ()=>{this.authAdmin= false}
    );
    this.startInput();
  }

  startInput(parentCommentId?: number, grandParentCommentId?: number, commentId?:number, text?:string){
    
    if(commentId || parentCommentId){
      window.scrollBy(0,700);
    }

    let parentId = grandParentCommentId?grandParentCommentId:parentCommentId;
    this.formNewComment = new FormGroup({
        commentId: new FormControl(commentId),
        editType: new FormControl(commentId?'put':'post'),
        parentCommentId: new FormControl(parentId),
        text: new FormControl(text, [MyValidators.validateEmptyText(), Validators.maxLength(400)])
      }
    );
  }

  delComment(commentId:number, iComment:number){
    let queryParams = new Map<string, string>();
      queryParams.set("commentId",commentId.toString());
      queryParams.set("authorId", this.authUser.userId);
      queryParams.set("authType", this.authUser.type);
      this.deleteCommentSubscribe = this.dataService.delUserDatas('delete-comment', queryParams).subscribe(
      ()=>{
        let thisComment = this.comments.find(comment=> comment.id==commentId);
        this.comments.find(comment=>comment.id==thisComment.parentId).countAnswer--;
        this.comments.splice(iComment,1);
      }
    );
  }

  adminDelComment(commentId:number, iComment:number, parentId?:number){
    let queryParams = new Map<string, string>();
      queryParams.set("commentId",commentId.toString());
      queryParams.set("authorId", "0");
      queryParams.set("authType", "vk");
    this.adminDeleteCommentSubscribe = this.dataService.delUserDatas('admin-delete-comment', queryParams).subscribe(
      ()=>{
        let thisComment = this.comments.find(comment=> comment.id==commentId);
        if(this.answerComments.has(commentId)){
          this.comments.splice(iComment, thisComment.countAnswer+1);
          this.answerComments.delete(commentId);
        } else{
          this.comments.splice(iComment, 1);
        }
        if(parentId){
          this.comments.find(comment=>comment.id==parentId).countAnswer--;
        }
      }
    );
  }

  sendNewComment(){
    let text =  this.formNewComment.controls['text'].value;
    switch(this.formNewComment.controls['editType'].value){
      case('post'):{
        let parentCommentId = this.formNewComment.controls['parentCommentId'].value;
        let newComment = new UserComment(0, null, this.authUser.firstName, text, 0, null, 
          this.authUser.userId, this.authUser.email, this.authUser.type, null,null,parentCommentId, this.articleId);  
        this.newCommentSubscribe = this.dataService.postUserDatas<UserComment, UserCommentBase>(newComment,'new-comment').subscribe(
          (newComment)=>{
            this.formNewComment.reset();
            this.formNewComment.controls['editType'] = new FormControl('post');
            if(!parentCommentId){
              this.comments.unshift(newComment);
            } else{
              this.comments.find(comment=>comment.id==parentCommentId).countAnswer++;
              let comment = this.comments.find(comment=>comment.id==parentCommentId);
              if(this.answerComments.has(parentCommentId)){
                let answerCount = this.answerComments.get(parentCommentId)+1;
                this.comments.splice( this.comments.indexOf(comment) + answerCount, 0, newComment);
                this.answerComments.set(parentCommentId, answerCount);
              }
            }
          }
        );    
        break;
      }
      case('put'):{
        let commentId =  this.formNewComment.controls['commentId'].value;
        let baseComment = this.comments.find(comment=>comment.id==commentId);
        baseComment.text = text;
        let editComment = UserComment.createForBase(baseComment, this.authUser.userId,  this.authUser.type, this.authUser.email);
        this.editCommentSubscribe = this.dataService.putUserDatas<UserComment, null>(editComment, 'edit-comment').subscribe(
          ()=>{
            this.formNewComment.reset();
            this.formNewComment.controls['editType'] = new FormControl('post');
          });
        break;
      }
      default:{
        break;
      }
    }
  }

  showAnswer(commentId:number, iComment:number, button:HTMLButtonElement){
    if(!this.answerComments.has(commentId)){
      let queryParams = new Map<string, string>();
      queryParams.set("articleId", this.articleId.toString());
      queryParams.set("skip", "0");
      queryParams.set("take", "0");
      queryParams.set("parentId", commentId.toString());
      queryParams.set("authorId", this.authUser?this.authUser.userId:"_");
      queryParams.set("authType", this.authUser?this.authUser.type:"vk");
      this.getAddAnswerCommentsSubscribe = this.dataService.getUserDatas<UserCommentBase[]>("get-add-comments", queryParams).subscribe(
        (comments)=>{
          this.comments.splice(iComment+1,0, ...comments);
          this.answerComments.set(commentId, comments.length);
          button.textContent = 'Скрыть обсуждение';
        }
      );
    } else{
      this.comments.splice(iComment+1,this.answerComments.get(commentId));
      this.answerComments.delete(commentId);
      button.textContent = `Открыть обсуждение (${this.comments[iComment].countAnswer})`;
    }
  }

  autoAddingComments(commentsBox:HTMLDivElement){
    this.addingComments(commentsBox);
  }

  loadAdditionalComments(commentsBox:Event){
    if(this.checkScroll(commentsBox.target as HTMLDivElement)){
      this.addingComments(commentsBox.target as HTMLDivElement);
    }
  }
  
  private addingComments(scroller: HTMLDivElement){
    if(!this.lockAddComments){
      this.lockAddComments = true;
      let queryParams = new Map<string, string>();
      queryParams.set("articleId", this.articleId.toString());
      queryParams.set("skip", this.countAdditionalComments.toString());
      queryParams.set("take", this.countShowComments.toString());
      queryParams.set("parentId", null);
      queryParams.set("authorId", this.authUser?this.authUser.userId:"_");
      queryParams.set("authType", this.authUser?this.authUser.type:"vk");
      this.getAddCommentsSubscribe = this.dataService.getUserDatas<UserCommentBase[]>("get-add-comments", queryParams).subscribe(
        comments =>{
          if(comments.length!=0){
            this.comments = this.comments.concat(comments);
            this.countAdditionalComments+=this.countShowComments;
            this.lockAddComments = false;
            setTimeout(()=> {
              if(this.checkScroll(scroller)){
                this.addingComments(scroller);
              }
            }, 100);
          } else{
            this.lockAddComments = true;
          }
        });
    } 
  }

  private checkScroll(scroller: HTMLDivElement): boolean{
    let scrollBottom = scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight;
    return ((scrollBottom<environment.scrollLimitPxToAdding))
  }

  authForService(service:authType){
    let href = this.authService.getAuthHref(service);
    if(href){
      localStorage.setItem('return', this.articleId.toString());
      window.location.assign(href);
    }
  }
  
  ngOnDestroy(): void {
    if(this.deleteCommentSubscribe){this.deleteCommentSubscribe.unsubscribe();}
    if(this.adminDeleteCommentSubscribe){this.adminDeleteCommentSubscribe.unsubscribe();}
    if(this.newCommentSubscribe){this.newCommentSubscribe.unsubscribe();}
    if(this.editCommentSubscribe){this.editCommentSubscribe.unsubscribe();}
    if(this.getAddAnswerCommentsSubscribe){this.getAddAnswerCommentsSubscribe.unsubscribe();}
    if(this.getAddCommentsSubscribe){this.getAddCommentsSubscribe.unsubscribe();}
  }

  goToArticle(commentId:number):void{
    this.dataService.getUserDatas<number>("go-to-article", new Map<string, string>().set("commentId", commentId.toString())).subscribe(
      (articleId:number)=>{
        this.router.navigate(['/news', articleId]);
      }
    )
  }
}
