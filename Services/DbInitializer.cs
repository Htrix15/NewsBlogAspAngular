using System;
using System.Linq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using AspAngularBlog.Models;

namespace AspAngularBlog.Services
{
    public class DbInitializer
    {
        private readonly BlogContext _blogContext;
        private readonly ILogger<DbInitializer> _logger;
        private readonly UserAuthentication _authentication;
        public DbInitializer(BlogContext blogContext,
             ILogger<DbInitializer> logger,
             UserAuthentication authentication)
        {
            _blogContext = blogContext;
            _logger = logger;
            _authentication = authentication;
        }
        public bool CreateDb()
        {
            try
            {
                _blogContext.Database.EnsureCreated();
                return InitializeAdmin();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Create DB fail!");
                return false;
            }
        }
        private bool InitializeAdmin()
        {
           try
           {
               var builder = new ConfigurationBuilder().AddJsonFile("appsettings.json");
               IConfiguration AppConfiguration = builder.Build();
               IConfigurationSection adminOptions = AppConfiguration.GetSection("Admin");
               if (adminOptions != null)
               {
                   string adminLogin = adminOptions.GetSection("login").Value;
                   string adminPassword = adminOptions.GetSection("password").Value;
                   if (adminLogin == null || adminPassword == null)
                   {
                       _logger.LogError("Fail initialize login or password subsection in appsettings.json");
                       return false;
                   }
                   if (_blogContext.Users.ToArray().Length == 0)
                   {
                       var admin = new User { Login = adminLogin, Password = _authentication.GetHashString(adminPassword) };
                       _blogContext.Add(admin);
                       _blogContext.SaveChanges();
                   }
                   return true;
               }
               else
               {
                   _logger.LogError("Fail initialize admin section in appsettings.json");
                   return false;
               }
           }
           catch (Exception ex)
           {
               _logger.LogError(ex, "Fail initialize admin");
               return false;
           }
        }
    }
}
