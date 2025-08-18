using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CommentsController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<CommentsController> _logger;

        public CommentsController(AppDbContext context, ILogger<CommentsController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/comments?productId=1
        [HttpGet]
        public async Task<IActionResult> GetComments([FromQuery] int productId)
        {
            try
            {
                var comments = await _context.Comments
                    .Where(c => c.ProductId == productId)
                    .Include(c => c.User)
                    .OrderByDescending(c => c.CreatedAt)
                    .Select(c => new
                    {
                        id = c.Id,
                        productId = c.ProductId,
                        userId = c.UserId,
                        userName = $"{c.User.Ad} {c.User.Soyad}",
                        rating = c.Rating,
                        body = c.Body,
                        createdAt = c.CreatedAt
                    })
                    .ToListAsync();

                _logger.LogInformation($"{comments.Count} yorum getirildi. ProductId: {productId}");
                return Ok(comments);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum getirme hatası. ProductId: {ProductId}", productId);
                return StatusCode(500, "Internal Server Error");
            }
        }

        // POST: api/comments
        [HttpPost]
        // [Authorize] // Geçici olarak kaldırıldı test için
        public async Task<IActionResult> CreateComment([FromBody] CommentRequest commentRequest)
        {
            try
            {
                // Kullanıcı ID'sini al
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                int userId = 1; // Geçici olarak sabit kullanıcı ID'si test için
                if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int authUserId))
                {
                    userId = authUserId;
                }

                // Ürünün var olup olmadığını kontrol et
                var product = await _context.Urunler.FindAsync(commentRequest.ProductId);
                if (product == null)
                {
                    return BadRequest("Ürün bulunamadı");
                }

                // Kullanıcının var olup olmadığını kontrol et
                var user = await _context.Musteriler.FindAsync(userId);
                if (user == null)
                {
                    return BadRequest("Kullanıcı bulunamadı");
                }

                // Rating değerini kontrol et (1-5 arası)
                if (commentRequest.Rating < 1 || commentRequest.Rating > 5)
                {
                    return BadRequest("Rating 1-5 arasında olmalıdır");
                }

                // Yorum metnini kontrol et
                if (string.IsNullOrWhiteSpace(commentRequest.Body))
                {
                    return BadRequest("Yorum metni boş olamaz");
                }

                var comment = new Comment
                {
                    ProductId = commentRequest.ProductId,
                    UserId = userId,
                    Rating = commentRequest.Rating,
                    Body = commentRequest.Body.Trim(),
                    CreatedAt = DateTime.UtcNow
                };

                _context.Comments.Add(comment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Yeni yorum eklendi. CommentId: {CommentId}, ProductId: {ProductId}, UserId: {UserId}", 
                    comment.Id, comment.ProductId, comment.UserId);

                return CreatedAtAction(nameof(GetComments), new { productId = comment.ProductId }, new
                {
                    id = comment.Id,
                    productId = comment.ProductId,
                    userId = comment.UserId,
                    userName = $"{user.Ad} {user.Soyad}",
                    rating = comment.Rating,
                    body = comment.Body,
                    createdAt = comment.CreatedAt
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum ekleme hatası");
                return StatusCode(500, "Internal Server Error");
            }
        }

        // DELETE: api/comments/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteComment(int id)
        {
            try
            {
                var comment = await _context.Comments.FindAsync(id);
                if (comment == null)
                {
                    return NotFound("Yorum bulunamadı");
                }

                // Kullanıcı ID'sini al
                var userIdClaim = HttpContext.User.FindFirst("UserId");
                if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out int userId))
                {
                    return Unauthorized("Kullanıcı kimliği bulunamadı");
                }

                // Sadece yorumu yazan kişi silebilir
                if (comment.UserId != userId)
                {
                    return Forbid("Bu yorumu silme yetkiniz yok");
                }

                _context.Comments.Remove(comment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Yorum silindi. CommentId: {CommentId}, UserId: {UserId}", id, userId);
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum silme hatası. CommentId: {CommentId}", id);
                return StatusCode(500, "Internal Server Error");
            }
        }

        // GET: api/comments/stats?productId=1
        [HttpGet("stats")]
        public async Task<IActionResult> GetCommentStats([FromQuery] int productId)
        {
            try
            {
                var stats = await _context.Comments
                    .Where(c => c.ProductId == productId)
                    .GroupBy(c => c.ProductId)
                    .Select(g => new
                    {
                        productId = g.Key,
                        totalComments = g.Count(),
                        averageRating = g.Average(c => c.Rating),
                        ratingDistribution = new
                        {
                            oneStar = g.Count(c => c.Rating == 1),
                            twoStar = g.Count(c => c.Rating == 2),
                            threeStar = g.Count(c => c.Rating == 3),
                            fourStar = g.Count(c => c.Rating == 4),
                            fiveStar = g.Count(c => c.Rating == 5)
                        }
                    })
                    .FirstOrDefaultAsync();

                if (stats == null)
                {
                    return Ok(new
                    {
                        productId,
                        totalComments = 0,
                        averageRating = 0.0,
                        ratingDistribution = new
                        {
                            oneStar = 0,
                            twoStar = 0,
                            threeStar = 0,
                            fourStar = 0,
                            fiveStar = 0
                        }
                    });
                }

                return Ok(stats);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Yorum istatistikleri getirme hatası. ProductId: {ProductId}", productId);
                return StatusCode(500, "Internal Server Error");
            }
        }
    }
}
