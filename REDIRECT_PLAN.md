# Doruk Smile — Eski Site → Yeni Site 301 Yönlendirme Planı

> **Domain:** `https://doruksmile.com.tr` (yeni site aynı alan adına alınacaktır).
> Yeni site, mevcut canlı sitesinden **farklı bir URL yapısı** kullanır. Canlı siteye
> dokunulmadı. Eski URL'lerin SEO değerini korumak için aşağıdaki **301 (kalıcı)**
> yönlendirmeler, yeni site yayına alınırken hosting katmanında uygulanmalıdır.
>
> Kural: **Her eski URL, en alakalı yeni sayfaya** gider. Toplu "hepsi anasayfaya"
> yönlendirme YAPILMAZ. Tag/arama URL'leri de kör şekilde anasayfaya gönderilmez.
>
> **Bu aşamada gerçek hosting redirect config'i UYGULANMADI** — yalnızca plan.

## 1. Doğrulanmış eski URL'ler (canlı site + arama sonuçları)

| Eski URL (path) | Yeni hedef | Tip | Not |
|---|---|---|---|
| `/` | `/` | — | aynı |
| `/iletisim/` | `/iletisim/` | — | aynı path, içerik yenilendi |
| `/kadromuz/` | `/uzman-kadro/` | 301 | |
| `/kadromuz/1014/dt-caner-okan-aktas` | `/uzman-kadro/#caner-okan-aktas` | 301 | doktor yeni sitede var |
| `/kadromuz/1015/dt-hasan-demiryurek` | `/uzman-kadro/#hasan-demiryurek` | 301 | doktor yeni sitede var |
| `/kadromuz/1016/uzm-dt-okan-duran` *(varsa)* | `/uzman-kadro/#okan-duran` | 301 | |
| `/kadromuz/1012/dt-alpay-turkan` *(varsa)* | `/uzman-kadro/#alpay-turkan` | 301 | |
| `/kadromuz/*/dt-ozge-ertunc` *(varsa)* | `/uzman-kadro/#ozge-ertunc` | 301 | |
| `/kadromuz/*/dt-bilge-nur-sahin` *(varsa)* | `/uzman-kadro/#bilge-nur-sahin` | 301 | |
| `/kadromuz/<id>/<slug>` (yeni sitede **olmayan** doktor) | `/uzman-kadro/` | 301 | sahte anchor oluşturulmaz |
| `/kadromuz/*` (diğer) | `/uzman-kadro/` | 301 | |
| `/hakkimizda/` *(varsa)* | `/klinigimiz/` | 301 | |

## 2. Tedavi URL'leri → `/tedaviler/#tedavi-N`

Yeni sitede tek sayfa akordeon; `#tedavi-N` ilgili başlığı açar (script.js hash-open).

| Eski URL (path) | Yeni hedef | Tedavi |
|---|---|---|
| `/estetik-dis-hekimligi/` | `/tedaviler/#tedavi-1` | Estetik Diş Hekimliği |
| `/agiz-dis-ve-cene-cerrahisi/` *(varsa)* | `/tedaviler/#tedavi-2` | Ağız, Diş ve Çene Cerrahisi |
| `/implant*/` *(varsa)* | `/tedaviler/#tedavi-2` | (cerrahi başlığı altında) |
| `/protez-dis-tedavisi/` *(varsa)* | `/tedaviler/#tedavi-3` | Protez |
| `/periodontoloji*/` / `/dis-eti-tedavisi/` *(varsa)* | `/tedaviler/#tedavi-4` | Periodontoloji |
| `/restoratif-dis-tedavisi/` / `/dolgu/` *(varsa)* | `/tedaviler/#tedavi-5` | Restoratif |
| `/pedodonti-cocuk-dis-hekimligi/1009/pedodonti-` | `/tedaviler/#tedavi-6` | Pedodonti (Çocuk) |
| `/pedodonti*/` (diğer) | `/tedaviler/#tedavi-6` | |
| `/endodonti*/` / `/kanal-tedavisi/` *(varsa)* | `/tedaviler/#tedavi-7` | Endodonti |
| `/ortodonti-dis-teli-tedavisi/` | `/tedaviler/#tedavi-8` | Ortodonti |
| diğer tüm `/*-tedavisi/`, `/*-hekimligi/` | `/tedaviler/` | (klasör bazlı güvenli hedef) |

> **Anchor uyarısı:** Sunucu 301'i `#...` fragment'ını taşımaz; fragment tarayıcıda
> korunur. Klasör hedefi (`/tedaviler/`) her durumda güvenli; `#tedavi-N` yalnızca UX.

## 3. Tag / arama URL'leri

Eski sitede `/tags/<etiket>` biçimli URL'ler var. **Anasayfaya kör yönlendirme YOK.**
Etiket adına göre eşleme (öncelik sırası):

