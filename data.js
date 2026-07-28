/* Yapılandırma ve Sabitler */
const CONFIG = {
    fire: {
        particleCount: 180,
        emberCount: 60,
        speed: 2.5,
        maxSize: 18,
        glowRadius: 120
    },
    debris: {
        count: 35,
        maxSize: 14,
        minSize: 4,
        maxSpeed: 3,
        rotationSpeed: 0.08,
        lifetime: 180
    },
    colors: {
        fire: [
            'rgba(255, 100, 30, 0.9)',
            'rgba(255, 160, 40, 0.85)',
            'rgba(255, 200, 60, 0.8)',
            'rgba(255, 60, 10, 0.6)',
            'rgba(200, 80, 20, 0.5)'
        ],
        ember: [
            'rgba(255, 180, 50, 0.9)',
            'rgba(255, 120, 30, 0.7)',
            'rgba(255, 80, 10, 0.5)'
        ],
        debris: [
            'rgba(180, 160, 130, 0.8)',
            'rgba(160, 140, 110, 0.7)',
            'rgba(140, 120, 90, 0.6)',
            'rgba(100, 80, 60, 0.5)'
        ]
    },
    messages: {
        empty: "Önce yakmak istediğin bir şeyler yazmalısın...",
        burned: "Küller rüzgara karıştı.",
        placeholder: "İçini rahatsız eden ne varsa buraya yaz...",
        placeholderAfter: "Her şeyi bıraktın. Şimdi nefes al...",
        burning: "Yanıyor...",
        burn: "Ateşe Ver",
        extinguish: "Söndür"
    }
};
