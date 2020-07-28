using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class DelArticleCategory : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("del") ||
                !requestParams.ContainsKey("upd") ||
                !Int32.TryParse(requestParams["del"], out int outInt) ||
                !Int32.TryParse(requestParams["upd"], out outInt)
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}
