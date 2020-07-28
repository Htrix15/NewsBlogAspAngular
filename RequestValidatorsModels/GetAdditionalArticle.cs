using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class GetAdditionalArticle : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("id") ||
                !requestParams.ContainsKey("skip") ||
                !requestParams.ContainsKey("take") ||
                !requestParams.ContainsKey("pub") ||
                !Int32.TryParse(requestParams["id"], out int outInt) ||
                !Int32.TryParse(requestParams["skip"], out outInt) ||
                !Int32.TryParse(requestParams["take"], out outInt) ||
                !Boolean.TryParse(requestParams["pub"], out bool outBool)
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}
