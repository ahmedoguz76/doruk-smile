#!/usr/bin/env bash
#
# Doruk Smile — görsel indirme betiği
# --------------------------------------------------
# Hero, klinik, doktor ve teknoloji fotoğrafları artık kliniğin
# kendi gerçek görselleriyle assets/images/ klasöründe hazır geliyor.
# Bu betik sadece "Öncesi / Sonrası" bölümündeki YER TUTUCU görseller
# için var — gerçek vaka fotoğrafları elinize geçtiğinde bu betiği
# çalıştırmanıza gerek kalmayacak, o iki dosyayı doğrudan
# assets/images/oncesi.jpg ve assets/images/sonrasi.jpg olarak
# değiştirmeniz yeterli.
#
# İsterseniz yine de örnek/geçici bir görsel indirmek için:
#   chmod +x download-images.sh
#   ./download-images.sh

set -e
cd "$(dirname "$0")"
mkdir -p assets/images

echo "Örnek yer tutucu görseller indiriliyor (Öncesi / Sonrası)..."
curl -L "https://images.pexels.com/photos/26288741/pexels-photo-26288741.jpeg?auto=compress&cs=tinysrgb&w=1600" -o assets/images/oncesi.jpg
curl -L "https://images.pexels.com/photos/6627574/pexels-photo-6627574.jpeg?auto=compress&cs=tinysrgb&w=1600" -o assets/images/sonrasi.jpg

echo ""
echo "Tamamlandı."
echo ""
echo "ÖNEMLİ: Bunlar da tasarım amaçlı örnek görsellerdir — hastaların"
echo "onayıyla alınmış gerçek öncesi/sonrası fotoğraflarıyla"
echo "değiştirilmeden yayına alınmamalıdır."
