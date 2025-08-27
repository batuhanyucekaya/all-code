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
                var favoriUrunleri = await _context.FavoriItems
                    .Where(f => f.MusteriId == musteriId)
                    .Include(f => f.Urun) // Ürün bilgilerini de getir
                    .ToListAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favorileri listelendi. {favoriUrunleri.Count} ürün bulundu.");
                return Ok(favoriUrunleri);
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

                // Ürünün var olup olmadığını kontrol et
                var urun = await _context.Urunler.FindAsync(request.UrunId);
                if (urun == null)
                {
                    return NotFound("Ürün bulunamadı");
                }

                // Ürün zaten favorilerde var mı kontrol et
                var mevcutFavori = await _context.FavoriItems
                    .FirstOrDefaultAsync(f => f.MusteriId == request.MusteriId && f.UrunId == request.UrunId);

                if (mevcutFavori != null)
                {
                    return BadRequest("Bu ürün zaten favorilerinizde");
                }

                // Yeni favori kaydı ekle
                var favoriKaydi = new FavoriItem
                {
                    MusteriId = request.MusteriId,
                    UrunId = request.UrunId,
                    EklenmeTarihi = DateTime.UtcNow
                };

                await _context.FavoriItems.AddAsync(favoriKaydi);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{request.MusteriId} ID'li müşterinin favorilerine {request.UrunId} ID'li ürün eklendi.");
                return Ok(new { message = "Favorilere eklendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Favori ekleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/favori/sil/{musteriId}/{urunId}
        [HttpDelete("sil/{musteriId}/{urunId}")]
        public async Task<IActionResult> FavoriSil(int musteriId, int urunId)
        {
            try
            {
                var favoriKaydi = await _context.FavoriItems
                    .FirstOrDefaultAsync(f => f.MusteriId == musteriId && f.UrunId == urunId);

                if (favoriKaydi == null)
                {
                    return NotFound("Favori kaydı bulunamadı");
                }

                _context.FavoriItems.Remove(favoriKaydi);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favorilerinden {urunId} ID'li ürün silindi");
                return Ok(new { message = "Ürün favorilerden kaldırıldı" });
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
                var favoriKayitlari = await _context.FavoriItems
                    .Where(f => f.MusteriId == musteriId)
                    .ToListAsync();

                if (!favoriKayitlari.Any())
                {
                    return NotFound("Favoriler zaten boş");
                }

                _context.FavoriItems.RemoveRange(favoriKayitlari);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin favorileri temizlendi. {favoriKayitlari.Count} ürün silindi.");
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
                var favoriSayisi = await _context.FavoriItems
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

        // GET: api/favori/kontrol/{musteriId}/{urunId}
        [HttpGet("kontrol/{musteriId}/{urunId}")]
        public async Task<IActionResult> FavoriKontrol(int musteriId, int urunId)
        {
            try
            {
                var favoriVar = await _context.FavoriItems
                    .AnyAsync(f => f.MusteriId == musteriId && f.UrunId == urunId);

                return Ok(new { favoriVar });
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
        public int UrunId { get; set; }
    }
}
