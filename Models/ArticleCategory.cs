using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class ArticleCategory : IData, IValidator
    {
        public int id { get; set; }
        [Required]
        public string desc { get; set; }
        public DataShell Validate()
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            if(desc?.Length>20){
                errors.Add(new ValidationResult("Max length description is 20 characters! "));
            }
            if(desc?.Length==0){
                errors.Add(new ValidationResult("Length isn't 0 characters! "));
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
    }
}