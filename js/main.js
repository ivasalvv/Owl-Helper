/* ============================================
   OWL HELPER — JavaScript
   Бургер-меню, скрол хедера, плавний скрол
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------- Елементи ---------- */
    const header = document.querySelector('.header');
    const burger = document.querySelector('.burger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    /* ---------- Бургер-меню ---------- */
    if (burger && mobileMenu) {
        const closeMenu = () => {
            mobileMenu.classList.remove('mobile-menu--open');
            burger.classList.remove('burger--open');
            burger.setAttribute('aria-expanded', 'false');
            burger.setAttribute('aria-label', 'Відкрити меню');
        };

        burger.addEventListener('click', () => {
            const isOpen = mobileMenu.classList.toggle('mobile-menu--open');
            burger.classList.toggle('burger--open', isOpen);
            burger.setAttribute('aria-expanded', String(isOpen));
            burger.setAttribute('aria-label', isOpen ? 'Закрити меню' : 'Відкрити меню');
        });

        /* Закриття мобільного меню при кліку на посилання */
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        /* Закриття мобільного меню при кліку за межами меню */
        document.addEventListener('click', (e) => {
            if (mobileMenu.classList.contains('mobile-menu--open')) {
                if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
                    closeMenu();
                }
            }
        });

        /* Закриття меню клавішею Escape */
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
                closeMenu();
            }
        });
    }

    /* ---------- Ховання/показ хедера при скролі ---------- */
    let lastScrollY = window.pageYOffset || document.documentElement.scrollTop;
    let ticking = false;

    const handleScroll = () => {
        const currentScrollY = window.pageYOffset || document.documentElement.scrollTop;

        /* Якщо відкрите мобільне меню — хедер не ховаємо */
        if (mobileMenu && mobileMenu.classList.contains('mobile-menu--open')) {
            lastScrollY = currentScrollY;
            ticking = false;
            return;
        }

        /* Біля самого верху завжди показуємо */
        if (currentScrollY <= 30) {
            header.classList.remove('header--hidden');
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
            /* Скрол вниз — ховаємо хедер */
            header.classList.add('header--hidden');
        } else if (currentScrollY < lastScrollY) {
            /* Скрол вгору — показуємо хедер */
            header.classList.remove('header--hidden');
        }

        lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    /* ---------- Плавний скрол до якорів ---------- */
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            /* Перевіряємо, чи це внутрішнє посилання */
            if (href && href.startsWith('#') && href.length > 1) {
                if (href === '#top') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    /* ---------- Акордеони: відкриття тільки одного таба у секції ---------- */
    const accordionContainers = document.querySelectorAll('.accordion');
    accordionContainers.forEach(container => {
        const detailsList = container.querySelectorAll('details');
        detailsList.forEach(detail => {
            detail.addEventListener('toggle', () => {
                if (detail.open) {
                    detailsList.forEach(otherDetail => {
                        if (otherDetail !== detail && otherDetail.open) {
                            otherDetail.removeAttribute('open');
                        }
                    });
                }
            });
        });
    });

});
