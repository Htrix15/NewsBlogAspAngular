using Microsoft.AspNetCore.Http;
using AspAngularBlog.ServicesModels;
using System;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class DelArticle : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("id") ||
                !Int32.TryParse(requestParams["id"], out int outInt)
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}
