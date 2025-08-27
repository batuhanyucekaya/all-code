using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("musteri_ayarlari")]
    public class MusteriAyarlari
    {
        [Key]
        [Column("musteri_id")]
        public int MusteriId { get; set; }

        [Column("email_bildirimleri")]
        public bool EmailBildirimleri { get; set; } = true;

        [Column("sms_bildirimleri")]
        public bool SmsBildirimleri { get; set; } = false;

        [Column("push_bildirimleri")]
        public bool PushBildirimleri { get; set; } = true;

        [Column("profil_gorunurlugu")]
        public bool ProfilGorunurlugu { get; set; } = true;

        [Column("siparis_gecmisi_paylasimi")]
        public bool SiparisGecmisiPaylasimi { get; set; } = false;

        [Column("degerlendirme_paylasimi")]
        public bool DegerlendirmePaylasimi { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        public virtual Musteri? Musteri { get; set; }
    }
}
