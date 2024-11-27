using BlogApi.Models;
using Microsoft.EntityFrameworkCore;

namespace BlogApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public DbSet<Blog> Blogs { get; set; }

        public DbSet<Category> Categories { get; set; }
        public DbSet<User> Users { get; set; }
    }
}
