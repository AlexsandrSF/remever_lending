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
});
