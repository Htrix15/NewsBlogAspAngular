using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class User: IData, IValidator
    {
        public int? Id {get;set;}
        public string Login { get; set; }
        public string Password { get; set; }
        public DataShell Validate()
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            if(Login?.Length<5 || Password?.Length<5){
                errors.Add(new ValidationResult("Minimum length is 5 characters! "));
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