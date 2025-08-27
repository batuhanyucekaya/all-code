using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Text;

namespace backend.Services
{
    public interface IEmailService
    {
        Task SendPasswordResetEmailAsync(string email, string resetLink, string userName);
    }

    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendPasswordResetEmailAsync(string email, string resetLink, string userName)
        {
            try
            {
                var message = new MimeMessage();
                var fromEmail = _configuration["Email:From"] ?? "stajicredible123@gmail.com";
                message.From.Add(new MailboxAddress("Teknoloji Mağazası", fromEmail));
                message.To.Add(new MailboxAddress(userName, email));
                message.Subject = "Şifre Sıfırlama Talebi";

                var bodyBuilder = new BodyBuilder();
                bodyBuilder.HtmlBody = CreatePasswordResetEmailHtml(resetLink, userName);

                message.Body = bodyBuilder.ToMessageBody();

                using var client = new SmtpClient();
                await client.ConnectAsync(
                    _configuration["Email:SmtpServer"] ?? "smtp.gmail.com",
                    int.Parse(_configuration["Email:Port"] ?? "587"),
                    SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    _configuration["Email:Username"] ?? "",
                    _configuration["Email:Password"] ?? ""
                );

                await client.SendAsync(message);
                await client.DisconnectAsync(true);

                _logger.LogInformation($"Şifre sıfırlama emaili gönderildi: {email}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Email gönderme hatası: {email}");
                throw;
            }
        }

        private string CreatePasswordResetEmailHtml(string resetLink, string userName)
        {
            return $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset='utf-8'>
                    <title>Şifre Sıfırlama</title>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
                        .content {{ background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }}
                        .button {{ display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }}
                        .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
                        .warning {{ background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>🔐 Şifre Sıfırlama</h1>
                        </div>
                        <div class='content'>
                            <p>Merhaba <strong>{userName}</strong>,</p>
                            
                            <p>Hesabınız için bir şifre sıfırlama talebinde bulundunuz. Eğer bu talebi siz yapmadıysanız, bu emaili görmezden gelebilirsiniz.</p>
                            
                            <p>Şifrenizi sıfırlamak için aşağıdaki butona tıklayın:</p>
                            
                            <div style='text-align: center;'>
                                <a href='{resetLink}' class='button'>Şifremi Sıfırla</a>
                            </div>
                            
                            <div class='warning'>
                                <strong>⚠️ Önemli:</strong>
                                <ul>
                                    <li>Bu link 1 saat sonra geçersiz olacaktır</li>
                                    <li>Linki başkalarıyla paylaşmayın</li>
                                    <li>Şifrenizi güvenli bir yerde saklayın</li>
                                </ul>
                            </div>
                            
                            <p>Eğer buton çalışmıyorsa, aşağıdaki linki tarayıcınıza kopyalayabilirsiniz:</p>
                            <p style='word-break: break-all; color: #666;'>{resetLink}</p>
                        </div>
                        <div class='footer'>
                            <p>Bu email Teknoloji Mağazası tarafından gönderilmiştir.</p>
                            <p>© 2024 Teknoloji Mağazası. Tüm hakları saklıdır.</p>
                        </div>
                    </div>
                </body>
                </html>";
        }
    }
}
