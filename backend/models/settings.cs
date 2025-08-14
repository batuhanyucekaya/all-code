using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    [Table("musteri_ayarlar")]
    public class MusteriAyarlar
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        
        [Column("email")]
        public bool Email { get; set; }

       
        [Column("sms")]
        public bool Sms { get; set; }

       
        [Column("push")]
        public bool Push { get; set; }

      
        [Column("profil_gorunurlugu")]
        public bool ProfilGorunurlugu { get; set; }

       
        [Column("siparis_gecmisi_paylasimi")]
        public bool SiparisGecmisiPaylasimi { get; set; }

     
        [Column("degerlendirme_paylasimi")]
        public bool DegerlendirmePaylasimi { get; set; }

        [Column("created_at")]
        public DateTime? CreatedAt { get; set; }

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
