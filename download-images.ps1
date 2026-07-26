# Doruk Smile — görsel indirme betiği (Windows / PowerShell)
# --------------------------------------------------
# Hero, klinik, doktor ve teknoloji fotoğrafları artık kliniğin kendi
# gerçek görselleriyle assets\images\ klasöründe hazır geliyor.
# Bu betik sadece "Öncesi / Sonrası" bölümündeki YER TUTUCU görseller
# için var — gerçek vaka fotoğrafları elinize geçtiğinde bu betiği
# çalıştırmanıza gerek kalmayacak, o iki dosyayı doğrudan
# assets\images\oncesi.jpg ve assets\images\sonrasi.jpg olarak
# değiştirmeniz yeterli.
#
#   powershell -ExecutionPolicy Bypass -File download-images.ps1

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot
New-Item -ItemType Directory -Force -Path "assets\images" | Out-Null

Write-Host "Örnek yer tutucu görseller indiriliyor (Öncesi / Sonrası)..."
Invoke-WebRequest -Uri "https://images.pexels.com/photos/26288741/pexels-photo-26288741.jpeg?auto=compress&cs=tinysrgb&w=1600" -OutFile "assets\images\oncesi.jpg"
Invoke-WebRequest -Uri "https://images.pexels.com/photos/6627574/pexels-photo-6627574.jpeg?auto=compress&cs=tinysrgb&w=1600" -OutFile "assets\images\sonrasi.jpg"

Write-Host ""
Write-Host "Tamamlandı."
Write-Host ""
Write-Host "ÖNEMLİ: Bunlar da tasarım amaçlı örnek görsellerdir — hastaların"
Write-Host "onayıyla alınmış gerçek öncesi/sonrası fotoğraflarıyla"
Write-Host "değiştirilmeden yayına alınmamalıdır."
