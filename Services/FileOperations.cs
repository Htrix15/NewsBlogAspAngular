using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Services
{
    public class FileOperations
    {
        private readonly string pathRoot;
        private readonly ILogger<FileOperations> _logger;
        public FileOperations(IWebHostEnvironment appEnvironment,
            ILogger<FileOperations> logger){
            pathRoot = appEnvironment.WebRootPath;
            _logger = logger;
        }
        public async Task<DataShell> SaveFileAsync(IFormFile file, string articleId)
        {
            var result = new DataShell();
            if(file!=null && file.Length>1){
                DirectoryInfo subFolder = new DirectoryInfo(pathRoot + $"/img/{articleId}/");
                if(!subFolder.Exists){
                    subFolder.Create();
                }
                string realPathToSaveFile = pathRoot + $"/img/{articleId}/" + file.FileName;
                using (var fileStream = new FileStream(realPathToSaveFile, FileMode.Create))
                {
                    try
                    {
                        await file.CopyToAsync(fileStream);
                        result.stringData = $"img/{articleId}/{file.FileName}";
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, "Fail save file");
                        result.error = "Fail save file";
                    }
                }
            }
            return result;
        }
        public void DeleteFolder(int articleId){
            try{
                DirectoryInfo articleFolder = new DirectoryInfo(pathRoot + $"/img/{articleId}/");
                if(articleFolder .Exists){
                    articleFolder.Delete(true);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail delete folder");
            }
        }
        public void DeleteOldFile(string path)
        {
            try{
                if(path!=null){
                    FileInfo oldFile = new FileInfo(pathRoot + "/" +  path);
                    if (oldFile.Exists){
                        oldFile.Delete();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail delete file");
            }
        }
        public void DeleteOldFile(string[] paths)
        {
            try{
    
                if(paths!=null){
                    foreach(var path in paths){
                        FileInfo oldFile = new FileInfo(pathRoot + "/" +  path);
                        if (oldFile.Exists){
                            oldFile.Delete();
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Fail delete file");
            }
        }
    }

}