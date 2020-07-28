using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class GetComments : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (!requestParams.ContainsKey("articleId") ||
                !requestParams.ContainsKey("skip") ||
                !requestParams.ContainsKey("take") ||
                !requestParams.ContainsKey("parentId") ||
                !requestParams.ContainsKey("authorId") ||
                !requestParams.ContainsKey("authType") ||
                !Int32.TryParse(requestParams["articleId"], out int outInt) ||
                !Int32.TryParse(requestParams["skip"], out outInt) ||
                !Int32.TryParse(requestParams["take"], out outInt) ||
                (requestParams["parentId"].ToString() != "null" && !Int32.TryParse(requestParams["parentId"], out outInt)) ||
                (
                    requestParams["authType"].ToString() != "vk" &&
                    requestParams["authType"].ToString() != "ya" &&
                    requestParams["authType"].ToString() != "google"
                )
                )
            {
                var result = new DataShell("invalid query parametrs");
                return result;
            }
            return new DataShell();
        }
    }
}