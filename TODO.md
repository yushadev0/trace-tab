# TODO

## Arayüz tasarımı

- [x] Tema mimarisi: ThemeContext + chrome.storage'da kalıcı tercih, CSS değişken sistemi
- [x] Koyu tema (antrasit, varsayılan) ve açık tema (kemik rengi)
- [x] Formula 1 teması (amiral gemisi): karbon fiber doku, damalı bayrak şeridi, kesik köşe paneller, yarış kırmızısı
- [x] Sağ köşede yüzen tema anahtarı (Font Awesome: ay/güneş/damalı bayrak)
- [x] Gelen Kutusu paneli: yeni e-posta yoksa tamamen gizli, geldiğinde animasyonlu (genişleme + kart stagger) açılıyor
- [x] Karşılama başlığı/alt yazısı ayarlar sayfasından özelleştirilebilir ("Merhaba, Yuşa" / "Daddy's Home?..."), gradyanlı başlık
- [x] Gerçek sohbet arayüzü: konuşma balonları, markdown render (react-markdown + remark-gfm), çok turlu hafıza (Gemini'ye geçmiş geçiliyor)
- [x] "Chat mode": ilk mesajda kart tam ekrana yayılıyor, e-posta paneli/karşılama gizleniyor (çıkış kontrolü yok, kalıcı — bkz. aşağıdaki kaldırma maddesi)
- [x] Tüm newtab butonları ikonlu (Font Awesome): yenile, gönder
- [x] E-posta önbelleği: daha önce özetlenmiş e-postalar (id bazlı, chrome.storage.local) tekrar Gemini'ye gönderilmiyor
- [x] Chat mode'daki "ana sayfa" / "yeni sohbet" ikonları kaldırıldı (gereksiz görüldü)
- [x] E-posta özetleme artık sadece okunmamış (UNREAD) e-postaları getiriyor — okunmuş e-postalar hiç analiz edilmiyor
- [x] E-posta kartında gönderici adı kendi satırında (badge/tarih altta), sığmazsa hover tooltip ile tam ad gösteriliyor
- [x] Minecraft teması: blok bevel çerçeveler, piksel doku, çim/toprak şerit, Press Start 2P/VT323 fontları
- [x] Factorio teması: perçinli metal paneller, tehlike şeridi, konveyör turuncusu, Oxanium/Share Tech Mono fontları
- [x] Messi/Futbol teması: stadyum çim şeritleri, orta saha çizgisi motifi, Arjantin mavisi + altın, Bebas Neue/Barlow fontları
- [x] Yüzen sürüklenebilir tema anahtarı newtab'dan kaldırıldı, yerine Ayarlar sayfasında tema kartları ızgarası geldi (her kart kendi temasını canlı önizliyor)
- [x] Tema modülü (`theme.css`, `ThemeContext`, `themes.ts`) `src/shared/theme/`'e taşındı; hem newtab hem options aynı temaları kullanıyor
- [x] Ayarlar sayfası tamamen yeniden tasarlandı: temalı panel/inputlar, bölümlere ayrılmış (Görünüm/Yapay Zeka/Gmail), ikonlu butonlar
- [x] Gemini/Tavily API key alanlarına göster/gizle (göz ikonu) butonu eklendi
- [ ] Genel responsive/dar ekran davranışı
- [ ] Web'de ara (grounded) kaynaklarının çok turlu sohbette geçmişe eklenip eklenmeyeceğini gözden geçir
