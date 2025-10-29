document.addEventListener("DOMContentLoaded", function() {

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
    });
    loadComponent("#footer-placeholder", "componentes/footer.html");

    function initMobileMenu() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const menuMobile = document.getElementById('menu-mobile');
        const closeBtn = document.querySelector('.close-btn');
        const menuLinks = document.querySelectorAll('.menu-mobile-nav a');

        // Abrir menú
        if (hamburgerBtn) {
            hamburgerBtn.addEventListener('click', function() {
                menuMobile.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        }

        // Cerrar menú
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                menuMobile.classList.remove('active');
                document.body.style.overflow = ''; 
            });
        }

        // Cerrar menú al hacer click en un link
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                menuMobile.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Cerrar menú al hacer click fuera del contenido
        if (menuMobile) {
            menuMobile.addEventListener('click', function(e) {
                if (e.target === menuMobile) {
                    menuMobile.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    }
});