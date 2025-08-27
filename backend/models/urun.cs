namespace backend.Models
{
    public class Urun
    {
        public int id { get; set; }
        public string isim { get; set; } = string.Empty;
        public string aciklama { get; set; } = string.Empty;
        public int fiyat { get; set; }
        public int stok { get; set; }
        public int kategori_id { get; set; }
        public int alt_kategori_id { get; set; }
        public string resim_url { get; set; } = string.Empty;
    }
}