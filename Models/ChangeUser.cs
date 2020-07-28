using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class ChangeUser:IValidator
    {
        public string oldValue { get; set; }
        public string newValue { get; set; }
        public DataShell Validate()
        {
            List<ValidationResult> errors = new List<ValidationResult>();
            if(oldValue==null || newValue==null){
                errors.Add(new ValidationResult("Value isn't be empty! "));
            }
            if(oldValue == newValue){
                errors.Add(new ValidationResult("Value isn't change! "));
            }
            if(oldValue?.Length<5 || newValue?.Length<5){
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