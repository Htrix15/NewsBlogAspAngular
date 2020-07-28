using System.Linq;
using AspAngularBlog.Models;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.RequestValidatorsModels
{
    public class SaveMultipartDatas : IValidator
    {
        public DataShell Validate(IQueryCollection requestParams, IFormCollection formData)
        {
            var result = new DataShell();
            if (!requestParams.ContainsKey("type") ||
                (requestParams.ContainsKey("type") &&
                    (requestParams["type"].ToString() != "article" &&
                    requestParams["type"].ToString() != "section")
                ) ||
                !formData.ContainsKey("JSON")
              )
            {
                result.error = "invalid query parametrs";
                return result;
            }
            string jsonData = formData.Where(x => x.Key == "JSON")?.Select(x => x.Value.ToString()).FirstOrDefault();

            if (jsonData == null)
            {
                result.error = "invalid JSON parametrs";
                return result;
            }

            switch (requestParams["type"].ToString())
            {
                case ("article"):
                    {
                        try
                        {
                            ArticleBase updateArticleData = JsonConvert.DeserializeObject<ArticleBase>(jsonData);
                            result.error = updateArticleData.Validate().error;
                            result.data = updateArticleData;
                        }
                        catch
                        {
                            result.error = "invalid article data structure";
                            return result;
                        }
                        break;
                    }
                case ("section"):
                    {
                        try
                        {
                            Section preSection = JsonConvert.DeserializeObject<Section>(jsonData);
                            result.error = preSection.Validate().error;
                            result.data = preSection;
                        }
                        catch
                        {
                            result.error = "invalid section data structure";
                            return result;
                        }
                        break;
                    }
                default:
                    {
                        result.error = "invalid query parametrs";
                        return result;
                    }
            }
            return result;
        }
    }
}