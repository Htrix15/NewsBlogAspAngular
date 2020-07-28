import { UserComment } from './user-comment';


export class UserCommentBase {
    constructor(
        public id: number,
        public parent: UserComment,
        public authorName: string,
        public text: string,
        public countAnswer: number,
        public dateCreated?: Date,
        public allowEdit?: boolean,
        public parentId?: number
    ){}
}