| Etiket örüntüsü | Yeni hedef |
|---|---|
| `/tags/*estetik*`, `/tags/*gulus*`, `/tags/*beyazlat*` | `/tedaviler/#tedavi-1` |
| `/tags/*implant*`, `/tags/*cerrah*`, `/tags/*yirmilik*`, `/tags/*20-yas*` | `/tedaviler/#tedavi-2` |
| `/tags/*protez*` | `/tedaviler/#tedavi-3` |
| `/tags/*dis-eti*`, `/tags/*periodont*` | `/tedaviler/#tedavi-4` |
| `/tags/*dolgu*`, `/tags/*restoratif*` | `/tedaviler/#tedavi-5` |
| `/tags/*cocuk*`, `/tags/*pedodonti*` | `/tedaviler/#tedavi-6` |
| `/tags/*kanal*`, `/tags/*endodonti*` | `/tedaviler/#tedavi-7` |
| `/tags/*ortodonti*`, `/tags/*dis-teli*`, `/tags/*seffaf-plak*` | `/tedaviler/#tedavi-8` |
| `/tags/*hekim*`, `/tags/*kadro*`, `/tags/*doktor*` | `/uzman-kadro/` |
| `/tags/*` (eşleşmeyen) | `/tedaviler/` |

## 4. Uygulama örnekleri (deploy'da uygulanacak — şu an DEVRE DIŞI)

### Apache `.htaccess`
```apache
RewriteEngine On
RewriteRule ^hakkimizda/?$                         /klinigimiz/                  [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*caner-okan-aktas/?$ /uzman-kadro/#caner-okan-aktas [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*hasan-demiryurek/?$ /uzman-kadro/#hasan-demiryurek [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*okan-duran/?$       /uzman-kadro/#okan-duran      [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*alpay-turkan/?$     /uzman-kadro/#alpay-turkan    [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*ozge-ertunc/?$      /uzman-kadro/#ozge-ertunc     [R=301,L]
RewriteRule ^kadromuz/[0-9]+/.*bilge-nur-sahin/?$  /uzman-kadro/#bilge-nur-sahin [R=301,L]
RewriteRule ^kadromuz(/.*)?$                       /uzman-kadro/                 [R=301,L]

RewriteRule ^estetik-dis-hekimligi/?$              /tedaviler/                   [R=301,L]
RewriteRule ^ortodonti-dis-teli-tedavisi/?$        /tedaviler/                   [R=301,L]
RewriteRule ^pedodonti-cocuk-dis-hekimligi(/.*)?$  /tedaviler/                   [R=301,L]
RewriteRule ^(.+)-(tedavisi|hekimligi)/?$          /tedaviler/                   [R=301,L]

RewriteRule ^tags/.*(estetik|gulus|beyazlat).*$    /tedaviler/                   [R=301,L]
RewriteRule ^tags/.*(implant|cerrah|yirmilik).*$   /tedaviler/                   [R=301,L]
RewriteRule ^tags/.*(ortodonti|dis-teli|plak).*$   /tedaviler/                   [R=301,L]
RewriteRule ^tags/.*(cocuk|pedodonti).*$           /tedaviler/                   [R=301,L]
RewriteRule ^tags/.*(kanal|endodonti).*$           /tedaviler/                   [R=301,L]
RewriteRule ^tags/.*(hekim|kadro|doktor).*$        /uzman-kadro/                 [R=301,L]
RewriteRule ^tags(/.*)?$                           /tedaviler/                   [R=301,L]
```

### Netlify `_redirects`
```
/hakkimizda/*                          /klinigimiz/                    301
/kadromuz/*caner-okan-aktas*           /uzman-kadro/#caner-okan-aktas  301
/kadromuz/*hasan-demiryurek*           /uzman-kadro/#hasan-demiryurek  301
/kadromuz/*okan-duran*                 /uzman-kadro/#okan-duran        301
/kadromuz/*alpay-turkan*               /uzman-kadro/#alpay-turkan      301
/kadromuz/*ozge-ertunc*                /uzman-kadro/#ozge-ertunc       301
/kadromuz/*bilge-nur-sahin*            /uzman-kadro/#bilge-nur-sahin   301
/kadromuz/*                            /uzman-kadro/                   301
/estetik-dis-hekimligi/*               /tedaviler/                     301
/ortodonti-dis-teli-tedavisi/*         /tedaviler/                     301
/pedodonti-cocuk-dis-hekimligi/*       /tedaviler/                     301
/tags/*                                /tedaviler/                     301
```
> Netlify `_redirects` glob dilinde etiket-bazlı ince eşleme sınırlıdır; kelime bazlı
> ayrım gereken durumlarda Apache/nginx örneği veya `netlify.toml` `[[redirects]]`
> koşulları kullanılmalıdır.

## 5. Yapılacaklar (client / geliştirici)

- [ ] Canlı siteden **tam URL envanteri** çıkar (eski `sitemap.xml` veya Search Console "Sayfalar").
- [ ] Yukarıdaki *(varsa)* işaretli satırları gerçek URL'lerle netleştir; eşleşmeyen tag'leri tara.
- [ ] **BLOCKER — Kadro farkı:** Eski sitede **8 diş hekimi** görülüyor, yeni sitede **6**.
      Eksik 2 hekimin yeni sitede yer alıp almayacağı client'tan teyit edilecek. Eksik
      hekim varsa eski doktor detay URL'leri `/uzman-kadro/` köküne 301'lenir (sahte
      anchor **oluşturulmaz**). Hekimler eklenecekse önce içerik, sonra anchor 301.
- [ ] Yeni site yayına alındıktan sonra Search Console'a yeni `sitemap.xml` gönder.
- [ ] Custom 404 (`/404.html`) hosting'de `ErrorDocument`/Pages ayarıyla aktive edildi mi kontrol et.
- [ ] Yönlendirmeleri canlıya almadan `curl -I` ile 301 zinciri (tek atlama) doğrula.
