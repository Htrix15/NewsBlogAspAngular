import { ArticleBase } from '../models/article-base';
import { ArticleCategory } from '../models/article-category';

export class StartDatas {
    constructor(
        public articles: Array<ArticleBase>,
        public categories: Array<ArticleCategory>,
      ){}
}
