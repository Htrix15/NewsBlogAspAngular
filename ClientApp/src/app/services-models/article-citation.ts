import { ISectionData } from '../shared/i-section-data';
import { ArticlePicture } from './article-picture';
import { ArticleVideo } from './article-video';
import { ArticleSlider } from './article-slider';

export class ArticleCitation implements ISectionData{
    constructor(
        public text?: string,
        public author?: string,
        public id?: number
    ){}

    getCitation():ArticleCitation {
        return this;
    }

    getText(): string {
        return this.text;
    }

    getPicture():ArticlePicture {
        return null;
    }
    getVideo(): ArticleVideo{
        return null;
    }
    getPictures(): ArticleSlider{
        return null;
    }
}
