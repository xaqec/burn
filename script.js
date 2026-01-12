/* DOM Elementleri */
const burnBtn = document.getElementById('burnBtn');
const ventInput = document.getElementById('ventInput');
const fireCanvas = document.getElementById('fireCanvas');
const waterBucket = document.getElementById('waterBucket');
const parchment = document.querySelector('.parchment');

/* Canvas Ayarları */
const ctx = fireCanvas.getContext('2d');
let animationId;
let particles = [];
let isBurning = false;

// Canvas boyutlarını ayarla
function resizeCanvas() {
    fireCanvas.width = fireCanvas.offsetWidth;
    fireCanvas.height = fireCanvas.offsetHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

/* Parçacık Sınıfı (Alevler için) */
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        // Ateşin alttan başlaması için
        this.x = Math.random() * fireCanvas.width;
        this.y = fireCanvas.height;
        this.size = Math.random() * CONFIG.fire.maxSize + 10;
        this.speedY = Math.random() * CONFIG.fire.speed + 1;
        this.speedX = (Math.random() - 0.5) * 2; // Sağa sola hafif salınım
        this.life = 1; // Canlılık (1'den 0'a düşecek)
        this.decay = Math.random() * 0.02 + 0.005; // Sönme hızı
        
        // Renk paleti (Sarı -> Turuncu -> Kırmızı -> Duman)
        this.color = CONFIG.colors.fire[Math.floor(Math.random() * CONFIG.colors.fire.length)];
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.size -= 0.1;
        this.life -= this.decay;

        // Canı bitince veya çok küçülünce tekrar aşağıdan başlat (Sadece yanıyorsa)
        if (this.size <= 0 || this.life <= 0) {
            if (isBurning) {
                this.reset();
            }
        }
    }

    draw() {
        if (this.life > 0 && this.size > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.life; // Şeffaflık
            ctx.fill();
            ctx.globalAlpha = 1; // Sıfırla
        }
    }
}

/* Ateş Efekti Başlatma */
function startFire() {
    isBurning = true;
    particles = [];
    
    // Parçacık havuzunu oluştur
    for (let i = 0; i < CONFIG.fire.particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        if (!isBurning && particles.every(p => p.life <= 0)) {
            ctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
            cancelAnimationFrame(animationId);
            return;
        }

        ctx.clearRect(0, 0, fireCanvas.width, fireCanvas.height);
        
        // "Additive Blending" efekti ateşi daha parlak yapar
        ctx.globalCompositeOperation = 'screen'; 

        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        ctx.globalCompositeOperation = 'source-over'; // Normal moda dön

        animationId = requestAnimationFrame(animate);
    }
    animate();
}

/* Buton Etkileşimi */
burnBtn.addEventListener('click', () => {
    if (ventInput.value.trim() === "") {
        alert(CONFIG.messages.empty);
        return;
    }

    // Arayüz değişiklikleri
    isBurning = true;
    fireCanvas.style.opacity = "1";
    parchment.classList.add('shaking'); // Sallanma efekti
    
    // Yazıyı yavaşça kaybet
    ventInput.style.transition = "opacity 3s ease";
    ventInput.style.opacity = "0";
    
    // Butonu pasif yap
    burnBtn.disabled = true;
    burnBtn.style.opacity = "0.5";
    burnBtn.innerText = "YANIYOR...";

    // Kovayı aktif et
    waterBucket.classList.add('active');

    startFire();
});

/* Söndürme Etkileşimi */
waterBucket.addEventListener('click', () => {
    if (!isBurning) return;

    // Söndürme işlemi
    isBurning = false;
    
    // UI Reset
    fireCanvas.style.opacity = "0";
    parchment.classList.remove('shaking');
    ventInput.style.transition = "opacity 1s ease";
    ventInput.style.opacity = "1";
    ventInput.value = ""; // Yazıyı temizle
    ventInput.placeholder = "Küllerinden yeniden doğdun. Sıradaki?";

    burnBtn.disabled = false;
    burnBtn.style.opacity = "1";
    burnBtn.innerText = "🔥 YAK GİTSİN 🔥";

    waterBucket.classList.remove('active');
    
    // Kısmi canvas temizliği (efekt hemen kaybolmasın, sönerek gitsin diye loop hallediyor)
});
