using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class UserComment: UserCommentBase, IValidator
    {
        public int? articleId {get;set;}
        public Article article {get;set;}
        public string authorId {get;set;}
        public string authorEmail {get;set;}
        public string socialNetwork {get;set;}
        public DataShell Validate(){
            List<ValidationResult> errors = new List<ValidationResult>();
            if(text.Length>400){
                errors.Add(new ValidationResult("Max length is 400 characters! "));
            }
            if(!(new EmailAddressAttribute().IsValid(authorEmail))){
                errors.Add(new ValidationResult("invalid user email! "));
            }
            if(authorId == null || authorName == null){
                errors.Add(new ValidationResult("invalid user datas! "));
            }
            if(socialNetwork!="vk" && socialNetwork!="ya" && socialNetwork!="google"){
                errors.Add(new ValidationResult("invalid socialnetwork! "));
            }
            if(errors.Count==0){
                return new DataShell();
            }
            string errorsMessage="";
            foreach(var error in errors){
                errorsMessage+=error.ErrorMessage;
            }    
            return new DataShell(errorsMessage);
        }
        public UserComment(){}
        public UserComment(UserComment updateData){
            this.parent = updateData.parent;
            this.authorName = updateData.authorName;
            this.text = updateData.text;
            this.article = updateData.article;
            this.authorId = updateData.authorId;
            this.authorEmail = updateData.authorEmail;
            this.socialNetwork = updateData.socialNetwork;
            this.dateCreated = DateTime.UtcNow;
        }
        public UserCommentBase GetBaseinfo(){
            return new UserCommentBase(this.id, this.parentId, this.authorName, this.text, this.dateCreated);
        }
    }
}
