document.addEventListener('DOMContentLoaded', function() {
    // ===== Функционал скрытия меню при прокрутке =====
    const headerNav = document.querySelector('.header-nav');
    let lastScroll = 0;
    const scrollThreshold = 100; // Пикселей для начала скрытия
    const hideShowDelay = 200; // Задержка в мс для плавности

    if (headerNav) {
        let scrollTimeout;

        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            clearTimeout(scrollTimeout);

            if (currentScroll > lastScroll && currentScroll > scrollThreshold) {
                // Прокрутка вниз - скрываем
                scrollTimeout = setTimeout(() => {
                    headerNav.classList.add('hidden');
                    headerNav.style.transition = 'transform 0.3s ease-out';
                }, hideShowDelay);
            } else if (currentScroll < lastScroll) {
                // Прокрутка вверх - показываем
                scrollTimeout = setTimeout(() => {
                    headerNav.classList.remove('hidden');
                    headerNav.style.transition = 'transform 0.3s ease-out';
                }, hideShowDelay);
            }

            lastScroll = currentScroll;
        });
    }

    // ===== Бургер-меню =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

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

// Скрипт для разворачивания ответов
function toggleAnswer(element) {
    element.classList.toggle('active');

    // Закрываем другие открытые вопросы
    const allQuestions = document.querySelectorAll('.question-box');
    allQuestions.forEach(question => {
        if (question !== element && question.classList.contains('active')) {
            question.classList.remove('active');
        }
    });
}


// Исправленный JavaScript для модального окна
let currentImageIndex = 0;
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-image');

// Получаем все элементы изображений из галереи
const galleryImages = document.querySelectorAll('.image-gallery img');
const images = Array.from(galleryImages).map(img => img.src);

function openModal(index) {
    currentImageIndex = index;
    modal.style.display = "block";
    modalImg.src = images[index];
    document.body.style.overflow = "hidden";
}

function closeModal(e) {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function changeImage(step, e) {
    e.stopPropagation();
    currentImageIndex = (currentImageIndex + step + images.length) % images.length;
    modalImg.src = images[currentImageIndex];
}

// Закрытие по ESC
document.addEventListener('keydown', function(e) {
    if (e.key === "Escape" && modal.style.display === "block") {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
});

// Добавляем обработчики для всех изображений
galleryImages.forEach((img, index) => {
    img.addEventListener('click', () => openModal(index));
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault(); // Отменяем стандартное поведение
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Плавная прокрутка к элементу
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start' // 'start', 'center', 'end' или 'nearest'
            });

            // Если нужно обновить URL без перезагрузки (опционально)
            history.pushState(null, null, targetId);
        }
    });
});