import { Article } from './article';
import { authType } from '../shared/my-types';
import { UserCommentBase } from './user-comment-base';

export class UserComment
    extends UserCommentBase{

    constructor(
        public id: number,
        public parent:UserComment,
        public authorName: string,
        public text: string,
        public countAnswer: number,
        public article: Article,
        public authorId: string,
        public authorEmail: string,
        public socialNetwork: authType,
        public dateCreated?: Date,
        public allowEdit?: boolean,
        public parentId?:number,
        public articleId?:number
    ){
        super(
            id,
            parent,
            authorName,
            text,
            countAnswer,
            dateCreated,
            allowEdit,
            parentId
        ) 
    }
    public static createForBase(baseInfo:UserCommentBase, authorId:string, socialNetwork: authType, authorEmail:string):UserComment{
        return new UserComment(baseInfo.id, null, baseInfo.authorName, baseInfo.text,0,null,authorId, authorEmail, socialNetwork);
    }
  }