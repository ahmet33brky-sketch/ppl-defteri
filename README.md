# PPL Defteri

Haftada 5 gün Push / Pull / Legs antrenman defteri. Set ve kilo takibi, plaka hesaplayıcı, ısınma setleri, gelişim grafikleri, beslenme/su/uyku/adım günlüğü, kilo tahmini, ölçü ve fotoğraf, haftalık özet, aylık meydan okumalar, rozetler ve deload hatırlatıcısı.

Sade bir statik site: derleme adımı yok. GitHub Pages üzerinden yayınlanır.

## Eşitleme (Supabase)

1. supabase.com'da ücretsiz bir proje aç.
2. SQL Editor'da `supabase-kurulum.sql` dosyasının tamamını çalıştır.
3. Authentication → URL Configuration → **Site URL** alanına sitenin adresini yaz.
4. Project Settings → API'den **Project URL** ve **anon / publishable** anahtarını `config.js` dosyasına gir.
5. Kendi hesabını oluşturduktan sonra Authentication → Sign In / Providers bölümünden yeni kayıtları kapatabilirsin.

`config.js` boş kalırsa site eşitlemesiz çalışır ve kayıtlar sadece o cihazda tutulur.

## Dosyalar

- `index.html`, `styles.css`, `app.js`: uygulama
- `config.js`: Supabase bağlantı bilgileri
- `sw.js`, `manifest.webmanifest`, ikonlar: telefona uygulama gibi ekleme ve çevrimdışı açılış
- `supabase-kurulum.sql`: veritabanı tablosu, güvenlik kuralları ve fotoğraf klasörü
