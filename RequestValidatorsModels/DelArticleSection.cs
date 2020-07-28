using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class DelArticleSection : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("idArt") ||
                !requestParams.ContainsKey("idSect") ||
                !Int32.TryParse(requestParams["idArt"], out int outInt) ||
                !Int32.TryParse(requestParams["idSect"], out outInt)
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}

