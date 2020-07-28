import { ArticleCitation } from '../services-models/article-citation';
import { ArticlePicture } from '../services-models/article-picture';
import { ArticleVideo } from '../services-models/article-video';
import { ArticleSlider } from '../services-models/article-slider';

export interface ISectionData {
    id?:number;
    getText(): string;
    getCitation(): ArticleCitation;
    getPicture(): ArticlePicture;
    getPictures(): ArticleSlider;
    getVideo(): ArticleVideo;
}
