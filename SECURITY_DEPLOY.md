# Doruk Smile — Production Security & Deploy Notes

> Bu dosya bir **dokümandır**. Hosting seçilmeden platforma özel config dosyası
> (netlify.toml, `_headers`, .htaccess, nginx.conf, vercel.json) **oluşturulmadı**.
> Aşağıdaki örnekler, platform belli olduğunda uygulanmak üzeredir.

---

## 1. Saldırı yüzeyi

Site tamamen **statik**:

- Backend yok, veritabanı yok, sunucu tarafı kod yok
- Login / oturum / kullanıcı hesabı yok
- Ödeme yok, dosya yükleme yok, form yok (sunucuya POST giden hiçbir şey yok)
- Çerez / localStorage / sessionStorage kullanılmıyor
- Analytics / GTM / pixel / reCAPTCHA yok
- Tek client-side JS: `script.js` (menü, akordeon, before/after, branch finder). `eval` / `new Function` / `document.write` / dinamik `innerHTML` **yok**.
- Dış kaynak: yalnızca Google Fonts (stylesheet + woff2). Görsel/JS hep `self`.
- Geolocation: yalnızca kullanıcı butona basınca; sonuç tarayıcı belleğinde; hiçbir yere yazılmıyor/gönderilmiyor.

Sonuç: **düşük risk**. Ana gereklilikler: HTTPS zorunluluğu + güvenlik başlıkları + doğru cache.

---

## 2. HTTPS

- Production'da **HTTPS zorunlu**; tüm HTTP istekleri 301 ile HTTPS'e yönlendirilmeli.
- `upgrade-insecure-requests` CSP direktifi ek koruma sağlar.

---

## 3. Önerilen HTTP güvenlik başlıkları

```
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; form-action 'self'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=(), interest-cohort=()
X-Frame-Options: DENY
Cross-Origin-Opener-Policy: same-origin
```

### CSP notları

- Kod, **`script-src 'self'` ile uyumlu** hale getirildi:
  - HTML'deki tüm `onerror` / `onclick` gibi inline handler'lar kaldırıldı.
  - `<head>` içindeki inline `<script>` (js-class) kaldırıldı; `<noscript>` içi stil de kaldırıldı. Reveal görünürlüğü, öğelerin **varsayılan görünür** olduğu transform-only ilerici geliştirme (progressive enhancement) ile sağlanıyor — JS hiç çalışmasa bile içerik görünür.
  - `'unsafe-inline'` ve `'unsafe-eval'` **gerekmiyor**.
- `style-src` içinde `'unsafe-inline'` YOK ve **gerekmiyor**: site içinde inline `<style>` bloğu kalmadı (404.html'in eski bloğu `style.css`'e taşındı; `<noscript><style>` kaldırıldı). Tek dış stil kaynağı Google Fonts → `style-src 'self' https://fonts.googleapis.com` yeterli.
- Branch finder JS'i `getCurrentPosition` çağırır; kullanıcı konumu hiçbir `fetch`/XHR ile gönderilmediği için `connect-src 'self'` yeterli. Google Fonts dışında ağ isteği yok.
- `img-src 'self' data:` — `data:` yalnızca olası küçük gömülü SVG/again için; şu an data-URI görsel yok, `'self'` de yeterli olabilir.
- Google Haritalar / WhatsApp bağlantıları yeni sekmede açıldığı için `frame-src 'none'` ve `frame-ancestors 'none'` sorun çıkarmaz (iframe kullanılmıyor).

### HSTS

```
Strict-Transport-Security: max-age=31536000
```

- **Yalnızca** production'da HTTPS sertifikası doğrulandıktan ve tüm alt yollar HTTPS'te çalıştığı teyit edildikten SONRA eklenmeli.
- `includeSubDomains` ve `preload` **otomatik eklenmedi** — alan adının tüm subdomain'lerinin HTTPS olduğu netleşmeden eklenmemeli.

---

## 4. Cache önerileri

```
# HTML — kısa / revalidate
/*.html            Cache-Control: public, max-age=0, must-revalidate
# Statik varlıklar — uzun (dosya adları değişmiyorsa deploy'da bust edin)
/assets/*          Cache-Control: public, max-age=2592000
/style.css         Cache-Control: public, max-age=86400
/script.js         Cache-Control: public, max-age=86400
```

Not: `style.css` / `script.js` sürümlenmediği için uzun cache verilecekse deploy sırasında dosya adına hash eklenmesi (ör. `style.a1b2c3.css`) önerilir. Şu an manuel.

---

## 5. Platforma özel örnekler (uygulama TODO)

### Netlify — `_headers` (repo köküne)

```
/*
  Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; form-action 'self'; upgrade-insecure-requests
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(self), camera=(), microphone=(), payment=()
  X-Frame-Options: DENY
```

`_redirects`:
```
# Kanonik host: https://doruksmile.com.tr (www YOK). www ve http tek atlamada normalize edilir.
http://doruksmile.com.tr/*        https://doruksmile.com.tr/:splat   301!
https://www.doruksmile.com.tr/*   https://doruksmile.com.tr/:splat   301!
http://www.doruksmile.com.tr/*    https://doruksmile.com.tr/:splat   301!
# (Eski URL 301'leri için REDIRECT_PLAN.md'ye bakın)
```

### Apache — `.htaccess`

```apache
<IfModule mod_headers.c>
  Header always set Content-Security-Policy "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-src 'none'; form-action 'self'; upgrade-insecure-requests"
  Header always set X-Content-Type-Options "nosniff"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "geolocation=(self), camera=(), microphone=(), payment=()"
  Header always set X-Frame-Options "DENY"
</IfModule>
ErrorDocument 404 /404.html
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}/$1 [R=301,L]
```

### Cloudflare

- SSL/TLS: **Full (strict)**
- Always Use HTTPS: **On**
- Security Headers: Transform Rules veya `_headers` (Pages) ile yukarıdaki set
- 404: Pages ise `404.html` otomatik; klasik ise Custom Error Pages

---

## 6. Deploy öncesi checklist

- [x] Kesin alan adı belirlendi — `https://doruksmile.com.tr`
- [x] Tüm indekslenebilir sayfalara `<link rel="canonical">` + `og:url` (mutlak) eklendi
- [x] `og:image` / `twitter:image` mutlak URL yapıldı — *(1200×630 özel paylaşım görseli hâlâ önerilir; şu an içerik görselleri kullanılıyor)*
- [x] `robots.txt`'ye `Sitemap: https://doruksmile.com.tr/sitemap.xml` satırı eklendi
- [x] `sitemap.xml` üretildi (mutlak URL'ler, `/oncesi-sonrasi/` hariç); `sitemap.template.xml` kaldırıldı
- [x] Branch finder: 2 şube koordinatı doğrulandı, `data-verified="true"`, buton yalnızca tıklamayla `getCurrentPosition`
- [ ] Güvenlik başlıkları hosting'de uygulandı, [securityheaders.com](https://securityheaders.com) ile doğrulandı
- [ ] CSP tarayıcı konsolunda ihlal üretmiyor (inline `<style>`/`<script>` kalmadı — beklenen: temiz)
- [ ] HTTPS zorlaması + eski URL 301'leri (REDIRECT_PLAN.md)
- [ ] HSTS (yalnız HTTPS doğrulandıktan sonra)
- [ ] `DEPLOY_EXCLUDE.md`'deki dosyalar deploy paketine dahil edilmedi
- [ ] `favicon.ico` / transparan logo ikonu eklendi (client'tan bekleniyor)
