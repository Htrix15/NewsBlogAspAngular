import { ArticleCategory } from './article-category';

export class ArticleBase {
    constructor(
        public id: number,
        public head: string,
        public category: ArticleCategory,
        public shortDescription?: string,
        public dateCreated?: Date, 
        public srcHeadPicture?: string,
        public hotNews:boolean = false,
        public published:boolean = false    
        ){}


}