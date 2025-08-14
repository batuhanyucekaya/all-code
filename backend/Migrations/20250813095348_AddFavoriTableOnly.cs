using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddFavoriTableOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "musteri_ayarlari");

            migrationBuilder.CreateTable(
                name: "favoriler",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    urun_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_favoriler", x => x.id);
                    table.ForeignKey(
                        name: "FK_favoriler_musteri_musteri_id",
                        column: x => x.musteri_id,
                        principalTable: "musteri",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_favoriler_urunler_urun_id",
                        column: x => x.urun_id,
                        principalTable: "urunler",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_favoriler_musteri_id_urun_id",
                table: "favoriler",
                columns: new[] { "musteri_id", "urun_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_favoriler_urun_id",
                table: "favoriler",
                column: "urun_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "favoriler");

            migrationBuilder.CreateTable(
                name: "musteri_ayarlari",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    degerlendirme_paylasimi = table.Column<bool>(type: "boolean", nullable: false),
                    email = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    email_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    musteri_id = table.Column<int>(type: "integer", nullable: false),
                    profil_gorunurlugu = table.Column<bool>(type: "boolean", nullable: false),
                    push_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    siparis_gecmisi_paylasimi = table.Column<bool>(type: "boolean", nullable: false),
                    sms_bildirim = table.Column<bool>(type: "boolean", nullable: false),
                    soyad = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    telefon = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_musteri_ayarlari", x => x.id);
                });

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
    }
}
