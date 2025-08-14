# 🔐 Admin Panel Güvenlik

## Şifre Değiştirme

Admin panelinin varsayılan şifresi: `admin123`

### Şifreyi Değiştirmek İçin:

1. `frontend/src/app/admin/login/page.tsx` dosyasını açın
2. 15. satırdaki şu satırı bulun:
   ```typescript
   const adminPassword = 'admin123' // Bu şifreyi değiştirin!
   ```
3. `'admin123'` yerine yeni şifrenizi yazın
4. Dosyayı kaydedin

### Güvenlik Önerileri:

- **Güçlü şifre kullanın:** En az 8 karakter, büyük/küçük harf, sayı ve özel karakter
- **Şifreyi düzenli değiştirin:** Ayda bir kez şifre değiştirin
- **Şifreyi kimseyle paylaşmayın**
- **Güvenli ortamda çalışın:** Halka açık Wi-Fi'lerde admin paneline giriş yapmayın

### Oturum Süresi:

- Admin oturumu 8 saat sonra otomatik olarak sonlanır
- Bu süre `admin-protected-layout.tsx` dosyasında değiştirilebilir

### Güvenlik Özellikleri:

✅ Şifre korumalı giriş  
✅ Otomatik oturum sonlandırma  
✅ Yetkisiz erişim engelleme  
✅ Güvenli çıkış  
✅ Modern şifreleme  

### Dosya Yapısı:

```
admin/
├── login/page.tsx          # Admin giriş sayfası
├── page.tsx               # Ana admin sayfası (korumalı)
├── musteriler/page.tsx    # Müşteri yönetimi (korumalı)
└── README.md              # Bu dosya
```

### Backend Entegrasyonu:

Gerçek uygulamada admin şifresi backend'den kontrol edilmelidir. Şu anda frontend'de basit bir kontrol yapılmaktadır.

**⚠️ ÖNEMLİ:** Bu sistem sadece geliştirme amaçlıdır. Prodüksiyon ortamında backend tabanlı güvenlik sistemi kullanın!

