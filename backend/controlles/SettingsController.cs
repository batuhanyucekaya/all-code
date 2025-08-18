using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.controlles
{
    [ApiController]
    [Route("api/[controller]")]
    public class SettingsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SettingsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/settings/{musteriId}
        [HttpGet("{musteriId}")]
        public async Task<ActionResult<MusteriAyarlari>> GetSettings(int musteriId)
        {
            var settings = await _context.MusteriAyarlari
                .FirstOrDefaultAsync(s => s.MusteriId == musteriId);

            if (settings == null)
            {
                return NotFound(new { message = "Müşteri ayarları bulunamadı" });
            }

            return Ok(settings);
        }

        // PUT: api/settings/{musteriId}
        [HttpPut("{musteriId}")]
        public async Task<IActionResult> UpdateSettings(int musteriId, [FromBody] MusteriAyarlari settings)
        {
            if (musteriId != settings.MusteriId)
            {
                return BadRequest(new { message = "Müşteri ID uyuşmuyor" });
            }

            var existingSettings = await _context.MusteriAyarlari
                .FirstOrDefaultAsync(s => s.MusteriId == musteriId);

            if (existingSettings == null)
            {
                return NotFound(new { message = "Müşteri ayarları bulunamadı" });
            }

            // Ayarları güncelle
            existingSettings.EmailBildirimleri = settings.EmailBildirimleri;
            existingSettings.SmsBildirimleri = settings.SmsBildirimleri;
            existingSettings.PushBildirimleri = settings.PushBildirimleri;
            existingSettings.ProfilGorunurlugu = settings.ProfilGorunurlugu;
            existingSettings.SiparisGecmisiPaylasimi = settings.SiparisGecmisiPaylasimi;
            existingSettings.DegerlendirmePaylasimi = settings.DegerlendirmePaylasimi;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Ayarlar başarıyla güncellendi" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SettingsExists(musteriId))
                {
                    return NotFound(new { message = "Müşteri ayarları bulunamadı" });
                }
                else
                {
                    throw;
                }
            }
        }

        // POST: api/settings/seed
        [HttpPost("seed")]
        public async Task<ActionResult<MusteriAyarlari>> SeedSettings([FromBody] SeedRequest request)
        {
            try
            {
                // Müşteri var mı kontrol et
                var musteri = await _context.Musteriler.FindAsync(request.MusteriId);
                if (musteri == null)
                {
                    return NotFound(new { message = "Müşteri bulunamadı" });
                }

                // Ayarlar zaten var mı kontrol et
                var existingSettings = await _context.MusteriAyarlari
                    .FirstOrDefaultAsync(s => s.MusteriId == request.MusteriId);

                if (existingSettings != null)
                {
                    return Ok(existingSettings);
                }

                // Yeni ayarlar oluştur
                var newSettings = new MusteriAyarlari
                {
                    MusteriId = request.MusteriId,
                    EmailBildirimleri = true,
                    SmsBildirimleri = false,
                    PushBildirimleri = true,
                    ProfilGorunurlugu = true,
                    SiparisGecmisiPaylasimi = false,
                    DegerlendirmePaylasimi = true,
                    CreatedAt = DateTime.UtcNow
                };

                _context.MusteriAyarlari.Add(newSettings);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetSettings), new { musteriId = newSettings.MusteriId }, newSettings);
            }
            catch (DbUpdateException ex) when (ex.InnerException?.Message.Contains("duplicate key") == true)
            {
                // Eğer duplicate key hatası alırsak, mevcut ayarları getir
                var existingSettings = await _context.MusteriAyarlari
                    .FirstOrDefaultAsync(s => s.MusteriId == request.MusteriId);
                
                if (existingSettings != null)
                {
                    return Ok(existingSettings);
                }
                
                return BadRequest(new { message = "Ayarlar oluşturulamadı" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Sunucu hatası: " + ex.Message });
            }
        }

        public class SeedRequest
        {
            public int MusteriId { get; set; }
        }

        private bool SettingsExists(int musteriId)
        {
            return _context.MusteriAyarlari.Any(e => e.MusteriId == musteriId);
        }
    }
}
