using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using backend.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PasswordResetController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<PasswordResetController> _logger;
        private readonly IConfiguration _configuration;

        public PasswordResetController(
            AppDbContext context,
            IEmailService emailService,
            ILogger<PasswordResetController> logger,
            IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
            _configuration = configuration;
        }

        // POST: api/passwordreset/request
        [HttpPost("request")]
        public async Task<IActionResult> RequestPasswordReset([FromBody] PasswordResetRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Kullanıcıyı bul
                var musteri = await _context.Musteriler
                    .FirstOrDefaultAsync(m => m.Email == request.Email);

                if (musteri == null)
                {
                    // Güvenlik için kullanıcı bulunamasa da başarılı mesajı döndür
                    _logger.LogWarning($"Şifre sıfırlama talebi - Kullanıcı bulunamadı: {request.Email}");
                    return Ok(new { message = "Şifre sıfırlama linki email adresinize gönderildi." });
                }

                // Eski token'ları temizle
                var oldTokens = await _context.PasswordResetTokens
                    .Where(t => t.MusteriId == musteri.Id && !t.IsUsed)
                    .ToListAsync();

                _context.PasswordResetTokens.RemoveRange(oldTokens);

                // Yeni token oluştur
                var token = GenerateSecureToken();
                var expiresAt = DateTime.UtcNow.AddHours(1); // 1 saat geçerli

                var resetToken = new PasswordResetToken
                {
                    MusteriId = musteri.Id,
                    Token = token,
                    ExpiresAt = expiresAt,
                    IsUsed = false
                };

                _context.PasswordResetTokens.Add(resetToken);
                await _context.SaveChangesAsync();

                // Reset linki oluştur
                var resetLink = $"{_configuration["AppUrl"]}/reset-password?token={token}";

                // Email gönder
                await _emailService.SendPasswordResetEmailAsync(
                    musteri.Email,
                    resetLink,
                    $"{musteri.Ad} {musteri.Soyad}"
                );

                _logger.LogInformation($"Şifre sıfırlama talebi başarılı: {request.Email}");
                return Ok(new { message = "Şifre sıfırlama linki email adresinize gönderildi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şifre sıfırlama talebi hatası");
                return StatusCode(500, "Şifre sıfırlama işlemi sırasında bir hata oluştu.");
            }
        }

        // POST: api/passwordreset/confirm
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPasswordReset([FromBody] PasswordResetConfirm request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                // Token'ı bul ve kontrol et
                var resetToken = await _context.PasswordResetTokens
                    .Include(t => t.Musteri)
                    .FirstOrDefaultAsync(t => t.Token == request.Token);

                if (resetToken == null)
                {
                    return BadRequest("Geçersiz veya süresi dolmuş token.");
                }

                if (resetToken.IsUsed)
                {
                    return BadRequest("Bu token daha önce kullanılmış.");
                }

                if (resetToken.ExpiresAt < DateTime.UtcNow)
                {
                    return BadRequest("Token süresi dolmuş.");
                }

                // Şifreyi güncelle (düz metin olarak)
                resetToken.Musteri.Password = request.NewPassword;

                // Token'ı kullanıldı olarak işaretle
                resetToken.IsUsed = true;

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Şifre başarıyla sıfırlandı: {resetToken.Musteri.Email}");
                return Ok(new { message = "Şifreniz başarıyla güncellendi." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Şifre sıfırlama onaylama hatası");
                return StatusCode(500, "Şifre güncelleme işlemi sırasında bir hata oluştu.");
            }
        }

        // GET: api/passwordreset/validate?token=xxx
        [HttpGet("validate")]
        public async Task<IActionResult> ValidateToken([FromQuery] string token)
        {
            try
            {
                if (string.IsNullOrEmpty(token))
                {
                    return BadRequest("Token gerekli.");
                }

                var resetToken = await _context.PasswordResetTokens
                    .FirstOrDefaultAsync(t => t.Token == token);

                if (resetToken == null)
                {
                    return BadRequest("Geçersiz token.");
                }

                if (resetToken.IsUsed)
                {
                    return BadRequest("Bu token daha önce kullanılmış.");
                }

                if (resetToken.ExpiresAt < DateTime.UtcNow)
                {
                    return BadRequest("Token süresi dolmuş.");
                }

                return Ok(new { valid = true, message = "Token geçerli." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Token doğrulama hatası");
                return StatusCode(500, "Token doğrulama işlemi sırasında bir hata oluştu.");
            }
        }

        private string GenerateSecureToken()
        {
            var randomBytes = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes).Replace("+", "-").Replace("/", "_").Replace("=", "");
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
