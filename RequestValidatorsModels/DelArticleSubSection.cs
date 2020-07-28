using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class DelArticleSubSection : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("idArt") ||
                !requestParams.ContainsKey("idSect") ||
                !requestParams.ContainsKey("pos") ||
                !Int32.TryParse(requestParams["idArt"], out int outInt) ||
                !Int32.TryParse(requestParams["idSect"], out outInt) ||
                !(requestParams.ContainsKey("pos").ToString() != "left" &&
                 requestParams.ContainsKey("pos").ToString() != "right" &&
                 requestParams.ContainsKey("pos").ToString() != "center")
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}
