import { ISectionData } from '../shared/i-section-data';
import { ArticleCitation } from './article-citation';
import { ArticleVideo } from './article-video';
import { ArticleSlider } from './article-slider';

export class ArticlePicture  implements ISectionData{
    constructor(
        public src?: string | ArrayBuffer,
        public description?: string, 
        public id?: number,
        public file?: File

    ){}

    getCitation():ArticleCitation {
        return null;
    }

    getText(): string {
        return null;
    }

    getPicture():ArticlePicture {
        return this;
    }

    getVideo(): ArticleVideo{
        return null;
    }
    getPictures(): ArticleSlider{
        return null;
    }
}
