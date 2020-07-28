using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AspAngularBlog.Models;
using AspAngularBlog.Services;
using AspAngularBlog.RequestValidatorsModels;
using AspAngularBlog.ServicesModels;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;

namespace AspAngularBlog.Controllers
{
    [ApiController]
    [Route("api")]
    public class BlogController : ControllerBase
    {
        private readonly DbOperations _dbOperations;
        private readonly UserAuthentication _userAuthentication;
        private readonly ValidateRequest _validateRequest;
        
        public BlogController (
            DbOperations dbOperations,
            UserAuthentication userAuthentication,
            ValidateRequest validateRequest)
        {
            _dbOperations = dbOperations;
            _userAuthentication = userAuthentication;
            _validateRequest = validateRequest;
        }

        private void SetResponseHeaders(string key , string value){
            Response.Headers.Add(key, value);
        }
        private async Task<bool> CreateCookie(User user){
            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
            };
            ClaimsIdentity claimsIdentity =
            new ClaimsIdentity(claims, "ApplicationCookie", ClaimsIdentity.DefaultNameClaimType,null);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimsIdentity));
            return true;
        }

        [Authorize]
        [HttpPut("login")]
        public async Task<IActionResult> PutLogin(ChangeUser changeLogin)
        {
            var result = await _validateRequest.ValidateAsync(changeLogin, _userAuthentication.ChangeLoginAsync);
            if(result.error==null)
            {
                SetResponseHeaders("auth", "logoff");
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("password")]
        public async Task<IActionResult> PutPassword(ChangeUser changePassword)
        {
            var result = await _validateRequest.ValidateAsync(changePassword, _userAuthentication.ChangePasswordAsync);
            if(result.error==null)
            {
                SetResponseHeaders("auth", "logoff");
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        //=====================================================
        [HttpPost("logon")]
        public async Task<IActionResult> Auth(User user){
            var result = await _validateRequest.ValidateAsync(user, _userAuthentication.AuthenticationAsync);
            if(result.error==null){
             
                await this.CreateCookie(user);
                return Ok();

            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [Authorize]
        [HttpGet("check-admin")]
        public IActionResult CheckAdmin()
        {
            return Ok();
        }
       
        [HttpGet("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
        }
        //=====================================================
        
        [HttpGet("start-page")]
        public async Task<IActionResult> GetArticleBase()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new GetStartArticles(),_dbOperations.GetStartArticleBasesAsync);
            if(result.error == null){
                return Ok(JsonConvert.SerializeObject(result.data));
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        
        [Authorize]
        [HttpPost("add-article")]
        public async Task<IActionResult> PostArticleBase(ArticleCategory articleCategory)
        {
            var result = await _validateRequest.ValidateAsync(articleCategory, _dbOperations.PostArticleBaseAsync);
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [HttpGet("article-categories")]
        public async Task<IActionResult> GetArticleCategory()
        {
            var result = await _dbOperations.GetArticleCategoriesAsync();
            if(result.error == null){
                return Ok(result.datas);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpPost("article-category")]
        public async Task<IActionResult> PostArticleCategory()
        {
            var result = await _dbOperations.PostArticleCategoriesAsync();
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpPut("article-category")]
        public async Task<IActionResult> PutArticleCategory(ArticleCategory articleCategory)
        {
            var result = await _validateRequest.ValidateAsync(articleCategory, _dbOperations.PutArticleCategoriesAsync);
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpDelete("article-category")]        
        public async Task<IActionResult> DelArticleCategory()
        {
           var result =  await _validateRequest.ValidateAsync( Request.Query, new DelArticleCategory(), _dbOperations.DelArticleCategoriesAsync);
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [HttpGet("article")]
        public async Task<IActionResult> GetArticle()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new GetArticle(), _dbOperations.GetArticleAsync);
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [HttpGet("get-add-articles")]
        public async Task<IActionResult> GetAdditionalArticle()
        {
            var result = await _validateRequest.ValidateAsync( Request.Query, new GetAdditionalArticle(), _dbOperations.GetAdditionalArticleAsync); 
            if(result.error == null){
                return Ok(result.datas);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [Authorize]
        [HttpPut("new-sort")]
        public async Task<IActionResult> PutNewSortSections(SectionSort[] sectionsWithNewSort){
            var result = await _dbOperations.SaveSectionsNewSortAsync(sectionsWithNewSort);
            if(result.error == null){
                return Ok(JsonConvert.SerializeObject(result.stringData));
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }


        [Authorize]
        [HttpPost("new-section")]
         public async Task<IActionResult> newSection(Section newSection) 
        {
            var result = await _validateRequest.ValidateAsync(newSection, _dbOperations.PostArticleSectionAsync);
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [Authorize]
        [HttpPut("put-multipart-data")]
        public async Task<IActionResult> updateMultipartData() 
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, Request.Form, new SaveMultipartDatas(), _dbOperations.SaveMultipartDatasAsync); 
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]        
        [HttpPost("post-sub-section-data"), HttpPut("put-sub-section-data")]
        public async Task<IActionResult> postSubSectionData(Section newSectionData) 
        {
            var result = await _validateRequest.ValidateAsync(newSectionData, _dbOperations.PostPutSectionAsync);
            if(result.error == null){
                return Ok(result.stringData);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]        
        [HttpDelete("delete-sub-section")]
        public async Task<IActionResult> DeleteData()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new DelArticleSubSection(), _dbOperations.DelArticleSubSectionAsync);
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
        
        [Authorize]
        [HttpDelete("delete-article")]
        public async Task<IActionResult> DeleteArticle()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new DelArticle(), _dbOperations.DelArticleAsync);
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpDelete("del-article-section")]
        public async Task<IActionResult> DeleteArticleSection()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new DelArticleSection(), _dbOperations.DelArticleSectionAsync);
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [HttpGet("get-add-comments")]
        public async Task<IActionResult> GetComments()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new GetComments(), _dbOperations.GetCommentsAsync); 
            if(result.error == null){
                return Ok(result.datas);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [HttpPost("new-comment")]
        public async Task<IActionResult> PostComments(UserComment newComment)
        {
            var result = await _validateRequest.ValidateAsync(newComment, _dbOperations.PostNewCommentAsync); 
            if(result.error == null){
                return Ok(result.data);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        
        [HttpPut("edit-comment")]
        public async Task<IActionResult> PutComments(UserComment editComment)
        {
            var result = await _validateRequest.ValidateAsync(editComment, _dbOperations.PutCommentAsync);  
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [HttpDelete("delete-comment")]
        public async Task<IActionResult> DelComments()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new DelComments(), _dbOperations.DelCommentsAsync);  
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpDelete("admin-delete-comment")]
        public async Task<IActionResult> AdminDelComments()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new DelComments(), _dbOperations.AdminDelCommentsAsync); 
            if(result.error == null){
                return Ok();
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }

        [Authorize]
        [HttpGet("go-to-article")]
        public async Task<IActionResult> GoToArticle()
        {
            var result = await _validateRequest.ValidateAsync(Request.Query, new GetArticleFromComment(), _dbOperations.GetArticleFromCommentAsync); 
            if(result.error == null){
                return Ok(result.stringData);
            }
            SetResponseHeaders("error", result.error);
            return BadRequest();
        }
    }
}
