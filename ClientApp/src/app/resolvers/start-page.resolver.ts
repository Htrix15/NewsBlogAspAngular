import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import {catchError} from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { StartDatas } from '../services-models/start-datas';
import { environment } from 'src/environments/environment';

@Injectable()
export class StartPageResolver implements Resolve<Observable<HttpErrorResponse | StartDatas>> {

    constructor(private dataService:DataService){
    }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HttpErrorResponse | StartDatas>
    {
        return this.dataService.getUserDatas<StartDatas>('start-page', new Map<string, string>().set('count',environment.countStartArticleByCategory.toString()))
        .pipe(
            catchError(err => of(err))
        )
    }
}