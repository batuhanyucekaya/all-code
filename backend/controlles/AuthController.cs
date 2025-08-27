using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Threading.Tasks;
using System.Linq;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest registerData)
        {
            if (_context.Musteriler.Any(u => u.Email == registerData.Email))
                return BadRequest("Email zaten kayıtlı.");

            var musteri = new Musteri
            {
                Email = registerData.Email,
                Ad = registerData.FullName.Split(' ')[0], // İlk isim
                Soyad = registerData.FullName.Contains(' ') ? registerData.FullName.Substring(registerData.FullName.IndexOf(' ') + 1) : "",
                Telefon = registerData.Telephone,
                Password = registerData.Password // Şifreyi plain text olarak kaydet
            };

            _context.Musteriler.Add(musteri);
            _context.SaveChanges();

            return Ok("Kayıt başarılı");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest loginData)
        {
            if (string.IsNullOrEmpty(loginData.Email) || string.IsNullOrEmpty(loginData.Password))
                return BadRequest("Email ve şifre gereklidir.");

            // Şifreyi plain text olarak karşılaştır
            var musteri = _context.Musteriler.FirstOrDefault(u => u.Email == loginData.Email && u.Password == loginData.Password);

            if (musteri == null)
                return Unauthorized(new { message = "Email veya şifre yanlış" });

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, musteri.Ad + " " + musteri.Soyad),
                new Claim(ClaimTypes.Email, musteri.Email),
                new Claim("UserId", musteri.Id.ToString())
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties
            {
                IsPersistent = true,
                ExpiresUtc = DateTime.UtcNow.AddDays(30)
            });

            return Ok(new { message = "Giriş başarılı", userId = musteri.Id, fullName = musteri.Ad + " " + musteri.Soyad, email = musteri.Email });
        }

        [HttpGet("user")]
        [Authorize]
        public IActionResult GetUser()
        {
            var userName = HttpContext.User.Identity?.Name;
            var userId = HttpContext.User.FindFirst("UserId")?.Value;
            var userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

            if (string.IsNullOrEmpty(userName))
                return Unauthorized(new { message = "Kullanıcı bilgileri bulunamadı" });

            return Ok(new { name = userName, userId = userId, email = userEmail });
        }

        [HttpPost("logout")]
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Çıkış başarılı" });
        }

        [HttpGet("check")]
        public IActionResult CheckAuth()
        {
            if (HttpContext.User.Identity?.IsAuthenticated == true)
            {
                var userName = HttpContext.User.Identity.Name;
                var userId = HttpContext.User.FindFirst("UserId")?.Value;
                var userEmail = HttpContext.User.FindFirst(ClaimTypes.Email)?.Value;

                return Ok(new { isAuthenticated = true, name = userName, userId = userId, email = userEmail });
            }
            else
            {
                return Ok(new { isAuthenticated = false });
            }
        }

        [HttpPost("create-test-user")]
        public IActionResult CreateTestUser()
        {
            try
            {
                // Test kullanıcısı var mı kontrol et
                var existingUser = _context.Musteriler.FirstOrDefault(u => u.Email == "test@test.com");
                if (existingUser != null)
                {
                    return Ok(new { message = "Test kullanıcısı zaten mevcut", userId = existingUser.Id });
                }

                var testUser = new Musteri
                {
                    Email = "test@test.com",
                    Ad = "Test",
                    Soyad = "User",
                    Telefon = "1234567890",
                    Password = "123456" // Şifre: 123456 (plain text)
                };

                _context.Musteriler.Add(testUser);
                _context.SaveChanges();

                return Ok(new { 
                    message = "Test kullanıcısı oluşturuldu", 
                    userId = testUser.Id,
                    email = "test@test.com",
                    password = "123456"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Test kullanıcısı oluşturulurken hata: " + ex.Message });
            }
        }

        [HttpPost("fix-passwords")]
        public IActionResult FixPasswords()
        {
            try
            {
                var users = _context.Musteriler.ToList();
                var updatedCount = 0;

                foreach (var user in users)
                {
                    // Eğer şifre hash'li ise (uzun string), plain text'e çevir
                    if (user.Password.Length > 20) // Hash'li şifreler genelde uzun olur
                    {
                        user.Password = "123456"; // Varsayılan şifre
                        updatedCount++;
                    }
                }

                _context.SaveChanges();

                return Ok(new { message = $"{updatedCount} kullanıcının şifresi düzeltildi", updatedCount = updatedCount });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Şifreler düzeltilirken hata: " + ex.Message });
            }
        }

        [HttpGet("list-users")]
        public IActionResult ListUsers()
        {
            try
            {
                var users = _context.Musteriler.Select(u => new { 
                    u.Id, 
                    u.Email, 
                    u.Ad, 
                    u.Soyad, 
                    u.Telefon, 
                    Password = u.Password 
                }).ToList();

                return Ok(new { users = users, count = users.Count });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Kullanıcılar listelenirken hata: " + ex.Message });
            }
        }
    }

    public class RegisterRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
