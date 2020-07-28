import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MessagesService } from './services/messages.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  public chechMessage:boolean;
  public textMessage:string;
  public typeMessageError:boolean;
  private messageSubscribe: Subscription; 

  constructor(private messageService: MessagesService) {
    this.chechMessage = false;
    this.typeMessageError = true;
  }

  ngOnInit() {
      this.messageSubscribe =  this.messageService.getMessage$.subscribe((message)=>{ 
        this.textMessage = message.messageText;
        this.typeMessageError = message.error;
        this.chechMessage = true;
        setTimeout(()=>{this.chechMessage=false;},3000);
    });

  }

  ngOnDestroy() { 
    if (this.messageSubscribe){ 
      this.messageSubscribe.unsubscribe(); 
    } 
  }
}
