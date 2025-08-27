using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("sepet_items")]
    public class SepetItem
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("musteri_id")]
        public int MusteriId { get; set; }

        [Column("urun_id")]
        public int UrunId { get; set; }

        [Column("miktar")]
        public int Miktar { get; set; } = 1;

        [Column("eklenme_tarihi")]
        public DateTime EklenmeTarihi { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("MusteriId")]
        public virtual Musteri? Musteri { get; set; }

        [ForeignKey("UrunId")]
        public virtual Urun? Urun { get; set; }
    }
}
