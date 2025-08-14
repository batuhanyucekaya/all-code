using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/settings")]
    [Route("api/musteri-ayarlar")]
    public class CustomerSettingsController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly ILogger<CustomerSettingsController> _logger;

        public CustomerSettingsController(AppDbContext db, ILogger<CustomerSettingsController> logger)
        {
            _db = db;
            _logger = logger;
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var musteri = await _db.Musteriler.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
                if (musteri == null)
                {
                    return NotFound(new { message = "Müşteri bulunamadı" });
                }
                
                return Ok(new {
                    id = musteri.Id,
                    ad = musteri.Ad,
                    soyad = musteri.Soyad,
                    email = musteri.Email,
                    telefon = musteri.Telefon
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Müşteri bilgileri getirilirken hata oluştu. ID: {Id}", id);
                return BadRequest(new { message = "Müşteri bilgileri getirilemedi", error = ex.Message });
            }
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> Update(int id, [FromBody] MusteriUpdateRequest body)
        {
            try
            {
                var musteri = await _db.Musteriler.FirstOrDefaultAsync(x => x.Id == id);
                if (musteri == null)
                {
                    return NotFound(new { message = "Güncellenecek müşteri bulunamadı" });
                }

                
                musteri.Ad = body.Ad;
                musteri.Soyad = body.Soyad;
                musteri.Email = body.Email;
                musteri.Telefon = body.Telefon;
                
                await _db.SaveChangesAsync();
                return Ok(new { message = "Müşteri bilgileri başarıyla güncellendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Müşteri bilgileri güncellenirken hata oluştu. ID: {Id}", id);
                return BadRequest(new { message = "Müşteri bilgileri güncellenemedi", error = ex.Message });
            }
        }

        [HttpPost("seed")]
        public async Task<IActionResult> SeedTestData()
        {
            try
            {
                var existingMusteri = await _db.Musteriler.FirstOrDefaultAsync(x => x.Id == 1);
                if (existingMusteri != null)
                {
                    return Ok(new { message = "Test müşterisi zaten mevcut", id = existingMusteri.Id });
                }

                var testMusteri = new Musteri
                {
                    Id = 1,
                    Ad = "Ahmet",
                    Soyad = "Yılmaz",
                    Email = "ahmet.yilmaz@email.com",
                    Telefon = "+90 555 123 4567",
                    Password = "test123"
                };

                _db.Musteriler.Add(testMusteri);
                await _db.SaveChangesAsync();

                return Ok(new { message = "Test müşterisi başarıyla eklendi", id = testMusteri.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Test müşterisi eklenirken hata oluştu");
                return BadRequest(new { message = "Test müşterisi eklenemedi", error = ex.Message });
            }
        }
    }

    public class MusteriUpdateRequest
    {
        public string Ad { get; set; } = string.Empty;
        public string Soyad { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefon { get; set; } = string.Empty;
    }
}
