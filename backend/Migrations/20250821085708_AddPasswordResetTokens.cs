using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddPasswordResetTokens : Migration
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
                    Password = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    ad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    soyad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_musteri", x => x.id);
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

            migrationBuilder.CreateTable(
                name: "bag",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    siparis_tarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_bag", x => x.id);
                    table.ForeignKey(
                        name: "FK_bag_musteri_musteri_id",
                        column: x => x.musteri_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "fav",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    siparis_tarihi = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_fav", x => x.id);
                    table.ForeignKey(
                        name: "FK_fav_musteri_musteri_id",
                        column: x => x.musteri_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "musteri_ayarlari",
                columns: table => new
                {
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    email_bildirimleri = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    sms_bildirimleri = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    push_bildirimleri = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    profil_gorunurlugu = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    siparis_gecmisi_paylasimi = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    degerlendirme_paylasimi = table.Column<bool>(type: "boolean", nullable: false, defaultValue: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_musteri_ayarlari", x => x.musteri_id);
                    table.ForeignKey(
                        name: "FK_musteri_ayarlari_musteri_musteri_id",
                        column: x => x.musteri_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "password_reset_tokens",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    token = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    expires_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    is_used = table.Column<bool>(type: "boolean", nullable: false, defaultValue: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_password_reset_tokens", x => x.id);
                    table.ForeignKey(
                        name: "FK_password_reset_tokens_musteri_musteri_id",
                        column: x => x.musteri_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "comments",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    product_id = table.Column<int>(type: "integer", nullable: false),
                    user_id = table.Column<int>(type: "integer", nullable: false),
                    rating = table.Column<int>(type: "integer", nullable: false),
                    body = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false, defaultValueSql: "CURRENT_TIMESTAMP")
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_comments", x => x.id);
                    table.ForeignKey(
                        name: "FK_comments_musteri_user_id",
                        column: x => x.user_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_comments_urunler_product_id",
                        column: x => x.product_id,
                        principalTable: "urunler",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_bag_musteri_id",
                table: "bag",
                column: "musteri_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_product_id",
                table: "comments",
                column: "product_id");

            migrationBuilder.CreateIndex(
                name: "ix_comments_user_id",
                table: "comments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "ix_fav_musteri_id",
                table: "fav",
                column: "musteri_id");

            migrationBuilder.CreateIndex(
                name: "ix_musteri_email",
                table: "musteri",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_expires_at",
                table: "password_reset_tokens",
                column: "expires_at");

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_musteri_id",
                table: "password_reset_tokens",
                column: "musteri_id");

            migrationBuilder.CreateIndex(
                name: "ix_password_reset_tokens_token",
                table: "password_reset_tokens",
                column: "token",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "bag");

            migrationBuilder.DropTable(
                name: "comments");

            migrationBuilder.DropTable(
                name: "fav");

            migrationBuilder.DropTable(
                name: "musteri_ayarlari");

            migrationBuilder.DropTable(
                name: "password_reset_tokens");

            migrationBuilder.DropTable(
                name: "users");

            migrationBuilder.DropTable(
                name: "urunler");

            migrationBuilder.DropTable(
                name: "musteri");
        }
    }
}
