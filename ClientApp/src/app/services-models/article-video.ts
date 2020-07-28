import { ISectionData } from '../shared/i-section-data';
import { ArticleCitation } from './article-citation';
import { ArticlePicture } from './article-picture';
import { ArticleSlider } from './article-slider';

export class ArticleVideo implements ISectionData{
    constructor(
        public src?: string,
        public description?: string,
        public id?: number 
    ){}
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
        return this;
    }
    
    getPictures(): ArticleSlider{
        return null;
    }
}
