using System;
using System.Threading.Tasks;
using AspAngularBlog.ServicesModels;
using Microsoft.AspNetCore.Http;

namespace AspAngularBlog.Services
{
    public class ValidateRequest
    {        
        public ValidateRequest ()
        {}

        public async Task<DataShell> ValidateAsync(IQueryCollection requestParams, IValidator validator, Func<IQueryCollection, Task<DataShell>> dbMethod){
            var result = validator.Validate(requestParams);
            if(result.error==null){
                return await dbMethod(requestParams);     
            }
            else {
                return result;
            }
        }
        public async Task<DataShell> ValidateAsync(IQueryCollection requestParams, IFormCollection formData, IValidator validator, Func<IQueryCollection, IFormCollection, IData, Task<DataShell>> dbMethod){
            var result = validator.Validate(requestParams, formData);
            if(result.error==null){
                return await dbMethod(requestParams, formData, result.data);     
            }
            else {
                return result;
            }
        }

        public async Task<DataShell> ValidateAsync(IValidator validator, Func<IValidator, Task<DataShell>> dbMethod){
            var result = validator.Validate();
            if(result.error==null){
                return await dbMethod(validator);     
            }
            else {
                return result;
            }
        }

            public async Task<DataShell> ValidateAsync(IHeaderDictionary headers, IValidator validator, Func<IHeaderDictionary, Task<DataShell>> dbMethod){
            var result = validator.Validate(headers);
            if(result.error==null){
                return await dbMethod(headers);     
            }
            else {
                return result;
            }
        }
    }
}