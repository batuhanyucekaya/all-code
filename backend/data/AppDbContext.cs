using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Reflection;
using System.Linq.Expressions;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        
        public DbSet<Urun> Urunler { get; set; } = null!;
        public DbSet<Musteri> Musteriler { get; set; } = null!;
        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            ConfigureUrunModel(modelBuilder);
            ConfigureMusteriModel(modelBuilder);
            ConfigureUserModel(modelBuilder);

           
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
                {
                    entityType.AddSoftDeleteQueryFilter();
                }
            }

            base.OnModelCreating(modelBuilder);
        }

        private void ConfigureUrunModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Urun>(entity =>
            {
                entity.ToTable("urunler");
                entity.HasKey(e => e.id).HasName("pk_urunler");
                entity.Property(e => e.id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.isim).HasColumnName("isim").HasMaxLength(100).IsRequired();
                entity.Property(e => e.aciklama).HasColumnName("aciklama").HasColumnType("text");
                entity.Property(e => e.fiyat).HasColumnName("fiyat").HasColumnType("decimal(18,2)");
                entity.Property(e => e.stok).HasColumnName("stok").HasDefaultValue(0);
                entity.Property(e => e.kategori_id).HasColumnName("kategori_id");
                entity.Property(e => e.alt_kategori_id).HasColumnName("alt_kategori_id");
                entity.Property(e => e.resim_url).HasColumnName("resim_url").HasMaxLength(255);
            });
        }

        private void ConfigureMusteriModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Musteri>(entity =>
            {
                entity.ToTable("musteri");
                entity.HasKey(e => e.Id).HasName("pk_musteri");
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Ad).HasColumnName("ad").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Soyad).HasColumnName("soyad").HasMaxLength(50).IsRequired();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
                entity.Property(e => e.Telefon).HasColumnName("telefon").HasMaxLength(20);

                entity.HasIndex(e => e.Email).IsUnique().HasDatabaseName("ix_musteri_email");

                entity.Property(e => e.Telefon)
                      .HasConversion(new ValueConverter<string, string>(
                          v => v.Replace(" ", ""),
                          v => v));
            });
        }

        private void ConfigureUserModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(e => e.Id).HasName("pk_users");
                entity.Property(e => e.Id).HasColumnName("id").ValueGeneratedOnAdd();
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(100).IsRequired();
                entity.Property(e => e.PasswordHash).HasColumnName("password_hash").IsRequired();
                entity.Property(e => e.FullName).HasColumnName("full_name").HasMaxLength(100);
                entity.Property(e => e.Telephone).HasColumnName("telephone").HasMaxLength(20);
            });
        }

        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Added && entry.Entity is BaseEntity baseEntity)
                {
                    baseEntity.Created = DateTime.UtcNow;
                }
            }
            return base.SaveChanges();
        }
    } // 👈 AppDbContext sınıfı burada bitiyor

    // Global Query Filters için interface ve extension
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }
    }

    public static class SoftDeleteQueryExtension
    {
        public static void AddSoftDeleteQueryFilter(this IMutableEntityType entityData)
        {
            var methodToCall = typeof(SoftDeleteQueryExtension)
                .GetMethod(nameof(GetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static);

            if (methodToCall != null)
            {
                var genericMethod = methodToCall.MakeGenericMethod(entityData.ClrType);
                var filter = genericMethod.Invoke(null, new object[] { });
                entityData.SetQueryFilter((LambdaExpression)filter!);
            }
        }

        private static LambdaExpression GetSoftDeleteFilter<TEntity>()
            where TEntity : class, ISoftDelete
        {
            Expression<Func<TEntity, bool>> filter = x => !x.IsDeleted;
            return filter;
        }
    }
}
