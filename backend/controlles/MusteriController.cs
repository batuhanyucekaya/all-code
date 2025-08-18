using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MusteriController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<MusteriController> _logger;

        public MusteriController(AppDbContext context, ILogger<MusteriController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/musteri
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var musteriler = await _context.Musteriler.ToListAsync();
                _logger.LogInformation($"{musteriler.Count} müşteri listelendi.");
                return Ok(musteriler);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Müşteri listeleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/musteri/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var musteri = await _context.Musteriler.FindAsync(id);
            if (musteri == null)
            {
                _logger.LogWarning($"{id} numaralı müşteri bulunamadı");
                return NotFound();
            }
            return Ok(musteri);
        }

        // POST: api/musteri
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Musteri musteri)
        {
            if (!ModelState.IsValid)
            {
                _logger.LogWarning("Geçersiz model state");
                return BadRequest(ModelState);
            }

            await _context.Musteriler.AddAsync(musteri);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"{musteri.Id} ID'li müşteri oluşturuldu");
            return CreatedAtAction(nameof(GetById), new { id = musteri.Id }, musteri);
        }

        // PUT: api/musteri/5
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Musteri musteri)
        {
            if (id != musteri.Id)
                return BadRequest("ID uyuşmazlığı");

            var existing = await _context.Musteriler.FindAsync(id);
            if (existing == null)
                return NotFound();

            _context.Entry(existing).CurrentValues.SetValues(musteri);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Eşzamanlı güncelleme hatası");
                return Conflict("Veri başkası tarafından değiştirildi");
            }

            return NoContent();
        }

        // DELETE: api/musteri/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var musteri = await _context.Musteriler.FindAsync(id);
            if (musteri == null)
                return NotFound();

            _context.Musteriler.Remove(musteri);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"{id} ID'li müşteri silindi");
            return NoContent();
        }

        // LOGIN için POST api/musteri/login
        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            var musteri = await _context.Musteriler
                .FirstOrDefaultAsync(m => m.Email == loginRequest.Email && m.Password == loginRequest.Password);

            if (musteri == null)
            {
                _logger.LogWarning($"Giriş başarısız: {loginRequest.Email}");
                return Unauthorized("Email veya şifre yanlış.");
            }

            _logger.LogInformation($"Başarılı giriş: {musteri.Email}");
            return Ok(musteri);
        }
    }
}
