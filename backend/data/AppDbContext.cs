using Microsoft.EntityFrameworkCore;
using backend.Models;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Reflection;
using System.Linq.Expressions;

namespace backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Best Practice: DbSet isimleri PascalCase olmalı
        public DbSet<Urun> Urunler { get; set; }
        public DbSet<Musteri> Musteriler { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<MusteriAyarlari> MusteriAyarlari { get; set; }
        public DbSet<SepetItem> SepetItems { get; set; }
        public DbSet<FavoriItem> FavoriItems { get; set; }
        public DbSet<PasswordResetToken> PasswordResetTokens { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Fluent API ile tablo konfigürasyonları
            ConfigureUrunModel(modelBuilder);
            ConfigureMusteriModel(modelBuilder);
            ConfigureUserModel(modelBuilder);  // User modeli eklendi
            ConfigureCommentModel(modelBuilder);  // Comment modeli eklendi
            ConfigureMusteriAyarlariModel(modelBuilder);  // MusteriAyarlari modeli eklendi
            ConfigureSepetItemModel(modelBuilder);  // SepetItem modeli eklendi
            ConfigureFavoriItemModel(modelBuilder);  // FavoriItem modeli eklendi
            ConfigurePasswordResetTokenModel(modelBuilder);  // PasswordResetToken modeli eklendi

            // Tüm tablolar için ortak ayarlar
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                // Soft Delete için global query filter
                if (typeof(ISoftDelete).IsAssignableFrom(entityType.ClrType))
                {
                    entityType.AddSoftDeleteQueryFilter();
                }
            }
        }

        private void ConfigureUrunModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Urun>(entity =>
            {
                entity.ToTable("urunler");

                entity.HasKey(e => e.id)
                      .HasName("pk_urunler");

                entity.Property(e => e.id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.isim)
                      .HasColumnName("isim")
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(e => e.aciklama)
                      .HasColumnName("aciklama")
                      .HasColumnType("text");

                entity.Property(e => e.fiyat)
                      .HasColumnName("fiyat")
                      .HasColumnType("decimal(18,2)");

                entity.Property(e => e.stok)
                      .HasColumnName("stok")
                      .HasDefaultValue(0);

                entity.Property(e => e.kategori_id)
                      .HasColumnName("kategori_id");

                entity.Property(e => e.alt_kategori_id)
                      .HasColumnName("alt_kategori_id");

                entity.Property(e => e.resim_url)
                      .HasColumnName("resim_url")
                      .HasMaxLength(255);
            });
        }

        private void ConfigureMusteriModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Musteri>(entity =>
            {
                entity.ToTable("musteri");

                entity.HasKey(e => e.Id)
                      .HasName("pk_musteri");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.Ad)
                      .HasColumnName("ad")
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(e => e.Soyad)
                      .HasColumnName("soyad")
                      .HasMaxLength(50)
                      .IsRequired();

                entity.Property(e => e.Email)
                      .HasColumnName("email")
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(e => e.Password)
                      .HasColumnName("Password")
                      .HasMaxLength(255)
                      .IsRequired();

                entity.Property(e => e.Telefon)
                      .HasColumnName("telefon")
                      .HasMaxLength(20);

                // Index tanımları
                entity.HasIndex(e => e.Email)
                      .IsUnique()
                      .HasDatabaseName("ix_musteri_email");

                // Value Conversions
                entity.Property(e => e.Telefon)
                      .HasConversion(new ValueConverter<string, string>(
                          v => v.Replace(" ", ""),
                          v => v));
            });
        }

        // Yeni User Modeli konfigurasyonu
        private void ConfigureUserModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasKey(e => e.Id)
                      .HasName("pk_users");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.Email)
                      .HasColumnName("email")
                      .HasMaxLength(100)
                      .IsRequired();

                entity.Property(e => e.PasswordHash)
                      .HasColumnName("password_hash")
                      .IsRequired();

                entity.Property(e => e.FullName)
                      .HasColumnName("full_name")
                      .HasMaxLength(100);

                entity.Property(e => e.Telephone)
                      .HasColumnName("telephone")
                      .HasMaxLength(20);


            });
        }

        // Yeni Comment Modeli konfigürasyonu
        private void ConfigureCommentModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("comments");

                entity.HasKey(e => e.Id)
                      .HasName("pk_comments");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.ProductId)
                      .HasColumnName("product_id")
                      .IsRequired();

                entity.Property(e => e.UserId)
                      .HasColumnName("user_id")
                      .IsRequired();

                entity.Property(e => e.Rating)
                      .HasColumnName("rating")
                      .IsRequired();

                entity.Property(e => e.Body)
                      .HasColumnName("body")
                      .HasColumnType("text")
                      .IsRequired();

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationships
                entity.HasOne(e => e.Product)
                      .WithMany()
                      .HasForeignKey(e => e.ProductId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.User)
                      .WithMany()
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.ProductId)
                      .HasDatabaseName("ix_comments_product_id");

                entity.HasIndex(e => e.UserId)
                      .HasDatabaseName("ix_comments_user_id");
            });
        }

        // MusteriAyarlari Modeli konfigürasyonu
        private void ConfigureMusteriAyarlariModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MusteriAyarlari>(entity =>
            {
                entity.ToTable("musteri_ayarlari");

                entity.HasKey(e => e.MusteriId)
                      .HasName("pk_musteri_ayarlari");

                entity.Property(e => e.MusteriId)
                      .HasColumnName("musteri_id")
                      .ValueGeneratedNever(); // Foreign key olduğu için

                entity.Property(e => e.EmailBildirimleri)
                      .HasColumnName("email_bildirimleri")
                      .HasDefaultValue(true);

                entity.Property(e => e.SmsBildirimleri)
                      .HasColumnName("sms_bildirimleri")
                      .HasDefaultValue(false);

                entity.Property(e => e.PushBildirimleri)
                      .HasColumnName("push_bildirimleri")
                      .HasDefaultValue(true);

                entity.Property(e => e.ProfilGorunurlugu)
                      .HasColumnName("profil_gorunurlugu")
                      .HasDefaultValue(true);

                entity.Property(e => e.SiparisGecmisiPaylasimi)
                      .HasColumnName("siparis_gecmisi_paylasimi")
                      .HasDefaultValue(false);

                entity.Property(e => e.DegerlendirmePaylasimi)
                      .HasColumnName("degerlendirme_paylasimi")
                      .HasDefaultValue(true);

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationship
                entity.HasOne(e => e.Musteri)
                      .WithOne()
                      .HasForeignKey<MusteriAyarlari>(e => e.MusteriId)
                      .OnDelete(DeleteBehavior.Cascade);
            });
        }



        // SepetItem Modeli konfigürasyonu
        private void ConfigureSepetItemModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SepetItem>(entity =>
            {
                entity.ToTable("sepet_items");

                entity.HasKey(e => e.Id)
                      .HasName("pk_sepet_items");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.MusteriId)
                      .HasColumnName("musteri_id")
                      .IsRequired();

                entity.Property(e => e.UrunId)
                      .HasColumnName("urun_id")
                      .IsRequired();

                entity.Property(e => e.Miktar)
                      .HasColumnName("miktar")
                      .HasDefaultValue(1);

                entity.Property(e => e.EklenmeTarihi)
                      .HasColumnName("eklenme_tarihi")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationships
                entity.HasOne(e => e.Musteri)
                      .WithMany()
                      .HasForeignKey(e => e.MusteriId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Urun)
                      .WithMany()
                      .HasForeignKey(e => e.UrunId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.MusteriId)
                      .HasDatabaseName("ix_sepet_items_musteri_id");

                entity.HasIndex(e => e.UrunId)
                      .HasDatabaseName("ix_sepet_items_urun_id");

                entity.HasIndex(e => new { e.MusteriId, e.UrunId })
                      .IsUnique()
                      .HasDatabaseName("ix_sepet_items_musteri_urun_unique");
            });
        }

        // FavoriItem Modeli konfigürasyonu
        private void ConfigureFavoriItemModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<FavoriItem>(entity =>
            {
                entity.ToTable("favori_items");

                entity.HasKey(e => e.Id)
                      .HasName("pk_favori_items");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.MusteriId)
                      .HasColumnName("musteri_id")
                      .IsRequired();

                entity.Property(e => e.UrunId)
                      .HasColumnName("urun_id")
                      .IsRequired();

                entity.Property(e => e.EklenmeTarihi)
                      .HasColumnName("eklenme_tarihi")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationships
                entity.HasOne(e => e.Musteri)
                      .WithMany()
                      .HasForeignKey(e => e.MusteriId)
                      .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Urun)
                      .WithMany()
                      .HasForeignKey(e => e.UrunId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.MusteriId)
                      .HasDatabaseName("ix_favori_items_musteri_id");

                entity.HasIndex(e => e.UrunId)
                      .HasDatabaseName("ix_favori_items_urun_id");

                entity.HasIndex(e => new { e.MusteriId, e.UrunId })
                      .IsUnique()
                      .HasDatabaseName("ix_favori_items_musteri_urun_unique");
            });
        }

        public override int SaveChanges()
        {
            // Kayıt işlemleri öncesi otomatik işlemler
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.State == EntityState.Added)
                {
                    if (entry.Entity is BaseEntity baseEntity)
                    {
                        baseEntity.Created = DateTime.UtcNow;
                    }
                }
            }
            return base.SaveChanges();
        }

        private void ConfigurePasswordResetTokenModel(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PasswordResetToken>(entity =>
            {
                entity.ToTable("password_reset_tokens");

                entity.HasKey(e => e.Id)
                      .HasName("pk_password_reset_tokens");

                entity.Property(e => e.Id)
                      .HasColumnName("id")
                      .ValueGeneratedOnAdd();

                entity.Property(e => e.MusteriId)
                      .HasColumnName("musteri_id")
                      .IsRequired();

                entity.Property(e => e.Token)
                      .HasColumnName("token")
                      .HasMaxLength(255)
                      .IsRequired();

                entity.Property(e => e.ExpiresAt)
                      .HasColumnName("expires_at")
                      .IsRequired();

                entity.Property(e => e.IsUsed)
                      .HasColumnName("is_used")
                      .HasDefaultValue(false);

                entity.Property(e => e.CreatedAt)
                      .HasColumnName("created_at")
                      .HasDefaultValueSql("CURRENT_TIMESTAMP");

                // Foreign key relationship
                entity.HasOne(e => e.Musteri)
                      .WithMany()
                      .HasForeignKey(e => e.MusteriId)
                      .OnDelete(DeleteBehavior.Cascade);

                // Indexes
                entity.HasIndex(e => e.Token)
                      .IsUnique()
                      .HasDatabaseName("ix_password_reset_tokens_token");

                entity.HasIndex(e => e.MusteriId)
                      .HasDatabaseName("ix_password_reset_tokens_musteri_id");

                entity.HasIndex(e => e.ExpiresAt)
                      .HasDatabaseName("ix_password_reset_tokens_expires_at");
            });
        }
    }

    // Global Query Filters için interface
    public interface ISoftDelete
    {
        bool IsDeleted { get; set; }
    }

    public static class SoftDeleteQueryExtension
    {
        public static void AddSoftDeleteQueryFilter(this IMutableEntityType entityData)
        {
            var methodToCall = typeof(SoftDeleteQueryExtension)
                .GetMethod(nameof(GetSoftDeleteFilter),
                    BindingFlags.NonPublic | BindingFlags.Static)
                ?.MakeGenericMethod(entityData.ClrType);
            
            if (methodToCall != null)
            {
                var filter = methodToCall.Invoke(null, new object[] { });
                if (filter != null)
                {
                    entityData.SetQueryFilter((LambdaExpression)filter);
                }
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
