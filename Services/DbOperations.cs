using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using AspAngularBlog.Models;
using AspAngularBlog.ServicesModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace AspAngularBlog.Services
{
    public class DbOperations
    {
        private readonly ILogger<DbOperations> _logger;
        private readonly BlogContext _blogContext;
        private readonly FileOperations _fileOperations;
        public DbOperations (ILogger<DbOperations> logger,
            BlogContext blogContext,
            FileOperations fileOperations)
        {
            _blogContext = blogContext;
            _logger = logger;
            _fileOperations = fileOperations;
        }
        public async Task<DataShell> GetStartArticleBasesAsync(IQueryCollection requestParams){

            var result = new DataShell();
            var categoriesAndArticles = new StartDatas();
            int countItem = Convert.ToInt32(requestParams["count"]);
            try{
                var categories = await _blogContext.ArticleCategories.ToListAsync();
                categoriesAndArticles.categories = categories;
                IQueryable<ArticleBase> table = _blogContext.Articles
                    .Where(article=>article.published==true)
                    .Select(article => new ArticleBase(){
                        id = article.id,
                        head = article.head,
                        shortDescription = article.shortDescription,
                        category = article.category,
                        dateCreated = article.dateCreated,
                        srcHeadPicture = article.srcHeadPicture,
                        hotNews = article.hotNews
                    })
                    .OrderByDescending(article => article.dateCreated)
                    .ThenByDescending(article => article.hotNews);

                List<IQueryable<ArticleBase>> selects = new List<IQueryable<ArticleBase>>();

                foreach (var category in categories)
                {
                    selects.Add(table.Where(article => article.category.id == category.id).Take(countItem));
                }
                
                var concatSelect = selects[0];

                foreach(var itemSelect in selects.Skip(1))
                {
                    concatSelect = concatSelect.Concat(itemSelect);
                }
                    
                categoriesAndArticles.articles = await concatSelect.ToListAsync();
                result.data = categoriesAndArticles;
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }

        public async Task<DataShell> PostArticleBaseAsync(IValidator articleCategory){
            var result = new DataShell();
            try{
                var category = await _blogContext.ArticleCategories.Where(category=>category.id==(articleCategory as ArticleCategory).id).FirstOrDefaultAsync();    
                if(category == null){
                    result.error = "Category not found";
                    return result;
                }

                var newArticle = new Article();
                newArticle.category = category;
                await _blogContext.Articles.AddAsync(newArticle);
                await _blogContext.SaveChangesAsync();
                result.data = newArticle;

            } catch(Exception ex){
                _logger.LogError(ex, "Fail set data of DB");
                result.error = "Fail set data of DB";
            }
           
            return result;
        }
        public async Task<DataShell> DelArticleAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                var delArticle = await _blogContext.Articles.Where(article => article.id == Convert.ToInt32(requestParams["id"])).FirstOrDefaultAsync();
                if(delArticle == null){
                    result.error="Incorrect id params";
                    return result;
                }
                _fileOperations.DeleteFolder(delArticle.id);
                _blogContext.Articles.Remove(delArticle);
                await _blogContext.SaveChangesAsync();
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        
        public async Task<DataShell> GetAdditionalArticleAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                result.datas = await _blogContext.Articles
                    .Select(article => new ArticleBase(){
                        id = article.id,
                        head = article.head,
                        shortDescription = article.shortDescription,
                        category = article.category,
                        dateCreated = article.dateCreated,
                        srcHeadPicture = article.srcHeadPicture,
                        hotNews = article.hotNews,
                        published = article.published
                    })
                    .Where(article => article.published==Convert.ToBoolean(requestParams["pub"]) && article.category.id == Convert.ToInt32(requestParams["id"]))
                    .OrderByDescending(article => article.dateCreated)
                    .ThenByDescending(article => article.hotNews)
                    .Skip(Convert.ToInt32(requestParams["skip"]))
                    .Take(Convert.ToInt32(requestParams["take"])).ToListAsync();
  
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        public async Task<DataShell> GetArticleAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                int key = Convert.ToInt32(requestParams["articleId"]);
                 result.data = await _blogContext.Articles.Where(article => article.id == key)
                    .Include(section => section.sections)
                    .Include(article => article.category)
                    .FirstOrDefaultAsync();
                if(result.data == null){
                    result.error = "Inccorect number article";
                }
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        public async Task<DataShell> GetArticleCategoriesAsync(){
            var result = new DataShell();
            try{
                result.datas = await _blogContext.ArticleCategories.ToListAsync();
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        public async Task<DataShell> PostArticleCategoriesAsync()
        {
            var result = new DataShell();
            try{
                var newArticleCategory = new ArticleCategory();
                await _blogContext.ArticleCategories.AddAsync(newArticleCategory);
                await _blogContext.SaveChangesAsync();
                result.data = newArticleCategory;
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        public async Task<DataShell> PutArticleCategoriesAsync(IValidator articleCategory)
        {
            var result = new DataShell();
            try{
                _blogContext.ArticleCategories.Update((ArticleCategory)articleCategory);
                await _blogContext.SaveChangesAsync();
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        public async Task<DataShell> DelArticleCategoriesAsync(IQueryCollection typeDatas)
        {
            var result = new DataShell();
            try{
                var idDelCategory = Convert.ToInt32(typeDatas["del"]);
                var idUpdCategory = Convert.ToInt32(typeDatas["upd"]);

                var delCategory = await _blogContext.ArticleCategories.FindAsync(idDelCategory);
                var newCategory = await _blogContext.ArticleCategories.FindAsync(idUpdCategory);
                
                if(delCategory==null || newCategory==null){
                    result.error = "invalid id data";
                    return result;
                }

                var updateArticles = await _blogContext.Articles.Where(article=>article.category==delCategory).ToListAsync();
                updateArticles.ForEach(article => article.category = newCategory);
                await _blogContext.SaveChangesAsync();
                _blogContext.ArticleCategories.Remove(delCategory);
                await _blogContext.SaveChangesAsync();
            } catch(Exception ex){
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
            }
            return result;
        }
        private async Task<DataShell> SaveSectionContainPictureAsync(Section preSection,  IFormCollection pictureInfo){
            var result = new DataShell();
            string srcPicture = null;
            List<string> srcPictures = new List<string>();
            var oldPictureSrc = (preSection.sectionType=="slider")?JsonConvert.DeserializeObject<string[]>(preSection.src):new string[]{preSection.src};
            if (pictureInfo.Files?.Count>0){
                for(int i=0; i < pictureInfo.Files.Count; i++)
                {
                    var scrPicture = await _fileOperations.SaveFileAsync( pictureInfo.Files[i], preSection.id.ToString());
                    if(scrPicture.error==null){
                        if(scrPicture.stringData!=null){
                            srcPictures.Add(scrPicture.stringData);
                            if(oldPictureSrc.Length !=0)
                                for(int j=0; j< oldPictureSrc.Length; j++ ){
                                    if(scrPicture.stringData!=oldPictureSrc[j] && i==j){
                                    _fileOperations.DeleteOldFile(oldPictureSrc[j]);
                                }
                            }
                        }  else{
                            srcPictures.Add(oldPictureSrc[i]);
                        }
                    } else {
                        result.error = scrPicture.error;
                        return result;
                    }
                }
                srcPicture = (srcPictures.Count!=1)?JsonConvert.SerializeObject(srcPictures):srcPictures[0];
            }
            preSection.src = srcPicture;
            result = await PostPutSectionAsync(preSection);
            return result;      
        }        
        private async Task<DataShell> SaveArticleHead(IFormCollection pictureInfo, ArticleBase updateData){
            DataShell result = new DataShell();
            try{

                var oldArticleHeadData = await _blogContext.Articles.FindAsync(updateData.id);
                if(oldArticleHeadData == null){
                    result.error = "invalid id article";
                    return result;
                }

                var articleCategory = await _blogContext.ArticleCategories.FindAsync(updateData.category.id);
                if(articleCategory==null){
                    result.error = "invalid id category";
                    return result;
                }

                if (pictureInfo.Files?.Count>0){
                    var newSrc = await _fileOperations.SaveFileAsync(pictureInfo.Files[0], updateData.id.ToString());
                    if(newSrc.error == null && newSrc.stringData!=null){
                        if(oldArticleHeadData.srcHeadPicture!=newSrc.stringData){
                            _fileOperations.DeleteOldFile(oldArticleHeadData.srcHeadPicture);
                        }
                        updateData.srcHeadPicture = newSrc.stringData;
                    }
                }
                                
                updateData.category = articleCategory;
                oldArticleHeadData.Update(updateData);

                await _blogContext.SaveChangesAsync();
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail prepeare save datas");
                result.error = "Fail prepeare save datas";
            }
            return result;
        }
        public async Task<DataShell> SaveMultipartDatasAsync(IQueryCollection typeDatas,  IFormCollection pictureInfo, IData updateData){
            DataShell result = new DataShell();
            switch(typeDatas["type"]) {
                case("article"):{result = await SaveArticleHead(pictureInfo, (ArticleBase)updateData); break;}
                case("section"):{result = await SaveSectionContainPictureAsync((Section)updateData, pictureInfo);break;}
                default:{
                    result.error = "invalid key value of type datas";
                    return result;
                }
            }
            return result;
        }
        public async Task<DataShell> SaveSectionsNewSortAsync(SectionSort[] sectionsWithNewSort)
        {
            DataShell result = new DataShell();
            if(sectionsWithNewSort.Length==0){
                result.error = "Sections is not found";
                    return result;
            }
            try{
                var updateSections = sectionsWithNewSort.ToDictionary(section => section.sectionId, section => section.sectionNumber); 
                              
                var sections = await _blogContext.Sections.Where(section => updateSections.Keys.Contains(section.id)).ToListAsync();
                sections.ForEach(oldSortSection => oldSortSection.sectionNumber = updateSections[oldSortSection.id]);
                await _blogContext.SaveChangesAsync();
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }

        public async Task<DataShell> PostPutSectionAsync(IValidator _updateData){
           DataShell result = new DataShell();
            try{
               Section updateData = (Section)_updateData;
                var section = await _blogContext.Sections.Where(section => 
                        section.articleId == updateData.id && 
                        section.sectionNumber == updateData.sectionNumber && 
                            (section.sectionPosition ==  updateData.sectionPosition ||
                            section.sectionType == "startInput"
                            )
                    ).FirstOrDefaultAsync();

                if(section != null){
                    section.Update(updateData);
                } else {
                    section = new Section(updateData);
                    await _blogContext.Sections.AddAsync(section);
                }

                await _blogContext.SaveChangesAsync();
                result.data = section;
            } 
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }

        public async Task<DataShell> PostArticleSectionAsync(IValidator addSection){
            DataShell result = new DataShell();
            try{
                var articleId = (addSection as Section).id;
                var article = await _blogContext.Articles.FindAsync(articleId);
                if(article==null){
                    result.error = "Article id isn't correct";
                    return result;
                }

                int maxSectionNumber = await _blogContext.Sections.Where(section => section.articleId == articleId)
                .OrderByDescending(section => section.sectionNumber)
                .Select(section => section.sectionNumber).FirstOrDefaultAsync();

                var newSection = new Section(articleId, maxSectionNumber +1);
                await _blogContext.Sections.AddAsync(newSection);
                await _blogContext.SaveChangesAsync();
                result.data = newSection;
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }
        public async Task<DataShell> DelArticleSectionAsync(IQueryCollection sectionData){
            DataShell result = new DataShell();
            try{
                var articleSections = await _blogContext.Sections.Where(section=>
                    section.articleId == Convert.ToInt32(sectionData["idArt"]) &&
                    section.sectionNumber == Convert.ToInt32(sectionData["idSect"])
                ).ToListAsync();

                if(articleSections?.Count==0){
                    result.error = "Section not found";
                    return result;
                }

                articleSections.ForEach(articleSection=>{
                    if(articleSection.sectionType == "picture"){
                        _fileOperations.DeleteOldFile(articleSection.src);
                    }
                    if(articleSection.sectionType == "slider"){
                        try{
                            _fileOperations.DeleteOldFile(JsonConvert.DeserializeObject<string[]>(articleSection.src));
                        }catch(Exception ex){
                            _logger.LogError(ex, "Fail deserialize");
                        }
                    }
                });
                
                _blogContext.Sections.RemoveRange(articleSections);
                await _blogContext.SaveChangesAsync();
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }
        public async Task<DataShell> DelArticleSubSectionAsync(IQueryCollection sectionData){
            DataShell result = new DataShell();
            try{
                var articleSection = await _blogContext.Sections.Where(section=>
                    section.articleId == Convert.ToInt32(sectionData["idArt"]) &&
                    section.sectionNumber == Convert.ToInt32(sectionData["idSect"]) &&
                    section.sectionPosition == sectionData["pos"].ToString()
                ).FirstOrDefaultAsync();

                if(articleSection==null){
                    result.error = "Section not found";
                    return result;
                }
                if(articleSection.sectionType == "picture"){
                    _fileOperations.DeleteOldFile(articleSection.src);
                }
                if(articleSection.sectionType == "slider"){
                    try{
                        _fileOperations.DeleteOldFile(JsonConvert.DeserializeObject<string[]>(articleSection.src));
                    }catch(Exception ex){
                        _logger.LogError(ex, "Fail deserialize");
                    }
                }
                _blogContext.Sections.Remove(articleSection);
                await _blogContext.SaveChangesAsync();
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }
        public async Task<DataShell> GetUserHashPasswordAsync(string login)
        {
            var result = new DataShell();
            try{
                result.stringData = await _blogContext.Users.Where(users => users.Login == login).Select(users => users.Password).FirstOrDefaultAsync();
                return result;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB");
                result.error = "Fail get data of DB";
                return result;
            } 
        }
        public async Task<DataShell> ChangeLoginAsync(ChangeUser logins)
        {
            var result = new DataShell();
            try{
                var user = await _blogContext.Users.Where(users => users.Login == logins.oldValue).FirstOrDefaultAsync();
                if(user==null){
                    result.error = "Incorrect login"; 
                    return result;
                }
                user.Login = logins.newValue;
                await _blogContext.SaveChangesAsync();
                return result;
          
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail get or set data of DB"); 
                result.error = "Fail get or set data of DB"; 
                return result;
            } 
        }
        public async Task<DataShell> ChangePasswordAsync(ChangeUser passwords)
        {
            var result = new DataShell();
            try
            {
                var user = await _blogContext.Users.Where(users => users.Password == passwords.oldValue).FirstOrDefaultAsync();
                if(user==null){
                    result.error = "Incorrect password";
                    return result;
                }
                user.Password = passwords.newValue;
                await _blogContext.SaveChangesAsync();
                return result;
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get or set data of DB"); 
                result.error = "Fail get or set data of DB";
                return result;
            } 
        }
        public async Task<DataShell> GetCommentsAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                var articleId =  Convert.ToInt32(requestParams["articleId"]);
                int? parentId = requestParams["parentId"].ToString()!="null"?Convert.ToInt32(requestParams["parentId"]):(int?)null;
                var authorId = requestParams["authorId"].ToString();
                var authType = requestParams["authType"].ToString();

                IQueryable<UserComment> query = _blogContext.Comments;
                if(articleId!=-1){
                    query = query.Where(comment => comment.article.id == articleId);
                }
                
                if(parentId==null){
                    var skip =  Convert.ToInt32(requestParams["skip"]);
                    var take =  Convert.ToInt32(requestParams["take"]);
                    query = query.Where(comment => comment.parent == null).OrderByDescending(comment => comment.dateCreated).Skip(skip).Take(take);
                } else {
                    query = query.Where(comment => comment.parent.id == (int)parentId).OrderBy(comment => comment.dateCreated);
                }

                result.datas = await query.Select(comment => new  UserCommentBase(){ 
                    id = comment.id,
                    parentId = comment.parent.id,
                    authorName = comment.authorName,
                    text = comment.text,
                    dateCreated = comment.dateCreated,
                    allowEdit = (comment.authorId==authorId && comment.socialNetwork == authType),
                    countAnswer = _blogContext.Comments.Count(answerComment => answerComment.parent.id == comment.id) 
                }).ToListAsync();

            } catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB"); 
                result.error = "Fail get data of DB";
                return result;
            } 

            return result;
        }

          public async Task<DataShell> GetArticleFromCommentAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                var commentId =  Convert.ToInt32(requestParams["commentId"]);
                var articleId = await _blogContext.Comments.Where(comment=>comment.id==commentId).Select(comment=>comment.articleId).FirstOrDefaultAsync();
                if(articleId!=null){
                    result.stringData = articleId.ToString();
                    return result;
                }
                result.error = "Article not found";

            } catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB"); 
                result.error = "Fail get data of DB";
                return result;
            } 

            return result;
        }

        public async Task<DataShell> DelCommentsAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                var commentId =  Convert.ToInt32(requestParams["commentId"]);
                var authorId = requestParams["authorId"].ToString();
                var authType = requestParams["authType"].ToString();

                var comment = await _blogContext.Comments.Where(comment => comment.id == commentId 
                    && comment.authorId==authorId && comment.socialNetwork == authType)
                    .Select(comment => new  UserCommentBase(){ 
                    countAnswer = _blogContext.Comments.Count(answerComment => answerComment.parent.id == comment.id) 
                    }).FirstOrDefaultAsync();
                if(comment==null){
                    result.error = "Comment not found";
                    return result;
                }
                if(comment.countAnswer>0){
                    result.error = "It is parent comment, masn't delete";
                    return result;
                }
                _blogContext.Comments.Remove(await _blogContext.Comments.FindAsync(commentId));
                await _blogContext.SaveChangesAsync();
            } catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB"); 
                result.error = "Fail get data of DB";
                return result;
            } 
            return result;
        }

        public async Task<DataShell> AdminDelCommentsAsync(IQueryCollection requestParams){
            var result = new DataShell();
            try{
                var commentId =  Convert.ToInt32(requestParams["commentId"]);

                var comments = await _blogContext.Comments.Where(comment => comment.id == commentId || comment.parentId == commentId).ToListAsync();
                if(comments.Count==0){
                    result.error = "Comments not found";
                    return result;
                }
                _blogContext.Comments.RemoveRange(comments);
                await _blogContext.SaveChangesAsync();
            } catch(Exception ex)
            {
                _logger.LogError(ex, "Fail get data of DB"); 
                result.error = "Fail get data of DB";
                return result;
            } 
            return result;
        }

        public async Task<DataShell> PostNewCommentAsync(IValidator _newComment){
            DataShell result = new DataShell();
            try{
                var newComment = _newComment as UserComment;

                var article = await _blogContext.Articles.FindAsync(newComment.articleId);
                if(article==null){
                    result.error = "incorrect article id";
                    return result;
                }
                newComment.article = article;

                var parentComment = new UserComment();
                if(newComment.parentId!=null){
                    parentComment = await _blogContext.Comments.FindAsync(newComment.parentId);
                    if(parentComment==null){
                        result.error = "incorrect parent comment id";
                        return result;
                    } else {
                         newComment.parent =  parentComment;
                    }
                } else {
                    newComment.parent = null;
                }
                
                var addingComment = new UserComment(newComment);
                await _blogContext.Comments.AddAsync(addingComment);
                await _blogContext.SaveChangesAsync();

                result.data = addingComment.GetBaseinfo();

            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }

        public async Task<DataShell> PutCommentAsync(IValidator editComment){
            DataShell result = new DataShell();
            try{
                var editData = editComment as UserComment;
                var comment = await _blogContext.Comments.Where(comment=>
                    comment.id == editData.id && comment.authorId == editData.authorId 
                    && comment.socialNetwork == editData.socialNetwork).FirstOrDefaultAsync();
                if(comment==null){
                    result.error = "Comment not found";
                    return result;
                }   
                var count = await _blogContext.Comments.CountAsync(comments=>comments.parent.id == comment.id);
                if(count>0){
                    result.error = "It is parent comment, masn't edit";
                    return result;
                }
                comment.text = editData.text;
                await _blogContext.SaveChangesAsync(); 
            }
            catch(Exception ex){
                _logger.LogError(ex, "Fail set data into DB");
                result.error = "Fail set data into DB";
            }
            return result;
        }
    }
}