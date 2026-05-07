document.addEventListener('DOMContentLoaded', () => {
    // 1. Логика мобильного бургер-меню
    const burgerMenu = document.querySelector('.burger-menu');
    const desktopNav = document.querySelector('.desktop-nav');
    
    if (burgerMenu && desktopNav) {
        burgerMenu.addEventListener('click', () => {
            const isActive = burgerMenu.classList.toggle('is-active');
            
            if (isActive) {
                // Применяем стили для отображения меню на мобильных
                desktopNav.style.display = 'block';
                desktopNav.style.position = 'absolute';
                desktopNav.style.top = '100%';
                desktopNav.style.left = '0';
                desktopNav.style.width = '100%';
                desktopNav.style.backgroundColor = 'var(--color-white)';
                desktopNav.style.padding = '20px';
                desktopNav.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                
                // Блокируем скролл страницы
                document.body.style.overflow = 'hidden';
            } else {
                // Сбрасываем инлайн-стили при закрытии
                desktopNav.style.display = '';
                desktopNav.style.position = '';
                document.body.style.overflow = '';
            }
        });
    }


    // 2. Плавный скролл по якорным ссылкам и закрытие мобильного меню
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Пропускаем заглушки
            if (targetId === '#' || targetId === '#more' || targetId === '#start') {
                e.preventDefault();
                return;
            }
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню, если оно открыто
                if (burgerMenu && burgerMenu.classList.contains('is-active')) {
                    burgerMenu.click();
                }
                
                // Плавная прокрутка к элементу
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    // 3. Логика аккордеона FAQ
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            
            // Опционально: закрываем все остальные открытые вкладки
            accordionHeaders.forEach(otherHeader => {
                otherHeader.setAttribute('aria-expanded', 'false');
            });
            
            // Переключаем состояние текущей вкладки
            if (!isExpanded) {
                header.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // 4. Логика переворота мозаичных карточек (Flip Cards)
    const mosaicCards = document.querySelectorAll('.mosaic-card');
    
    mosaicCards.forEach(card => {
        card.addEventListener('click', () => {
            // Переключаем класс flipped для запуска CSS 3D трансформации
            card.classList.toggle('flipped');
        });
    });

// 5. Логика слайдера Аудитории (Drag-to-scroll и плавный Edge Bounce)
    const sliderTrack = document.getElementById('audience-slider');
    
    if (sliderTrack) {
        let isDown = false;
        let startX;
        let scrollLeft;

        sliderTrack.addEventListener('mousedown', (e) => {
            isDown = true;
            sliderTrack.style.transition = 'none'; // Отключаем transition при ручном перетаскивании
            startX = e.pageX - sliderTrack.offsetLeft;
            scrollLeft = sliderTrack.scrollLeft;
        });

        const resetSliderDrag = () => {
            if (!isDown) return;
            isDown = false;
            // Возвращаем плавность для отскока
            sliderTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            sliderTrack.style.transform = 'translateX(0)';
        };

        sliderTrack.addEventListener('mouseleave', resetSliderDrag);
        sliderTrack.addEventListener('mouseup', resetSliderDrag);

        sliderTrack.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - sliderTrack.offsetLeft;
            const walk = (x - startX) * 1.5; // Скорость скролла
            const newScrollLeft = scrollLeft - walk;
            const maxScroll = sliderTrack.scrollWidth - sliderTrack.clientWidth;

            // Логика эластичного отскока при выходе за границы
            if (newScrollLeft < 0) {
                // Тянем за левый край
                sliderTrack.scrollLeft = 0;
                sliderTrack.style.transform = `translateX(${Math.abs(newScrollLeft) * 0.3}px)`;
            } else if (newScrollLeft > maxScroll) {
                // Тянем за правый край
                const overscroll = newScrollLeft - maxScroll;
                sliderTrack.scrollLeft = maxScroll;
                sliderTrack.style.transform = `translateX(-${overscroll * 0.3}px)`;
            } else {
                // Обычный скролл
                sliderTrack.style.transform = 'translateX(0)';
                sliderTrack.scrollLeft = newScrollLeft;
            }
        });
    }

    // 6. Логика переворота карточек Аудитории (с игнорированием клика по кнопке)
    const audienceCards = document.querySelectorAll('.audience-card');
    
    audienceCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Если клик был по кнопке "Начать сейчас", не переворачиваем (даем сработать ссылке/событию кнопки)
            if (!e.target.closest('.card-back .btn')) {
                card.classList.toggle('flipped');
            }
        });
    });
});
