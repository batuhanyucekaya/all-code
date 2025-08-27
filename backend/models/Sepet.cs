using System.ComponentModel.DataAnnotations;

namespace backend.Models
{
    public class Sepet
    {
        public int Id { get; set; }
        
        [Required]
        public int MusteriId { get; set; }
        
        public DateTime SiparisTarihi { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Musteri Musteri { get; set; } = null!;
    }
}
