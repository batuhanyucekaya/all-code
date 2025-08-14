using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UrunController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UrunController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var urunler = _context.Urunler.ToList();
            return Ok(urunler);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var urun = _context.Urunler.Find(id);
            if (urun == null) return NotFound();
            return Ok(urun);
        }

        [HttpPost]
        public IActionResult Post([FromBody] Urun urun)
        {
            _context.Urunler.Add(urun);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetById), new { id = urun.id }, urun);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Urun guncelUrun)
        {
            var urun = _context.Urunler.Find(id);
            if (urun == null) return NotFound();

            urun.isim = guncelUrun.isim;
            urun.aciklama = guncelUrun.aciklama;
            urun.fiyat = guncelUrun.fiyat;
            urun.stok = guncelUrun.stok;
            urun.kategori_id = guncelUrun.kategori_id;
            urun.alt_kategori_id = guncelUrun.alt_kategori_id;
            urun.resim_url = guncelUrun.resim_url;

            _context.SaveChanges();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var urun = _context.Urunler.Find(id);
            if (urun == null) return NotFound();

            _context.Urunler.Remove(urun);
            _context.SaveChanges();
            return NoContent();
        }
    }
}