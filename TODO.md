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
- [x] Ayarlar sayfası tamamen yeniden tasarlandı: temalı panel/inputlar, bölümlere ayrılmış (Görünüm/Yapay Zeka/E-posta bağlantıları), ikonlu butonlar
- [x] Gemini/Tavily API key alanlarına göster/gizle (göz ikonu) butonu eklendi
- [x] Outlook bağlantısı eklendi (Microsoft Graph, PKCE OAuth ile `chrome.identity.launchWebAuthFlow`)
- [x] E-posta kartlarında sağlayıcı ikonu (Gmail/Outlook) gösteriliyor; her iki hesap da bağlıysa özetler tarihe göre birleştirilip en yeni 10 tanesi gösteriliyor
- [x] "Gönderici" alanı artık her zaman ham e-posta başlığından geliyor (Gemini'nin yeniden biçimlendirmesine güvenilmiyor) — bazı kartlarda adres eksik kalma sorunu giderildi
- [x] Outlook OAuth "Bağlan" butonundaki form-submit yarış durumu ve Azure kurulum sorunları (userAudience, client_secret, cross-origin token redemption) çözüldü — Outlook bağlantısı uçtan uca çalışıyor
- [x] E-posta kartındaki sağlayıcı ikonunun üzerine gelince artık bağlı hesabın adresi de gösteriliyor (`Gmail — adres@ornek.com`); çoklu hesap desteğine hazır altyapı (`accountEmail` alanı) eklendi
- [x] E-posta özetleme artık tek seferlik toplu istek yerine e-posta başına işleniyor; bu sayede gerçek bir ilerleme çubuğu (kaç/kaç özetlendi) gösterilebiliyor. Panel henüz kapalıyken (ilk yükleme) bu çubuk chat girişinin altında beliriyor
- [x] Ayarlar sayfasına "Önbelleği Temizle" butonu eklendi (şema değişince eski kayıtları tek tıkla sıfırlamak için)
- [x] E-posta kartına tıklayınca yeni sekmede açılıyor: Gmail'de mesaj ID'siyle doğrudan o e-posta; Outlook'ta genel gelen kutusu (mesaja özel 3 URL kalıbı denendi, kişisel outlook.live.com hesaplarında Graph id'si OWA'nın kendi id şemasıyla örtüşmediği için güvenilir çalışmadı — kullanıcıyla karar verilen bilinçli ödünleşim)
- [x] Tüm sayfalarda (newtab + options) scroll bar'lar artık temaya uyumlu (Minecraft'ta köşeli, diğerlerinde yuvarlak, hover'da aksan rengi)
- [x] Scroll bar ile kartlar/balonlar arasına boşluk eklendi (dip dibe duruyordu)
- [x] Outlook artık Gmail gibi paylaşılan/gömülü bir Azure Client ID kullanıyor — kullanıcıların artık kendi Azure App Registration'larını oluşturmasına gerek yok, tek tıkla bağlanıyorlar
- [ ] Genel responsive/dar ekran davranışı
- [ ] Web'de ara (grounded) kaynaklarının çok turlu sohbette geçmişe eklenip eklenmeyeceğini gözden geçir

## Chrome Web Store yayın hazırlığı

- [x] Gizlilik politikası taslağı yazıldı (`docs/privacy-policy.md`) — tarih/iletişim alanları doldurulup kullanıcının kendi sitesinde yayınlanmayı bekliyor
- [x] Uzantı ikonları: `assets/icon.svg` master (indigo kare + 4 köşeli AI kıvılcımı, düz/minimal), `npm run icons` (sharp) ile `public/icons/icon-{16,32,48,128}.png` üretiliyor; `manifest.ts`'e `icons` + `action.default_icon` eklendi. 128'lik dosya mağaza ikonu olarak da kullanılabilir; promosyon görselleri hâlâ eksik (aşağıdaki mağaza listesi maddesi)
- [ ] Google OAuth consent screen'i "sensitive scope" doğrulamasına gönder: gizlilik politikası linki, marka bilgileri, kısa demo video, Search Console alan adı doğrulaması (CASA gerekmiyor — `gmail.readonly` restricted değil sensitive kapsam)
- [ ] Mağazaya yayınlanınca uzantı ID'si değişecek — Azure'daki Outlook uygulamasının yönlendirme URI'sini yeni ID'ye göre bir kereliğine güncelle
- [ ] Mağaza listesi materyalleri: ekran görüntüleri, kısa/detaylı açıklama, kategori, promosyon görseli
