using Microsoft.AspNetCore.Http;
using System;
using AspAngularBlog.ServicesModels;
public class GetArticleBases: IValidator
{
    public DataShell Validate(IQueryCollection requestParams){
        if(!requestParams.ContainsKey("idCat") || 
            !requestParams.ContainsKey("pub") || 
            !Int32.TryParse(requestParams["idCat"], out int outInt)||
            !Boolean.TryParse(requestParams["pub"], out bool outBool)
            )
        {
            var result = new DataShell("invalid query parametrs");
            return result;
        }
        return new DataShell();
    }
}
