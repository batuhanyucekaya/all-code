using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IEmailService _emailService;
        private readonly ILogger<ContactController> _logger;

        public ContactController(IEmailService emailService, ILogger<ContactController> logger)
        {
            _emailService = emailService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> SendContactMessage([FromBody] ContactRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Name) || 
                    string.IsNullOrEmpty(request.Email) || 
                    string.IsNullOrEmpty(request.Subject) || 
                    string.IsNullOrEmpty(request.Message))
                {
                    return BadRequest(new { error = "Tüm alanlar zorunludur" });
                }

                // Email formatı kontrolü
                if (!IsValidEmail(request.Email))
                {
                    return BadRequest(new { error = "Geçerli bir email adresi giriniz" });
                }

                // Email içeriği oluştur
                var emailBody = $@"
                    <h2>Yeni İletişim Formu Mesajı</h2>
                    <p><strong>Ad Soyad:</strong> {request.Name}</p>
                    <p><strong>Email:</strong> {request.Email}</p>
                    <p><strong>Konu:</strong> {request.Subject}</p>
                    <p><strong>Mesaj:</strong></p>
                    <p>{request.Message}</p>
                    <hr>
                    <p><em>Bu mesaj TechStore web sitesi iletişim formundan gönderilmiştir.</em></p>
                ";

                // Email gönder
                await _emailService.SendEmailAsync(
                    to: "info@techstore.com", // Şirket email adresi
                    subject: $"İletişim Formu: {request.Subject}",
                    body: emailBody,
                    isHtml: true
                );

                return Ok(new { message = "Mesajınız başarıyla gönderildi" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Contact form error");
                return StatusCode(500, new { error = "Mesaj gönderilirken bir hata oluştu" });
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }
    }

    public class ContactRequest
    {
        public string Name { get; set; } = "";
        public string Email { get; set; } = "";
        public string Subject { get; set; } = "";
        public string Message { get; set; } = "";
    }
}
