using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class ArticleBase : IData, IValidator
    {
        public int id { get; set; }
        public string head { get; set; }
        public string shortDescription { get; set; }
        public ArticleCategory category { get; set; }
        public DateTime dateCreated { get; set; }
        public string srcHeadPicture { get; set; }
        public bool hotNews { get; set; }
        public bool published { get; set; }
    
        public DataShell Validate()
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            if(head?.Length>60){
                errors.Add(new ValidationResult("Max length head is 60 characters! "));
            }
            if(shortDescription?.Length>200){
                errors.Add(new ValidationResult("Max length shortDescription is 200 characters! "));
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
        public void Update(ArticleBase updateData){
            this.category = updateData.category;
            this.head = updateData.head;
            this.hotNews = updateData.hotNews;
            this.shortDescription = updateData.shortDescription;
            this.srcHeadPicture = updateData.srcHeadPicture;
            this.published = updateData.published;
        }
    }
}
