# Trace Tab — Gizlilik Politikası

**Son güncelleme:** [TARİH GİRİN]

Bu gizlilik politikası, "Trace Tab" Chrome uzantısının ("Uzantı") kişisel verilerinizi nasıl işlediğini açıklar. Uzantıyı kurarak veya kullanarak bu politikayı kabul etmiş olursunuz.

## 1. Kısaca özet

- Uzantının çalıştığı bir sunucumuz **yok**. Tüm veri akışı doğrudan sizin tarayıcınız ile Google, Microsoft ve Tavily'nin kendi servisleri arasında gerçekleşir; hiçbir veri bizim kontrolümüzdeki bir sunucuya uğramaz.
- E-postalarınızı **görüntülemek dışında hiçbir şey yapmayız** — silme, gönderme, yanıtlama, arşivleme gibi işlemler yapılmaz. Sadece okunmamış e-postalarınızın başlık/gönderen/tarih/kısa önizleme bilgisini okuyup özetleriz.
- API anahtarlarınız (Gemini, Tavily) ve OAuth oturum bilgileriniz yalnızca kendi tarayıcınızda (`chrome.storage.local`) saklanır, bizimle veya üçüncü bir tarafla paylaşılmaz.
- Verilerinizi satmıyoruz, reklam amacıyla kullanmıyoruz, üçüncü taraflarla pazarlama amaçlı paylaşmıyoruz.

## 2. Hangi verileri işliyoruz

### 2.1 E-posta verileri (Gmail / Outlook)

Gmail veya Outlook hesabınızı bağladığınızda, Uzantı yalnızca **okunmamış** gelen kutusu e-postalarınızdan şu bilgileri okur:

- Gönderen adı/adresi
- Tarih
- Konu
- Kısa bir içerik önizlemesi (snippet)

Bu bilgiler, e-postanın Türkçe 1-2 cümlelik bir özetini ve önem derecesini (düşük/orta/yüksek) üretmek amacıyla Google Gemini API'sine gönderilir. Üretilen özet, yalnızca sizin tarayıcınızda (`chrome.storage.local`) önbelleğe alınır ki aynı e-posta tekrar tekrar özetlenmesin. Bu önbelleği Ayarlar sayfasından istediğiniz zaman temizleyebilirsiniz.

Uzantı e-postalarınızı **silmez, göndermez, yanıtlamaz, yönlendirmez veya değiştirmez**. Sadece okuma (read-only) izni kullanılır.

E-posta kartına tıkladığınızda, ilgili e-posta veya gelen kutunuz Gmail/Outlook'un kendi web arayüzünde yeni bir sekmede açılır; bu işlem tamamen tarayıcınız üzerinden gerçekleşir.

### 2.2 Yapay zeka sohbeti (Gemini)

"Hızlı Soru" özelliğiyle yazdığınız mesajlar, yanıt üretmesi için doğrudan tarayıcınızdan Google Gemini API'sine gönderilir. Bir konuşma sırasındaki önceki mesajlarınız, bağlamı korumak amacıyla sonraki isteklerle birlikte tekrar gönderilir. Bu konuşma geçmişi yalnızca o an açık olan sekmede, tarayıcı belleğinde tutulur; sekmeyi kapattığınızda veya yeni bir sekme açtığınızda silinir, hiçbir yerde kalıcı olarak saklanmaz.

### 2.3 Web'de arama (Tavily)

"Web'de ara" seçeneğini işaretlerseniz, sorduğunuz soru güncel sonuçlar getirmesi için Tavily arama API'sine gönderilir. Bu, yalnızca siz bu seçeneği açıkça işaretlediğinizde devreye girer.

### 2.4 Yerel olarak sakladığımız veriler

Aşağıdaki bilgiler yalnızca kendi bilgisayarınızdaki `chrome.storage.local` içinde saklanır ve bizimle veya başka bir tarafla paylaşılmaz:

- Gemini ve Tavily API anahtarlarınız
- Gmail/Outlook OAuth erişim ve yenileme belirteçleri (token)
- Seçtiğiniz tema, karşılama başlığı/alt yazısı gibi görünüm tercihleri
- Daha önce özetlenmiş e-postaların önbelleği

