using System.Collections.Generic;

namespace AspAngularBlog.ServicesModels
{
    public class StartDatas : IData
    {
        public IEnumerable<IData> articles;
        public IEnumerable<IData> categories;

    }
}