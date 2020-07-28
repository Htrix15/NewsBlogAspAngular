import { ISectionData } from '../shared/i-section-data';
import { ArticleCitation } from './article-citation';
import { ArticlePicture } from './article-picture';
import { ArticleVideo } from './article-video';

export class ArticleSlider implements ISectionData{

    public pictures: Array<ArticlePicture>
    public id?: number
    
    constructor(){
        this.pictures = new Array<ArticlePicture>();
    }

    getCitation():ArticleCitation {
        return null;
    }

    getText(): string {
        return null;
    }

    getPicture():ArticlePicture {
        return null;
    }

    getVideo(): ArticleVideo{
        return null;
    }

    getPictures(): ArticleSlider{
        return this;
    }
}