Bu veriler yalnızca uzantıyı kaldırdığınızda veya ilgili bağlantıyı/önbelleği kendiniz temizlediğinizde silinir.

## 3. Verileri kiminle paylaşıyoruz

Verilerinizi hiçbir üçüncü tarafla pazarlama, reklam veya satış amacıyla paylaşmıyoruz. Uzantının çalışması için doğrudan aşağıdaki servislerle iletişim kurulur (her biri kendi gizlilik politikasına tabidir):

- **Google** — Gmail API (e-posta okuma), Gemini API (özetleme ve sohbet), Google OAuth (Gmail bağlantısı için kimlik doğrulama)
- **Microsoft** — Microsoft Graph API (Outlook e-posta okuma), Microsoft kimlik platformu (Outlook bağlantısı için kimlik doğrulama)
- **Tavily** — yalnızca "Web'de ara" özelliği kullanıldığında arama API'si

Bu servislere yapılan istekler doğrudan sizin tarayıcınızdan gider; bizim sunucumuz araya girmez çünkü böyle bir sunucumuz yoktur.

## 4. Google Kullanıcı Verileri Politikasına Uyum

Trace Tab'ın Google API'lerinden aldığı bilgilerin kullanımı ve başka bir uygulamaya aktarımı, [Google API Hizmetleri Kullanıcı Verileri Politikası](https://developers.google.com/terms/api-services-user-data-policy) dahil olmak üzere Sınırlı Kullanım (Limited Use) şartlarına uyar. Somut olarak:

- Gmail verileri yalnızca Bölüm 2.1'de açıklanan özetleme özelliği için kullanılır.
- Bu veriler insani incelemeye tabi tutulmaz, reklam amacıyla kullanılmaz, kredi puanlama veya borç verme amaçlı kullanılmaz.
- Veriler, açıklanan işlevsellik için gerekli olandan daha uzun süre saklanmaz (bkz. Bölüm 2.4).

## 5. Veri güvenliği

API anahtarlarınız ve oturum belirteçleriniz `chrome.storage.local` üzerinde, tarayıcı profilinize özel olarak saklanır. Outlook bağlantısı sektör standardı PKCE (Proof Key for Code Exchange) OAuth 2.0 akışı kullanır. Uzantı, hiçbir kimlik bilginizi (şifre, API anahtarı, token) bizim veya üçüncü bir tarafın sunucusuna göndermez.

## 6. Bağlantıyı kesme ve verilerinizi silme

- Gmail/Outlook bağlantısını Ayarlar sayfasından tek tıkla kesebilirsiniz; bu işlem yerel olarak saklanan oturum belirtecini siler.
- E-posta özet önbelleğini Ayarlar sayfasındaki "Önbelleği Temizle" butonuyla istediğiniz zaman silebilirsiniz.
- Uzantıyı Chrome'dan kaldırdığınızda, `chrome.storage.local` içindeki tüm veriler (API anahtarları, önbellek, tercihler, token'lar) Chrome tarafından otomatik olarak silinir.

## 7. Çocukların gizliliği

Uzantı, 13 yaş altı çocukları hedeflememektedir ve bilerek onlardan veri toplamaz.

## 8. Bu politikadaki değişiklikler

Bu politikayı zaman zaman güncelleyebiliriz. Önemli değişikliklerde bu sayfanın üst kısmındaki "Son güncelleme" tarihi değiştirilecektir.

## 9. İletişim

Bu politikayla veya Uzantı'nın veri işleme uygulamalarıyla ilgili sorularınız için: **[İLETİŞİM E-POSTASI GİRİN]**

---

*Not: Bu metin taslak olarak hazırlanmıştır. Yayınlamadan önce [TARİH GİRİN] ve [İLETİŞİM E-POSTASI GİRİN] alanlarını doldurun, ve gerçek uygulama davranışıyla (özellikle gelecekte eklenecek yeni özelliklerle) tutarlı olduğundan emin olun.*
