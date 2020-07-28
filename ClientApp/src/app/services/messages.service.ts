import { Injectable } from '@angular/core';
import { MyMessage } from '../services-models/my-message';
import { Subject } from 'rxjs/internal/Subject';

@Injectable()
export class MessagesService {

    public getMessage$:Subject<MyMessage>; 

    constructor(){
        this.getMessage$ = new Subject<MyMessage>();
    }

    setMessage(message: MyMessage) {
        this.getMessage$.next(message);
    }
    setOKPutMessage(){
        this.getMessage$.next(new MyMessage(false, "Обновленно!"));        
    }
    setOKPostMessage(){
        this.getMessage$.next(new MyMessage(false, "Добавленно!"));        
    }
    setOKDelMessage(){
        this.getMessage$.next(new MyMessage(false, "Удалено!"));        
    }
    setOKLogoninMessage(){
        this.getMessage$.next(new MyMessage(false, "Вход выполнен!"));        
    }

}
