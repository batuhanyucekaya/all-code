using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "musteri",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Password = table.Column<string>(type: "text", nullable: false),
                    ad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    soyad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_musteri", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "musteri_ayarlari",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    ad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    soyad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    email_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    sms_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    push_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    profil_gorunurlugu = table.Column<bool>(type: "boolean", nullable: false),
                    siparis_gecmisi_paylasimi = table.Column<bool>(type: "boolean", nullable: false),
                    degerlendirme_paylasimi = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_musteri_ayarlari", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "urunler",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    isim = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    aciklama = table.Column<string>(type: "text", nullable: false),
                    fiyat = table.Column<decimal>(type: "numeric(18,2)", nullable: false),
                    stok = table.Column<int>(type: "integer", nullable: false, defaultValue: 0),
                    kategori_id = table.Column<int>(type: "integer", nullable: false),
                    alt_kategori_id = table.Column<int>(type: "integer", nullable: false),
                    resim_url = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_urunler", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "users",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    password_hash = table.Column<string>(type: "text", nullable: false),
                    full_name = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    telephone = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_users", x => x.id);
                });

            migrationBuilder.CreateIndex(
                name: "ix_musteri_email",
                table: "musteri",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_musteri_ayarlari_email",
                table: "musteri_ayarlari",
                column: "email");

            migrationBuilder.CreateIndex(
                name: "IX_musteri_ayarlari_musteri_id",
                table: "musteri_ayarlari",
                column: "musteri_id",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "musteri");

            migrationBuilder.DropTable(
                name: "musteri_ayarlari");

            migrationBuilder.DropTable(
                name: "urunler");

            migrationBuilder.DropTable(
                name: "users");
        }
    }
}
