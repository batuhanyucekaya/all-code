using Microsoft.AspNetCore.Mvc;
using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SetupController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<SetupController> _logger;

        public SetupController(AppDbContext context, ILogger<SetupController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("create-password-reset-table")]
        public async Task<IActionResult> CreatePasswordResetTable()
        {
            try
            {
                var sql = @"
                    CREATE TABLE IF NOT EXISTS password_reset_tokens (
                        id SERIAL PRIMARY KEY,
                        musteri_id INTEGER NOT NULL,
                        token VARCHAR(255) NOT NULL UNIQUE,
                        expires_at TIMESTAMP NOT NULL,
                        is_used BOOLEAN DEFAULT FALSE,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_password_reset_tokens_musteri 
                            FOREIGN KEY (musteri_id) 
                            REFERENCES musteri(id) 
                            ON DELETE CASCADE
                    );

                    CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_token ON password_reset_tokens(token);
                    CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_musteri_id ON password_reset_tokens(musteri_id);
                    CREATE INDEX IF NOT EXISTS ix_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);
                ";

                await _context.Database.ExecuteSqlRawAsync(sql);
                
                _logger.LogInformation("Password reset tokens tablosu başarıyla oluşturuldu");
                return Ok(new { message = "Password reset tokens tablosu başarıyla oluşturuldu" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Tablo oluşturma hatası");
                return StatusCode(500, new { message = "Tablo oluşturma hatası: " + ex.Message });
            }
        }
    }
}
