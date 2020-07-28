using System.Collections.Generic;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Models
{
    public class Article: ArticleBase, IData
    {
        public List<Section> sections { get; set; }

    }
}
