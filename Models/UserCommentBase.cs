using System;
using System.ComponentModel.DataAnnotations.Schema;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class UserCommentBase: IData
    {
        public int id { get; set; }
        public int? parentId {get;set;}
        public UserComment parent {get;set;}
        public string authorName {get;set;}
        public string text {get;set;}
        public DateTime? dateCreated { get; set; }
        [NotMapped]
        public int countAnswer {get;set;}
        [NotMapped]
        public bool? allowEdit {get;set;}
        public UserCommentBase(){}
        public UserCommentBase(int id, int? parentId, string authorName, string text, DateTime? dateCreated){
            this.id=id;
            this.parentId = parentId;
            this.authorName = authorName;
            this.text = text;
            this.dateCreated = dateCreated;
            this.countAnswer = 0;
            this.allowEdit = true;
        }
    }
}
