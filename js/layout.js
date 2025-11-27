document.addEventListener("DOMContentLoaded", function () {

    const loadComponent = (selector, url) => {
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error("No se pudo cargar " + url);
                }
                return response.text();
            })
            .then(data => {
                document.querySelector(selector).innerHTML = data;
            })
            .catch(error => console.error(error));
    };

    loadComponent("#header-placeholder", "componentes/header.html").then(() => {
        initMobileMenu();
        updateCartBadge();
    });
    loadComponent("#footer-placeholder", "componentes/footer.html");

    // Escuchar cambios en el carrito
    window.addEventListener('cart-updated', (e) => {
        updateCartBadge(e.detail.count);
    });

    function updateCartBadge(count) {
        if (count === undefined) {
            // Si no se pasa count, intentar obtenerlo del carrito si existe, o leer de localStorage
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            count = storedCart.reduce((total, item) => total + item.quantity, 0);
        }

        const cartIcons = document.querySelectorAll('.fa-shopping-cart');
        cartIcons.forEach(icon => {
            const link = icon.closest('a');
            if (link) {
                let badge = link.querySelector('.badge');
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'badge rounded-pill bg-danger position-absolute top-0 start-100 translate-middle';
                    badge.style.fontSize = '0.7rem';
                    if (link.parentElement.classList.contains('iconos-header')) {
                        link.style.position = 'relative';
                        link.appendChild(badge);
                    }
                }

                if (count > 0) {
                    badge.textContent = count;
                    badge.style.display = 'inline-block';
                } else {
                    badge.style.display = 'none';
                }
            }
        });
    }

    function initMobileMenu() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const menuMobile = document.getElementById('menu-mobile');
        const closeBtn = document.querySelector('.close-btn');
        const menuLinks = document.querySelectorAll('.menu-mobile-nav a');

        // Abrir menú
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', function () {
                menuMobile.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Cerrar menú
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                menuMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        // Cerrar menú al hacer click en un link
        menuLinks.forEach(link => {
            link.addEventListener('click', function () {
                menuMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera del contenido
        if (menuMobile) {
            menuMobile.addEventListener('click', function (e) {
                if (e.target === menuMobile) {
                    menuMobile.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
});