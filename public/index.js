document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.reviews-track');
    const dotsContainer = document.querySelector('.slider-dots');
    const reviews = document.querySelectorAll('.review-box');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    const reviewsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const dotCount = Math.ceil(reviews.length / reviewsToShow);

    // Создаем точки навигации
    for (let i = 0; i < dotCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    function updateSlider() {
        const reviewWidth = reviews[0].offsetWidth + 32; // + gap
        track.style.transform = `translateX(-${currentIndex * reviewWidth * reviewsToShow}px)`;

        // Обновляем активную точку
        document.querySelectorAll('.slider-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < dotCount - 1) {
            currentIndex++;
            updateSlider();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlider();
        }
    });

    // Адаптация при изменении размера окна
    window.addEventListener('resize', function() {
        const newReviewsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        if (newReviewsToShow !== reviewsToShow) {
            location.reload(); // Перезагрузка для простоты
        }
    });
});