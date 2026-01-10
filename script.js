document.addEventListener('DOMContentLoaded', () => {
    // Elementleri Seç
    const titleElement = document.getElementById('page-title');
    const inputArea = document.getElementById('thought-input');
    const burnBtn = document.getElementById('burn-btn');
    const fireContainer = document.getElementById('fire-container');
    const fireBase = document.querySelector('.fire-base');
    const paperContainer = document.querySelector('.paper-container');
    const ashMessage = document.getElementById('ash-message');
    const bucketBtn = document.getElementById('bucket-container');

    // Verileri data.js'den çekip yerleştir
    titleElement.textContent = siteData.title;
    inputArea.placeholder = siteData.placeholder;
    burnBtn.textContent = siteData.burnButtonText;
    ashMessage.textContent = siteData.ashMessage;

    // YAKMA FONKSİYONU
    burnBtn.addEventListener('click', () => {
        const text = inputArea.value.trim();

        if (!text) {
            alert(siteData.alertEmpty);
            return;
        }

        // 1. Yazıyı yavaşça yok et
        inputArea.style.opacity = '0';
        inputArea.disabled = true;

        // 2. Ateşi göster
        fireContainer.classList.remove('hidden');
        
        // Ateşin yükselme efekti (height arttır)
        setTimeout(() => {
            fireBase.style.height = '300px'; // Kağıt boyu kadar
        }, 100);

        // 3. Kağıdı karart (Yanma efekti)
        setTimeout(() => {
            paperContainer.classList.add('burnt-paper');
        }, 1500);

        // 4. Ateşi söndür ve külleri göster
        setTimeout(() => {
            fireBase.style.height = '0'; // Ateş alçalır
            setTimeout(() => {
                fireContainer.classList.add('hidden');
                ashMessage.classList.remove('hidden');
            }, 1000);
        }, 4000); // 4 saniye yanma sürer
    });

    // SÖNDÜRME / RESETLEME FONKSİYONU
    bucketBtn.addEventListener('click', () => {
        // Her şeyi sıfırla
        inputArea.value = '';
        inputArea.style.opacity = '1';
        inputArea.disabled = false;
        
        paperContainer.classList.remove('burnt-paper');
        fireContainer.classList.add('hidden');
        fireBase.style.height = '0';
        ashMessage.classList.add('hidden');
        
        // Su dökme efekti (basit bir titreme veya ses eklenebilir)
        // Kullanıcıya temiz bir sayfa verildiğini hissettir
        inputArea.focus();
    });
});
