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

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Telephone { get; set; }
    }

    public class PasswordChangeRequest
    {
        public string CurrentPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

        // POST: api/musteri/register
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest registerRequest)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(registerRequest.Email) || 
                    string.IsNullOrWhiteSpace(registerRequest.Password) ||
                    string.IsNullOrWhiteSpace(registerRequest.FullName))
                {
                    _logger.LogWarning("Register attempt with empty required fields");
                    return BadRequest("Email, şifre ve ad soyad gereklidir.");
                }

                // Email format kontrolü
                if (!registerRequest.Email.Contains("@"))
                {
                    return BadRequest("Geçerli bir email adresi giriniz.");
                }

                // Email zaten var mı kontrol et
                var existingMusteri = await _context.Musteriler
                    .FirstOrDefaultAsync(m => m.Email.ToLower() == registerRequest.Email.ToLower());

                if (existingMusteri != null)
                {
                    _logger.LogWarning($"Email already exists: {registerRequest.Email}");
                    return BadRequest("Bu email adresi zaten kullanılıyor.");
                }

                // Ad ve soyadı ayır
                var nameParts = registerRequest.FullName.Split(' ', 2);
                var ad = nameParts[0];
                var soyad = nameParts.Length > 1 ? nameParts[1] : "";

                // Yeni müşteri oluştur
                var yeniMusteri = new Musteri
                {
                    Email = registerRequest.Email.ToLower(),
                    Password = registerRequest.Password,
                    Ad = ad,
                    Soyad = soyad,
                    Telefon = registerRequest.Telephone ?? ""
                };

                await _context.Musteriler.AddAsync(yeniMusteri);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Yeni müşteri kaydı: {yeniMusteri.Email}");

                // Güvenlik için şifreyi çıktıdan kaldır
                var responseMusteri = new
                {
                    Id = yeniMusteri.Id,
                    Email = yeniMusteri.Email,
                    Ad = yeniMusteri.Ad,
                    Soyad = yeniMusteri.Soyad,
                    Telefon = yeniMusteri.Telefon
                };

                return Ok(responseMusteri);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Register error occurred");
                return StatusCode(500, "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password))
                {
                    _logger.LogWarning("Login attempt with empty email or password");
                    return BadRequest("Email ve şifre gereklidir.");
                }

                _logger.LogInformation($"Login attempt for email: {loginRequest.Email}");

                // Email ile müşteriyi bul
                var musteri = await _context.Musteriler
                    .FirstOrDefaultAsync(m => m.Email.ToLower() == loginRequest.Email.ToLower());

                if (musteri == null)
                {
                    _logger.LogWarning($"User not found with email: {loginRequest.Email}");
                    return Unauthorized("Email veya şifre yanlış.");
                }

                // Şifre kontrolü (case sensitive)
                if (musteri.Password != loginRequest.Password)
                {
                    _logger.LogWarning($"Wrong password for email: {loginRequest.Email}");
                    return Unauthorized("Email veya şifre yanlış.");
                }

                _logger.LogInformation($"Başarılı giriş: {musteri.Email}");
                
                // Güvenlik için şifreyi çıktıdan kaldır
                var responseMusteri = new
                {
                    Id = musteri.Id,
                    Email = musteri.Email,
                    Ad = musteri.Ad,
                    Soyad = musteri.Soyad,
                    Telefon = musteri.Telefon
                };

                return Ok(responseMusteri);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error occurred");
                return StatusCode(500, "Bir hata oluştu. Lütfen tekrar deneyin.");
            }
        }

        // PUT: api/musteri/{id}/password
        [HttpPut("{id}/password")]
        public async Task<IActionResult> ChangePassword(int id, [FromBody] PasswordChangeRequest request)
        {
            try
            {
                // Input validation
                if (string.IsNullOrWhiteSpace(request.CurrentPassword) || string.IsNullOrWhiteSpace(request.NewPassword))
                {
                    return BadRequest(new { error = "Mevcut şifre ve yeni şifre gereklidir." });
                }

                if (request.NewPassword.Length < 6)
                {
                    return BadRequest(new { error = "Yeni şifre en az 6 karakter olmalıdır." });
                }

                // Müşteriyi bul
                var musteri = await _context.Musteriler.FindAsync(id);
                if (musteri == null)
                {
                    return NotFound(new { error = "Müşteri bulunamadı." });
                }

                // Mevcut şifreyi kontrol et
                if (musteri.Password != request.CurrentPassword)
                {
                    _logger.LogWarning($"Wrong current password for user ID: {id}");
                    return BadRequest(new { error = "Mevcut şifre yanlış." });
                }

                // Yeni şifreyi güncelle
                musteri.Password = request.NewPassword;
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Password changed successfully for user ID: {id}");

                return Ok(new { message = "Şifre başarıyla değiştirildi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Password change error occurred");
                return StatusCode(500, new { error = "Şifre değiştirme sırasında bir hata oluştu." });
            }
        }
    }
}
