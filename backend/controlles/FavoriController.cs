using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<FavoriController> _logger;

        public FavoriController(AppDbContext context, ILogger<FavoriController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/favori/musteri/{musteriId}
        [HttpGet("musteri/{musteriId}")]
        public async Task<IActionResult> GetMusteriFavorileri(int musteriId)
        {
            try
            {
                var favoriler = await _context.Favoriler
                    .Where(f => f.MusteriId == musteriId)
                    .ToListAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favorileri listelendi. {favoriler.Count} kayıt bulundu.");
                return Ok(favoriler);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori listeleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/favori/ekle
        [HttpPost("ekle")]
        public async Task<IActionResult> FavoriEkle([FromBody] FavoriEkleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Müşterinin var olup olmadığını kontrol et
                var musteri = await _context.Musteriler.FindAsync(request.MusteriId);
                if (musteri == null)
                {
                    return NotFound("Müşteri bulunamadı");
                }

                // Yeni favori kaydı ekle
                var favoriKaydi = new Favori
                {
                    MusteriId = request.MusteriId,
                    SiparisTarihi = DateTime.UtcNow
                };

                await _context.Favoriler.AddAsync(favoriKaydi);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{request.MusteriId} ID'li müşterinin favorilerine yeni kayıt eklendi.");
                return Ok(new { message = "Favorilere eklendi", id = favoriKaydi.Id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori ekleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/favori/sil/{id}
        [HttpDelete("sil/{id}")]
        public async Task<IActionResult> FavoriSil(int id)
        {
            try
            {
                var favoriKaydi = await _context.Favoriler.FindAsync(id);
                if (favoriKaydi == null)
                {
                    return NotFound("Favori kaydı bulunamadı");
                }

                _context.Favoriler.Remove(favoriKaydi);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{id} ID'li favori kaydı silindi");
                return Ok(new { message = "Favori kaydı silindi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori silme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/favori/temizle/{musteriId}
        [HttpDelete("temizle/{musteriId}")]
        public async Task<IActionResult> FavorileriTemizle(int musteriId)
        {
            try
            {
                var favoriKayitlari = await _context.Favoriler
                    .Where(f => f.MusteriId == musteriId)
                    .ToListAsync();

                if (!favoriKayitlari.Any())
                {
                    return NotFound("Favoriler zaten boş");
                }

                _context.Favoriler.RemoveRange(favoriKayitlari);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favorileri temizlendi. {favoriKayitlari.Count} kayıt silindi.");
                return Ok(new { message = "Favoriler temizlendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori temizleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/favori/sayisi/{musteriId}
        [HttpGet("sayisi/{musteriId}")]
        public async Task<IActionResult> GetFavoriSayisi(int musteriId)
        {
            try
            {
                var favoriSayisi = await _context.Favoriler
                    .Where(f => f.MusteriId == musteriId)
                    .CountAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favori sayısı: {favoriSayisi}");
                return Ok(new { favoriSayisi });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori sayısı alma hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/favori/kontrol/{musteriId}
        [HttpGet("kontrol/{musteriId}")]
        public async Task<IActionResult> FavoriKontrol(int musteriId)
        {
            try
            {
                var favoriVarMi = await _context.Favoriler
                    .AnyAsync(f => f.MusteriId == musteriId);

                _logger.LogInformation($"{musteriId} ID'li müşterinin favori kontrolü: {favoriVarMi}");
                return Ok(new { favoriVarMi });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori kontrol hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

    public class FavoriEkleRequest
    {
        public int MusteriId { get; set; }
    }
}
