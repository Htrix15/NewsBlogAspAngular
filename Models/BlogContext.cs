using Microsoft.EntityFrameworkCore;

namespace AspAngularBlog.Models
{
    public class BlogContext : DbContext
    {
        public DbSet<Article> Articles { get; set; }
        public DbSet<Section> Sections { get; set; }
        public DbSet<ArticleCategory> ArticleCategories {get; set;} 
        public DbSet<User> Users {get; set;} 
        public DbSet<UserComment> Comments {get; set;} 

        public BlogContext(DbContextOptions<BlogContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Article>().Property(article => article.published).HasDefaultValue(false);
            modelBuilder.Entity<Article>().Property(article => article.hotNews).HasDefaultValue(false);
            modelBuilder.Entity<Article>().Property(article => article.dateCreated).HasDefaultValueSql("GETDATE()");
            modelBuilder.Entity<ArticleCategory>().Property(category => category.desc).HasDefaultValue("New category");
        }
    }
    
}
