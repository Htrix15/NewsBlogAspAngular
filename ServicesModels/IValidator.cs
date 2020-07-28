using Microsoft.AspNetCore.Http;

namespace AspAngularBlog.ServicesModels
{
    public interface IValidator
    {
        DataShell Validate(IQueryCollection requestParams) => new DataShell("invalid type");
        DataShell Validate(IQueryCollection requestParams, IFormCollection formData) => new DataShell("invalid type");
        DataShell Validate() => new DataShell("invalid type");
        DataShell Validate(IHeaderDictionary headers) => new DataShell("invalid type");
    }
}