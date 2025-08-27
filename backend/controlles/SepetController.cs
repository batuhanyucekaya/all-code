using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SepetController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SepetController> _logger;

        public SepetController(AppDbContext context, ILogger<SepetController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/sepet/musteri/{musteriId}
        [HttpGet("musteri/{musteriId}")]
        public async Task<IActionResult> GetMusteriSepeti(int musteriId)
        {
            try
            {
                var sepetUrunleri = await _context.SepetItems
                    .Where(s => s.MusteriId == musteriId)
                    .Include(s => s.Urun) // Ürün bilgilerini de getir
                    .ToListAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin sepeti listelendi. {sepetUrunleri.Count} ürün bulundu.");
                return Ok(sepetUrunleri);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepet listeleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/sepet/ekle
        [HttpPost("ekle")]
        public async Task<IActionResult> SepeteEkle([FromBody] SepetEkleRequest request)
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

                // Aynı ürün zaten sepette var mı kontrol et
                var mevcutUrun = await _context.SepetItems
                    .FirstOrDefaultAsync(s => s.MusteriId == request.MusteriId && s.UrunId == request.UrunId);

                if (mevcutUrun != null)
                {
                    // Miktarı artır
                    mevcutUrun.Miktar += request.Miktar;
                    _context.SepetItems.Update(mevcutUrun);
                }
                else
                {
                    // Yeni sepet kaydı ekle
                    var sepetKaydi = new SepetItem
                    {
                        MusteriId = request.MusteriId,
                        UrunId = request.UrunId,
                        Miktar = request.Miktar,
                        EklenmeTarihi = DateTime.UtcNow
                    };

                    await _context.SepetItems.AddAsync(sepetKaydi);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"{request.MusteriId} ID'li müşterinin sepetine {request.UrunId} ID'li ürün eklendi.");
                return Ok(new { message = "Sepete eklendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepete ekleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // PUT: api/sepet/guncelle
        [HttpPut("guncelle")]
        public async Task<IActionResult> SepetGuncelle([FromBody] SepetGuncelleRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var sepetKaydi = await _context.SepetItems
                    .FirstOrDefaultAsync(s => s.MusteriId == request.MusteriId && s.UrunId == request.UrunId);

                if (sepetKaydi == null)
                {
                    return NotFound("Sepet kaydı bulunamadı");
                }

                if (request.Miktar <= 0)
                {
                    // Miktar 0 veya negatifse ürünü sepetten kaldır
                    _context.SepetItems.Remove(sepetKaydi);
                }
                else
                {
                    // Miktarı güncelle
                    sepetKaydi.Miktar = request.Miktar;
                    _context.SepetItems.Update(sepetKaydi);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"{request.MusteriId} ID'li müşterinin sepetindeki {request.UrunId} ID'li ürün güncellendi.");
                return Ok(new { message = "Sepet güncellendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepet güncelleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/sepet/sil/{musteriId}/{urunId}
        [HttpDelete("sil/{musteriId}/{urunId}")]
        public async Task<IActionResult> SepettenSil(int musteriId, int urunId)
        {
            try
            {
                var sepetKaydi = await _context.SepetItems
                    .FirstOrDefaultAsync(s => s.MusteriId == musteriId && s.UrunId == urunId);

                if (sepetKaydi == null)
                {
                    return NotFound("Sepet kaydı bulunamadı");
                }

                _context.SepetItems.Remove(sepetKaydi);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin sepetinden {urunId} ID'li ürün silindi");
                return Ok(new { message = "Ürün sepetten kaldırıldı" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepetten silme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/sepet/temizle/{musteriId}
        [HttpDelete("temizle/{musteriId}")]
        public async Task<IActionResult> SepetiTemizle(int musteriId)
        {
            try
            {
                var sepetKayitlari = await _context.SepetItems
                    .Where(s => s.MusteriId == musteriId)
                    .ToListAsync();

                if (!sepetKayitlari.Any())
                {
                    return NotFound("Sepet zaten boş");
                }

                _context.SepetItems.RemoveRange(sepetKayitlari);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"{musteriId} ID'li müşterinin sepeti temizlendi. {sepetKayitlari.Count} ürün silindi.");
                return Ok(new { message = "Sepet temizlendi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepet temizleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/sepet/sayisi/{musteriId}
        [HttpGet("sayisi/{musteriId}")]
        public async Task<IActionResult> GetSepetSayisi(int musteriId)
        {
            try
            {
                var sepetSayisi = await _context.SepetItems
                    .Where(s => s.MusteriId == musteriId)
                    .SumAsync(s => s.Miktar);

                _logger.LogInformation($"{musteriId} ID'li müşterinin sepet sayısı: {sepetSayisi}");
                return Ok(new { sepetSayisi });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Sepet sayısı alma hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }
    }

    public class SepetEkleRequest
    {
        public int MusteriId { get; set; }
        public int UrunId { get; set; }
        public int Miktar { get; set; } = 1;
    }

    public class SepetGuncelleRequest
    {
        public int MusteriId { get; set; }
        public int UrunId { get; set; }
        public int Miktar { get; set; }
    }
}
