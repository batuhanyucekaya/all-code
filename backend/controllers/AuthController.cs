using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using backend.Models;
using System.Security.Cryptography;
using System.Text;
using System.Collections.Generic;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

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

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequest registerData)
        {
            if (_context.Users.Any(u => u.Email == registerData.Email))
                return BadRequest("Email zaten kayıtlı.");

            var user = new User
            {
                Email = registerData.Email,
                FullName = registerData.FullName,
                Telephone = registerData.Telephone,
                PasswordHash = HashPassword(registerData.Password)
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("Kayıt başarılı");
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginData)
        {
            var passwordHash = HashPassword(loginData.Password);

            var user = _context.Users.FirstOrDefault(u => u.Email == loginData.Email && u.PasswordHash == passwordHash);

            if (user == null)
                return Unauthorized("Email veya şifre yanlış");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.FullName ?? user.Email),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("UserId", user.Id.ToString())
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Ok(new { message = "Giriş başarılı", userId = user.Id, fullName = user.FullName });
        }

        [HttpGet("user")]
        [Authorize]
        public IActionResult GetUser()
        {
            var userName = HttpContext.User.Identity?.Name;
            if (string.IsNullOrEmpty(userName))
                return Unauthorized();

            return Ok(new { name = userName });
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok();
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
