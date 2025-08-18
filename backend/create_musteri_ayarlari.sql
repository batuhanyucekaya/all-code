-- Musteri ayarları tablosu oluşturma
CREATE TABLE IF NOT EXISTS musteri_ayarlari (
    musteri_id INTEGER PRIMARY KEY,
    email_bildirimleri BOOLEAN DEFAULT true,
    sms_bildirimleri BOOLEAN DEFAULT false,
    push_bildirimleri BOOLEAN DEFAULT true,
    profil_gorunurlugu BOOLEAN DEFAULT true,
    siparis_gecmisi_paylasimi BOOLEAN DEFAULT false,
    degerlendirme_paylasimi BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (musteri_id) REFERENCES musteri(id) ON DELETE CASCADE
);

-- Mevcut kayıtları temizle (eğer varsa)
DELETE FROM musteri_ayarlari WHERE musteri_id = 1;

-- Test verisi ekleme (musteri_id = 1 için)
INSERT INTO musteri_ayarlari (musteri_id, email_bildirimleri, sms_bildirimleri, push_bildirimleri, profil_gorunurlugu, siparis_gecmisi_paylasimi, degerlendirme_paylasimi)
VALUES (1, true, false, true, true, false, true);
