/* ========================================
   Bırak Gitsin — script.js
   ======================================== */

/* DOM Elementleri */
const burnBtn = document.getElementById('burnBtn');
const btnText = document.getElementById('btnText');
const extinguishBtn = document.getElementById('extinguishBtn');
const ventInput = document.getElementById('ventInput');
const fireCanvas = document.getElementById('fireCanvas');
const ambientCanvas = document.getElementById('ambientCanvas');
const mainCard = document.getElementById('mainCard');
const charCount = document.getElementById('charCount');
const footerMsg = document.getElementById('footerMsg');

/* Canvas Ayarları */
const fireCtx = fireCanvas.getContext('2d');
const ambientCtx = ambientCanvas.getContext('2d');

let fireAnimationId;
let ambientAnimationId;
let fireParticles = [];
let emberParticles = [];
let debrisParticles = [];
let isBurning = false;

/* ========================================
   Canvas Boyutlandırma
   ======================================== */
function resizeFireCanvas() {
    fireCanvas.width = fireCanvas.offsetWidth * window.devicePixelRatio;
    fireCanvas.height = fireCanvas.offsetHeight * window.devicePixelRatio;
    fireCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
}

function resizeAmbientCanvas() {
    ambientCanvas.width = window.innerWidth;
    ambientCanvas.height = window.innerHeight;
}

window.addEventListener('resize', () => {
    resizeFireCanvas();
    resizeAmbientCanvas();
});
resizeFireCanvas();
resizeAmbientCanvas();

/* ========================================
   Ambient Arka Plan Parçacıkları
   ======================================== */
class AmbientParticle {
    constructor() {
        this.x = Math.random() * ambientCanvas.width;
        this.y = Math.random() * ambientCanvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.15;
        this.speedY = (Math.random() - 0.5) * 0.15;
        this.opacity = Math.random() * 0.15 + 0.03;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = Math.random() * 0.01 + 0.005;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += this.pulseSpeed;

        // Ekran dışına çıkınca sar
        if (this.x < 0) this.x = ambientCanvas.width;
        if (this.x > ambientCanvas.width) this.x = 0;
        if (this.y < 0) this.y = ambientCanvas.height;
        if (this.y > ambientCanvas.height) this.y = 0;
    }

    draw() {
        const alpha = this.opacity + Math.sin(this.pulse) * 0.04;
        ambientCtx.beginPath();
        ambientCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ambientCtx.fillStyle = `rgba(180, 170, 220, ${Math.max(0, alpha)})`;
        ambientCtx.fill();
    }
}

const ambientParticles = [];
for (let i = 0; i < 80; i++) {
    ambientParticles.push(new AmbientParticle());
}

function animateAmbient() {
    ambientCtx.clearRect(0, 0, ambientCanvas.width, ambientCanvas.height);
    ambientParticles.forEach(p => {
        p.update();
        p.draw();
    });
    ambientAnimationId = requestAnimationFrame(animateAmbient);
}
animateAmbient();

/* ========================================
   Ateş Parçacık Sınıfı
   ======================================== */
class FireParticle {
    constructor() {
        this.reset();
    }

    reset() {
        const canvasW = fireCanvas.offsetWidth;
        const canvasH = fireCanvas.offsetHeight;
        const centerX = canvasW / 2;

        // Ateş alttan merkezde yoğunlaşır
        this.x = centerX + (Math.random() - 0.5) * canvasW * 0.7;
        this.y = canvasH + Math.random() * 20;
        this.originX = this.x;
        this.size = Math.random() * CONFIG.fire.maxSize + 4;
        this.speedY = Math.random() * CONFIG.fire.speed + 0.8;
        this.speedX = (Math.random() - 0.5) * 1.2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
        this.wobbleRadius = Math.random() * 2 + 1;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.004;
        this.color = CONFIG.colors.fire[Math.floor(Math.random() * CONFIG.colors.fire.length)];
    }

    update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * this.wobbleRadius;
        this.y -= this.speedY;
        this.size *= 0.995;
        this.life -= this.decay;

