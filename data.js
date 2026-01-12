/* Yapılandırma ve Sabitler */
const CONFIG = {
    fire: {
        particleCount: 250, // Parçacık sayısı (Daha yüksek = daha yoğun ateş)
        speed: 3,           // Ateşin yükselme hızı
        maxSize: 30         // Maksimum alev parçacığı boyutu
    },
    colors: {
        fire: [
            'rgba(255, 69, 0, 0.8)',   // Kırmızı-Turuncu
            'rgba(255, 140, 0, 0.8)',  // Turuncu
            'rgba(255, 215, 0, 0.8)',  // Altın Sarısı
            'rgba(255, 0, 0, 0.5)',    // Koyu Kırmızı
            'rgba(50, 50, 50, 0.3)'    // Duman Grisi
        ]
    },
    messages: {
        empty: "Önce yakmak istediğin bir şeyler yazmalısın...",
        burned: "Küller rüzgara karıştı."
    }
};
