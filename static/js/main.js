/* Landing interactions: mobile menu, smooth anchors, FAQ accordion, flip cards, audience slider. No dependencies. */
document.addEventListener('DOMContentLoaded', () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Mobile menu
    const burger = document.querySelector('.burger-menu');
    const overlay = document.getElementById('mobile-menu');
    const closeBtn = document.getElementById('mobile-close');

    const setMenu = (open) => {
        if (!overlay) return;
        overlay.classList.toggle('is-active', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (burger) burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    if (burger && overlay && closeBtn) {
        burger.addEventListener('click', () => setMenu(true));
        closeBtn.addEventListener('click', () => setMenu(false));
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
    }

    // 2. Smooth anchors (same-page only); placeholder links ("#") do nothing
    document.querySelectorAll('a[href*="#"]').forEach((link) => {
        link.addEventListener('click', (e) => {
            const url = new URL(link.href, window.location.href);
            const href = link.getAttribute('href');
            if (href === '#') { e.preventDefault(); return; }
            if (url.pathname !== window.location.pathname || !url.hash) return;
            const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
            if (!target) return;
            e.preventDefault();
            setMenu(false);
            target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    // 3. FAQ accordion (items open independently)
    document.querySelectorAll('.accordion-header').forEach((header) => {
        header.addEventListener('click', () => {
            header.setAttribute('aria-expanded', header.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
        });
    });

    // 4. Flip cards (comparison mosaic): click or Enter/Space
    document.querySelectorAll('.mosaic-card').forEach((card) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        const flip = () => card.classList.toggle('flipped');
        card.addEventListener('click', flip);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); }
        });
    });

    // 5. Audience slider: drag-to-scroll with elastic edges
    const track = document.getElementById('audience-slider');
    if (track) {
        let isDown = false;
        let startX = 0;
        let scrollLeft = 0;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.transition = 'none';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        const release = () => {
            if (!isDown) return;
            isDown = false;
            track.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            track.style.transform = 'translateX(0)';
        };
        track.addEventListener('mouseleave', release);
        track.addEventListener('mouseup', release);

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const next = scrollLeft - (x - startX) * 1.5;
            const max = track.scrollWidth - track.clientWidth;
            if (next < 0) {
                track.scrollLeft = 0;
                track.style.transform = `translateX(${Math.abs(next) * 0.3}px)`;
            } else if (next > max) {
                track.scrollLeft = max;
                track.style.transform = `translateX(-${(next - max) * 0.3}px)`;
            } else {
                track.style.transform = 'translateX(0)';
                track.scrollLeft = next;
            }
        });
    }

    // 6. Audience cards: flip on click/Enter, except when the click is on the "start" link
    document.querySelectorAll('.audience-card').forEach((card) => {
        card.setAttribute('tabindex', '0');
        const flip = () => card.classList.toggle('flipped');
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.card-back .btn')) flip();
        });
        card.addEventListener('keydown', (e) => {
            if (e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); flip(); }
        });
    });
});
