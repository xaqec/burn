document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('page-title');
    const inputArea = document.getElementById('thought-input');
    const burnBtn = document.getElementById('burn-btn');
    const fireContainer = document.getElementById('fire-container');
    const parchment = document.getElementById('parchment');
    const bucketBtn = document.getElementById('bucket-container');
    const bucketWater = document.getElementById('bucket-water');
    const bucketLabel = document.querySelector('.bucket-label');

    // Verileri yerleştir
    titleElement.textContent = siteData.title;
    inputArea.placeholder = siteData.placeholder;
    burnBtn.textContent = siteData.burnButtonText;
    bucketBtn.title = siteData.bucketTitle;

    let isBurning = false;

    // --- YAKMA İŞLEMİ ---
    burnBtn.addEventListener('click', () => {
        const text = inputArea.value.trim();

        if (!text) {
            alert(siteData.alertEmpty);
            return;
        }
        
        if (isBurning) return; // Zaten yanıyorsa tekrar basmayı engelle

        isBurning = true;
        
        // 1. Yazıyı ve alanı kilitle
        inputArea.style.opacity = '0';
        inputArea.disabled = true;
        burnBtn.disabled = true;
        burnBtn.style.opacity = '0.5';
        burnBtn.textContent = "YANİYOR...";
        bucketLabel.textContent = "SÖNDÜR!";

        // 2. Ateşi başlat (SONSUZA KADAR)
        fireContainer.classList.remove('hidden');
        // Parşömene kararma efekti ekle
        parchment.classList.add('burning');

        // Kova görselini hazırla (içine su koy)
        bucketWater.classList.remove('hidden');
    });

    // --- SÖNDÜRME İŞLEMİ (RESET) ---
    bucketBtn.addEventListener('click', () => {
        if (!isBurning) return; // Yanmıyorsa söndürme yapma

        // Söndürme efekti (Kovadaki su boşalsın)
        bucketWater.style.height = '0';

        setTimeout(() => {
            // Her şeyi sıfırla
            inputArea.value = '';
            inputArea.style.opacity = '1';
            inputArea.disabled = false;
            
            burnBtn.disabled = false;
            burnBtn.style.opacity = '1';
            burnBtn.textContent = siteData.burnButtonText;

            fireContainer.classList.add('hidden');
            parchment.classList.remove('burning');
            
            bucketWater.classList.add('hidden');
            bucketWater.style.height = '80%'; // Suyu bir sonraki sefer için doldur
            bucketLabel.textContent = "SÖNDÜR";
            
            isBurning = false;
            inputArea.focus();
        }, 500); // Su boşalma animasyonu bitince resetle
    });
});
