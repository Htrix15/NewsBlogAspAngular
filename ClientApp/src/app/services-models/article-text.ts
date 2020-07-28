import { ISectionData } from '../shared/i-section-data';
import { ArticleCitation } from './article-citation';
import { ArticlePicture } from './article-picture';
import { ArticleVideo } from './article-video';
import { ArticleSlider } from './article-slider';

export class ArticleText implements ISectionData{
    constructor(
        public text?:string,
        public id?: number
    ){}

    getText(): string {
        return this.text
    }
    getCitation(): ArticleCitation {
        return null;
    }
    getPicture(): ArticlePicture {
        return null;
    }
    getVideo(): ArticleVideo{
        return null;
    }
    getPictures(): ArticleSlider{
        return null;
    }
}
