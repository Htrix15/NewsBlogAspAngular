using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class DelComments : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams)
        {
            if (
                !requestParams.ContainsKey("commentId") ||
                !Int32.TryParse(requestParams["commentId"], out int outInt) ||
                !requestParams.ContainsKey("authorId") ||
                !requestParams.ContainsKey("authType") ||
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