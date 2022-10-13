using Microsoft.EntityFrameworkCore;
using Tree.Entities;

namespace Tree.Datas;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<Thing> Things { get; set; }
}