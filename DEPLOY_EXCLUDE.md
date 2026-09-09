# Doruk Smile — Deploy Paketine Dahil EDİLMEYECEKLER

Kaynak repoda bu dosyalar **kalır** (silinmedi). Yalnızca production'a
yüklenecek pakete kopyalanmamalıdır.

## Dışında bırak

```
.impeccable/                 # tasarım hook yapılandırması / cache
download-images.ps1          # geliştirme yardımcı betiği
download-images.sh           # geliştirme yardımcı betiği
*.md                         # SECURITY_DEPLOY.md, REDIRECT_PLAN.md, DEPLOY_EXCLUDE.md, vb.
assets/images/doruk-smile-logo.jpg   # yalnız renk referansı; sitede kullanılmıyor (bkz. Logo TODO)
assets/images/oncesi.jpg     # "yer tutucu" — gerçek vaka görseli gelene kadar deploy edilmez
assets/images/sonrasi.jpg    # "yer tutucu" — gerçek vaka görseli gelene kadar deploy edilmez
```

> `oncesi.jpg` / `sonrasi.jpg`: `/oncesi-sonrasi/` sayfasında compare bileşeni
> yorum satırına alındığı ve ana sayfa teaser'ı kaldırıldığı için bu iki dosya
> artık hiçbir sayfadan referanslanmıyor. Gerçek, onaylı vaka görselleri geldiğinde
> `CASE-before.jpg` / `CASE-after.jpg` gibi adlarla eklenip compare bileşeni tekrar
> aktive edilecek.

## Dahil et (production)

```
index.html
klinigimiz/index.html
uzman-kadro/index.html
tedaviler/index.html
oncesi-sonrasi/index.html   # "hazırlanıyor" + noindex durumunda; 404 olmaması için yüklenir
iletisim/index.html
kvkk/index.html
gizlilik/index.html
cerez-politikasi/index.html
404.html
style.css
script.js
robots.txt
sitemap.xml                 # (https://doruksmile.com.tr tabanlı, gerçek)
assets/images/hero-clinic.jpg
assets/images/klinik-lounge.jpg
assets/images/klinik-detay.jpg
assets/images/klinik-oda.jpg
assets/images/teknoloji.jpg
assets/images/surec-tedavi.jpg
assets/images/doktor-*.jpg
assets/images/*.webp         # (üretildiyse — bkz. IMAGE PERF TODO)
favicon.ico / favicon.svg    # (gerçek logo ikonu geldiğinde eklenir — şu an YOK)
```