        if (this.size <= 1 || this.life <= 0) {
            if (isBurning) {
                this.reset();
            } else {
                this.life = 0;
            }
        }
    }

    draw() {
        if (this.life <= 0 || this.size <= 0) return;

        const ctx = fireCtx;
        const alpha = this.life * 0.8;

        // Yumuşak glow efekti
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );

        // Renk ayrıştırma
        const rgba = this.color.match(/[\d.]+/g);
        const r = rgba[0], g = rgba[1], b = rgba[2];

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha})`);
        gradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}

/* ========================================
   Kıvılcım (Ember) Sınıfı
   ======================================== */
class EmberParticle {
    constructor() {
        this.reset();
    }

    reset() {
        const canvasW = fireCanvas.offsetWidth;
        const canvasH = fireCanvas.offsetHeight;

        this.x = canvasW * 0.2 + Math.random() * canvasW * 0.6;
        this.y = canvasH * 0.5 + Math.random() * canvasH * 0.5;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 3;
        this.life = 1;
        this.decay = Math.random() * 0.01 + 0.005;
        this.color = CONFIG.colors.ember[Math.floor(Math.random() * CONFIG.colors.ember.length)];
        this.trail = [];
    }

    update() {
        // Iz bırakma
        this.trail.push({ x: this.x, y: this.y, life: 0.5 });
        if (this.trail.length > 6) this.trail.shift();
        this.trail.forEach(t => t.life -= 0.08);

        this.y -= this.speedY;
        this.x += this.speedX + (Math.random() - 0.5) * 0.5;
        this.speedX *= 0.99;
        this.life -= this.decay;

        if (this.life <= 0) {
            if (isBurning) {
                this.reset();
            }
        }
    }

    draw() {
        if (this.life <= 0) return;
        const ctx = fireCtx;

        // İz çizimi
        this.trail.forEach(t => {
            if (t.life <= 0) return;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 80, ${t.life * 0.3})`;
            ctx.fill();
        });

        // Ana kıvılcım
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color.replace(/[\d.]+\)$/, `${this.life})`);
        ctx.fill();

        // Parlama
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 200, 80, ${this.life * 0.15})`;
        ctx.fill();
    }
}

/* ========================================
   Kağıt Parçası (Debris) Sınıfı
   ======================================== */
class DebrisParticle {
    constructor() {
        this.reset();
    }

    reset() {
        const canvasW = fireCanvas.offsetWidth;
        const canvasH = fireCanvas.offsetHeight;

        this.x = canvasW * 0.1 + Math.random() * canvasW * 0.8;
        this.y = canvasH * 0.3 + Math.random() * canvasH * 0.4;
        this.width = Math.random() * (CONFIG.debris.maxSize - CONFIG.debris.minSize) + CONFIG.debris.minSize;
        this.height = this.width * (Math.random() * 0.6 + 0.3);
        this.speedY = -(Math.random() * CONFIG.debris.maxSpeed + 0.5);
        this.speedX = (Math.random() - 0.5) * 4;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * CONFIG.debris.rotationSpeed;
        this.life = 1;
        this.decay = 1 / (CONFIG.debris.lifetime + Math.random() * 60);
        this.color = CONFIG.colors.debris[Math.floor(Math.random() * CONFIG.colors.debris.length)];
        this.gravity = -0.01; // Hafif yukarı çekim (ateş yükselişi)
        this.drag = 0.995;
        this.curl = Math.random() * 0.02;
        this.curlOffset = Math.random() * Math.PI * 2;

        // Yanık kenar efekti
        this.burnProgress = 0;
        this.burnSpeed = Math.random() * 0.008 + 0.003;
    }

    update() {
        this.speedY += this.gravity;
        this.speedX *= this.drag;
        this.speedY *= this.drag;

        // Kıvrımlı hareket
        this.x += this.speedX + Math.sin(this.curlOffset + this.life * 5) * this.curl * 50;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;
        this.life -= this.decay;
        this.burnProgress = Math.min(1, this.burnProgress + this.burnSpeed);

        if (this.life <= 0) {
            if (isBurning) {
                this.reset();
            }
        }
    }

    draw() {
        if (this.life <= 0) return;
        const ctx = fireCtx;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;

        // Kağıt parçası gövdesi
        const rgba = this.color.match(/[\d.]+/g);
        const r = parseFloat(rgba[0]);
        const g = parseFloat(rgba[1]);
        const b = parseFloat(rgba[2]);

        // Yanık → koyu kahve / gri geçişi
        const br = r * (1 - this.burnProgress) + 40 * this.burnProgress;
        const bg = g * (1 - this.burnProgress) + 25 * this.burnProgress;
        const bb = b * (1 - this.burnProgress) + 15 * this.burnProgress;

        ctx.fillStyle = `rgba(${br}, ${bg}, ${bb}, ${0.7 * this.life})`;

        // Düzensiz kağıt şekli
        ctx.beginPath();
        const w = this.width / 2;
        const h = this.height / 2;
        ctx.moveTo(-w + Math.random() * 1, -h);
        ctx.lineTo(w - Math.random() * 1, -h + Math.random() * 1);
        ctx.lineTo(w, h - Math.random() * 2);
        ctx.lineTo(-w + Math.random() * 2, h);
        ctx.closePath();
        ctx.fill();

        // Yanık kenar efekti — turuncu çizgi
        if (this.burnProgress > 0.1) {
            ctx.strokeStyle = `rgba(255, 120, 30, ${this.burnProgress * 0.6 * this.life})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Küçük kıvılcım noktaları kenarlarda
            const sparkCount = Math.floor(this.burnProgress * 3);
            for (let i = 0; i < sparkCount; i++) {
                const sx = (Math.random() - 0.5) * this.width;
                const sy = (Math.random() - 0.5) * this.height;
                ctx.beginPath();
                ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 200, 60, ${this.burnProgress * 0.5})`;
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        ctx.restore();
    }
}

/* ========================================
   Ateş Efekti Başlatma
   ======================================== */
function startFire() {
    isBurning = true;
    fireParticles = [];
    emberParticles = [];
    debrisParticles = [];

    for (let i = 0; i < CONFIG.fire.particleCount; i++) {
        fireParticles.push(new FireParticle());
    }
    for (let i = 0; i < CONFIG.fire.emberCount; i++) {
        emberParticles.push(new EmberParticle());
    }
    for (let i = 0; i < CONFIG.debris.count; i++) {
        debrisParticles.push(new DebrisParticle());
    }

    fireCanvas.classList.add('active');

    function animate() {
        const allDead =
            fireParticles.every(p => p.life <= 0) &&
            emberParticles.every(p => p.life <= 0) &&
            debrisParticles.every(p => p.life <= 0);

        if (!isBurning && allDead) {
            fireCtx.clearRect(0, 0, fireCanvas.offsetWidth, fireCanvas.offsetHeight);
            cancelAnimationFrame(fireAnimationId);
            fireCanvas.classList.remove('active');
            return;
        }

        fireCtx.clearRect(0, 0, fireCanvas.offsetWidth, fireCanvas.offsetHeight);

        // Alt glow — ateşin kök parlaması
        if (isBurning) {
            const canvasW = fireCanvas.offsetWidth;
            const canvasH = fireCanvas.offsetHeight;
            const glowGrad = fireCtx.createRadialGradient(
                canvasW / 2, canvasH, 0,
                canvasW / 2, canvasH, CONFIG.fire.glowRadius
            );
            glowGrad.addColorStop(0, 'rgba(255, 80, 20, 0.15)');
            glowGrad.addColorStop(0.5, 'rgba(255, 50, 10, 0.06)');
            glowGrad.addColorStop(1, 'rgba(255, 30, 0, 0)');
            fireCtx.fillStyle = glowGrad;
            fireCtx.fillRect(0, 0, canvasW, canvasH);
        }

        // Additive blending ateş için
        fireCtx.globalCompositeOperation = 'screen';

        fireParticles.forEach(p => {
            p.update();
            p.draw();
        });

        emberParticles.forEach(p => {
            p.update();
            p.draw();
        });

        fireCtx.globalCompositeOperation = 'source-over';

        // Kağıt parçaları normal blend
        debrisParticles.forEach(p => {
            p.update();
            p.draw();
        });

        fireAnimationId = requestAnimationFrame(animate);
    }
    animate();
}

/* ========================================
   Toast Bildirimi
   ======================================== */
function showToast(message) {
    // Mevcut toast varsa kaldır
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Animasyon için delay
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 2500);
}

/* ========================================
   Karakter Sayacı
   ======================================== */
ventInput.addEventListener('input', () => {
    const len = ventInput.value.length;
    charCount.textContent = `${len} / 2000`;
});

/* ========================================
   Yakma İşlemi
   ======================================== */
burnBtn.addEventListener('click', () => {
    if (ventInput.value.trim() === '') {
        showToast(CONFIG.messages.empty);
        ventInput.focus();
        return;
    }

    if (isBurning) return;

    // UI güncelle
    mainCard.classList.add('burning');
    ventInput.classList.add('fading');
    ventInput.readOnly = true;

    burnBtn.disabled = true;
    burnBtn.classList.add('burning');
    btnText.textContent = CONFIG.messages.burning;

    extinguishBtn.disabled = false;
    extinguishBtn.classList.add('ready');

    footerMsg.textContent = '🔥 Dertlerin yanıyor... Bırak gitsin.';
    footerMsg.classList.add('burned');

    // Ateşi başlat
    startFire();
});

/* ========================================
   Söndürme İşlemi
   ======================================== */
extinguishBtn.addEventListener('click', () => {
    if (!isBurning) return;

    isBurning = false;

    // UI Reset
    mainCard.classList.remove('burning');

    setTimeout(() => {
        ventInput.classList.remove('fading');
        ventInput.readOnly = false;
        ventInput.value = '';
        ventInput.placeholder = CONFIG.messages.placeholderAfter;
        charCount.textContent = '0 / 2000';
    }, 800);

    burnBtn.disabled = false;
    burnBtn.classList.remove('burning');
    btnText.textContent = CONFIG.messages.burn;

    extinguishBtn.disabled = true;
    extinguishBtn.classList.remove('ready');

    footerMsg.textContent = CONFIG.messages.burned;
    setTimeout(() => {
        footerMsg.classList.remove('burned');
        footerMsg.textContent = 'Yazdıkların hiçbir yere kaydedilmez. Sadece sen ve ateş.';
    }, 4000);
});

/* ========================================
   Textarea otomatik odak
   ======================================== */
ventInput.focus();
