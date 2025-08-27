using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ProductsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // GET api/products/search?q=xxx
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(string q)
        {
            if (string.IsNullOrWhiteSpace(q))
                return BadRequest("Query parameter 'q' cannot be empty.");

            var results = await _dbContext.Urunler
                .Where(p => EF.Functions.ILike(p.isim, $"%{q}%") || EF.Functions.ILike(p.aciklama, $"%{q}%"))
                .ToListAsync();

            return Ok(results);
        }

        // GET api/products
        [HttpGet]
        public async Task<IActionResult> GetAllProducts()
        {
            var products = await _dbContext.Urunler.ToListAsync();
            return Ok(products);
        }
    }
}
