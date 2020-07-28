import { ArticleSection } from '../services-models/article-section';
import { ArticleBase } from './article-base';
import { ArticleCategory } from './article-category';
import { Section } from './section';

export class Article extends ArticleBase{
  public sections: Map<number, ArticleSection> | Array<Section> 
  public fileHeadPicture?: File;

  constructor(
    id: number,
    head: string,
    category: ArticleCategory,
    hotNews:boolean = false,
    sections?: Map<number, ArticleSection> | Array<Section>,
    shortDescription?: string,
    dateCreated?: Date, 
    srcHeadPicture?: string,
    ){
      super(
        id,
        head,
        category,
        shortDescription,
        dateCreated, 
        srcHeadPicture,
        hotNews
      );
      this.sections = sections;
    }
}