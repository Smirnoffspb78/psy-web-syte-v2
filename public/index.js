document.addEventListener('DOMContentLoaded', function() {
    // ===== Функционал скрытия меню при прокрутке =====
    // ===== Функционал меню =====
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const headerNav = document.querySelector('.header-nav');
    let lastScroll = 0;

    // Бургер-меню
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Закрытие меню при клике на ссылку
    if (navMenu) {
        document.querySelectorAll('#nav-menu a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }

    // Скрытие/показ меню при прокрутке
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (headerNav) {
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Прокрутка вниз - скрываем
                headerNav.classList.add('hidden');
            } else if (currentScroll < lastScroll) {
                // Прокрутка вверх - показываем
                headerNav.classList.remove('hidden');
            }
        }

        lastScroll = currentScroll;
    });

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

function openSurvey() {
    document.getElementById("survey-modal").style.display = "block";
}

function closeSurvey() {
    document.getElementById("survey-modal").style.display = "none";
}

// Инициализация EmailJS
emailjs.init("6I3OXO8du6aLz7NRe"); // вставь сюда Public Key

document.getElementById("survey-form").addEventListener("submit", function(event) {
    event.preventDefault(); // блокируем стандартную отправку

    // Получаем значения полей
    const q1 = this.q1.value.trim();
    const q2 = this.q2.value.trim();
    const q3 = this.q3.value.trim();
    const q4 = this.q4.value.trim();
    const q5 = this.q5.value.trim();

    // Проверка на заполненность
    if (!q1 || !q2 || !q3 || !q4 || !q5) {
        alert("Пожалуйста, заполните все поля анкеты!");
        return;
    }

    // Проверка возраста
    const age = parseInt(q2, 10);
    if (isNaN(age) || age <= 0) {
        alert("Пожалуйста, укажите корректный возраст (число больше нуля).");
        return;
    }

    // Если все проверки пройдены — отправляем форму
    emailjs.sendForm(
        "psy-site-service-19076",      // Service ID
        "template_v0nhgb4",     // Template ID
        this
    )
        .then(function() {
            alert("Анкета успешно отправлена!");
            // Закрываем модальное окно
            document.getElementById("survey-modal").style.display = "none";
            // Очищаем форму
            document.getElementById("survey-form").reset();
        }, function(error) {
            const goToTelegram = confirm(
                "Ошибка отправки. Напишите мне напрямую в Telegram: https://t.me/Lmila_psy"
            );
            if (goToTelegram) {
                window.open("https://t.me/Lmila_psy", "_blank");
            }
        });
});