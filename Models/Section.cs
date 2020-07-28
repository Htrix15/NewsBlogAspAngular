using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class Section: IData, IValidator
    {
        public int id { get; set; }
        public int sectionNumber { get; set; }
        public string sectionPosition {get;set;}
        public string sectionType {get;set;}
        public string src { get; set; }
        public string text { get; set; }
        public string description { get; set; }
        public int articleId { get; set; }
        public Section(){}
        public Section(int articleId, int sectionNumber){
            this.articleId = articleId;
            this.sectionNumber = sectionNumber;
            this.sectionType = "startInput";
        }
        public Section(Section sectionData){
            sectionNumber = sectionData.sectionNumber;
            sectionPosition = sectionData.sectionPosition;
            sectionType = sectionData.sectionType;
            text = sectionData.text;
            src = sectionData.src;
            description = sectionData.description;
            articleId = sectionData.id;
        }
        public DataShell Validate()
        {
            Regex tegs = new Regex(@"<.*?>|&nbsp", RegexOptions.Compiled | RegexOptions.Singleline);
            List<ValidationResult> errors = new List<ValidationResult>();
            if(text!=null && tegs.Replace(text, "")?.Length>1000){
                errors.Add(new ValidationResult($"Max length text is 1000 characters! This text there are{tegs.Replace(text, "")?.Length}"));
            }
            if(sectionPosition!="left" && sectionPosition!="right" && sectionPosition!="center"){
                errors.Add(new ValidationResult("Incorrect section position! "));
            }
            if(sectionType!="text" && sectionType!="citation" && sectionType!="picture"
                && sectionType!="slider" && sectionType!="video" && sectionType!="startInput"){
                errors.Add(new ValidationResult("Incorrect section type! "));
            }
            if(sectionType!="slider" && description?.Length>100){
                errors.Add(new ValidationResult("Max length description is 100 characters! "));
            }
            if(sectionType=="video" && text != null && !text.StartsWith("<iframe") && !text.EndsWith("</iframe>")){
               errors.Add(new ValidationResult("Video href invalid! "));
            }

            if(sectionType=="slider"){
                if(description?.Length>1100){
                    errors.Add(new ValidationResult("Max length all slider description is 600 characters! "));
                }
                try{
                    if(src != null){
                        var testSrcs = JsonConvert.DeserializeObject<string[]>(src);
                    }
                    if(description != null){
                        var testDescs = JsonConvert.DeserializeObject<string[]>(description);
                    }
                }
                catch{
                     errors.Add(new ValidationResult("Invalid slider srces json "));
                }
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
        public void Update(Section updateData){
            text = updateData.text;
            src = updateData.src!=null?updateData.src:this.src;
            description = updateData.description;
            sectionType = updateData.sectionType;
            sectionPosition = updateData.sectionPosition;
        }
    }
}
