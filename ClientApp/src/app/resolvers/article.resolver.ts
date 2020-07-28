import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { DataService } from '../services/data.service';
import { Article } from '../models/article';
import {map, catchError} from 'rxjs/operators';
import { Section } from '../models/section';
import { ArticleSection } from '../services-models/article-section';
import { ISectionData } from '../shared/i-section-data';
import { ArticleCitation } from '../services-models/article-citation';
import { ArticleText } from '../services-models/article-text';
import { ArticlePicture } from '../services-models/article-picture';
import { ArticleSlider } from '../services-models/article-slider';
import { ArticleVideo } from '../services-models/article-video';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth-service.service';

@Injectable()
export class ArticleResolver implements Resolve<HttpErrorResponse | Article> {

    constructor(private dataService:DataService, private router: Router, private authService:AuthService){
    }

    resolve(route: ActivatedRouteSnapshot): Observable<HttpErrorResponse | Article> 
    {
        let queryParams = new Map<string, string>();
        queryParams.set("articleId", route.params?.id.toString());

        return this.dataService.getUserDatas<Article>('article', queryParams) 
        .pipe(
            map((article) => {
                try{                
                    article.sections = this.convertSectionsToFrontFormat(article.sections as Array<Section>);
                    return article; 
                } catch {
                    return null;
                }
            }),
            catchError(err => of(err))
        )

    }

    private createSlider(section: Section, id: number ):ArticleSlider{
        let descs:Array<string> = JSON.parse(section.description);
        let srcs:Array<string> = JSON.parse(section.src);
        let result = new ArticleSlider();
        if( !descs?.length || !srcs?.length || (descs.length != srcs.length) || (descs.length==0 && srcs.length == 0)){

            result.pictures.push(new ArticlePicture(null, null));
            result.pictures.push(new ArticlePicture(null, null));
            return result;
        }
        for(let i=0; i <descs.length; i++){
            result.pictures.push(new ArticlePicture(srcs[i], descs[i]))
        }
        result.id = id;
        return result;
    }

    private convertSectionData(section: Section):ISectionData{
        switch(section.sectionType){
            case('citation'):{ return new ArticleCitation(section?.text, section?.description, section.id);}
            case('text'):{return new ArticleText(section?.text, section.id);}
            case('picture'):{return new ArticlePicture(section?.src, section?.description, section.id)}
            case('slider'):{ return this.createSlider(section, section.id);}
            case('video'):{return new ArticleVideo(section?.src, section?.description, section.id)}
            default: {return null;}
        }
    }

    private convertSectionsToFrontFormat(sectionsServerFormat:Array<Section>): Map<number, ArticleSection>{
        let result: Map<number, ArticleSection> = new Map<number, ArticleSection>();
        try{
            sectionsServerFormat.forEach(section  => {
                let tempArticleSection = new ArticleSection();
                let newValue = false;
                if(result.get(section.sectionNumber)){
                    tempArticleSection = result.get(section.sectionNumber);
                } 
                else {
                    newValue = true;
                }
                switch(section.sectionPosition){
                    case('left'):{
                        tempArticleSection.leftSectionType = section.sectionType;
                        tempArticleSection.leftSectionData = this.convertSectionData(section);
                        break;}
                    case('right'):{
                        tempArticleSection.rightSectionType = section.sectionType;
                        tempArticleSection.rightSectionData = this.convertSectionData(section);
                        break;}
                    case('center'):{
                        tempArticleSection.centerSectionType = section.sectionType;
                        tempArticleSection.centerSectionData = this.convertSectionData(section);
                        break;}
                    case(null):{
                        tempArticleSection.inputSectionId = section.id;
                        break;}    
                    default:{ break;}    
                }
                if(newValue){
                    result.set(section.sectionNumber, tempArticleSection);
                }
            });
            return result;
        } catch {
            return null;
        }
    }

}