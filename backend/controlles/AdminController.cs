using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Security.Cryptography;
using System.Text;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AppDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] AdminLoginRequest loginData)
        {
            try
            {
                if (string.IsNullOrEmpty(loginData.Username) || string.IsNullOrEmpty(loginData.Password))
                {
                    return BadRequest(new { message = "Kullanıcı adı ve şifre gereklidir." });
                }

                var hashedPassword = HashPassword(loginData.Password);
                var defaultAdminHash = HashPassword("admin123");

                if (loginData.Username == "admin" && hashedPassword == defaultAdminHash)
                {
                    return Ok(new { 
                        message = "Giriş başarılı", 
                        username = "admin",
                        fullName = "Admin"
                    });
                }

                return Unauthorized(new { message = "Kullanıcı adı veya şifre yanlış" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Admin login error");
                return StatusCode(500, new { message = "Sunucu hatası" });
            }
        }

        [HttpPost("change-password")]
        public IActionResult ChangePassword([FromBody] AdminPasswordChangeRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 6)
                {
                    return BadRequest(new { message = "Yeni şifre en az 6 karakter olmalıdır." });
                }

                var currentPasswordHash = HashPassword(request.CurrentPassword);
                var defaultAdminHash = HashPassword("admin123");

                if (currentPasswordHash != defaultAdminHash)
                {
                    return Unauthorized(new { message = "Mevcut şifre yanlış" });
                }

                var newPasswordHash = HashPassword(request.NewPassword);
                
                return Ok(new { 
                    message = "Şifre başarıyla değiştirildi",
                    newPasswordHash = newPasswordHash
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Admin password change error");
                return StatusCode(500, new { message = "Sunucu hatası" });
            }
        }
    }
}
