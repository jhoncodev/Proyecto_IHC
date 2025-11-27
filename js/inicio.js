document.addEventListener('DOMContentLoaded', () => {
    // Domain - Featured Outfit Products
    const OUTFIT_PRODUCTS = [
        {
            id: 100,
            name: 'Blazer Oversized Beige',
            price: 120.00,
            image: 'images/blazer-beige.jpg',
            categoryId: 'chaquetas'
        },
        {
            id: 101,
            name: 'Pantalón Palazzo Negro',
            price: 85.00,
            image: 'images/pantalon-palazzo.jpg',
            categoryId: 'pantalones'
        },
        {
            id: 102,
            name: 'Correa Elegante Marrón',
            price: 35.00,
            image: 'images/correa-marron.jpg',
            categoryId: 'accesorios'
        }
    ];

    // Infrastructure - DOM Elements
    const DOM = {
        addToCartBtn: document.querySelector('.btn-agregar-carrito'),
        productItems: document.querySelectorAll('.producto-item')
    };

    // Application - Outfit Service
    class OutfitService {
        static getSelectedProducts() {
            const selectedProducts = [];

            DOM.productItems.forEach((item, index) => {
                const selectedSize = item.querySelector('input[type="radio"]:checked');

                if (selectedSize) {
                    const product = {
                        ...OUTFIT_PRODUCTS[index],
                        selectedSize: selectedSize.value
                    };
                    selectedProducts.push(product);
                }
            });

            return selectedProducts;
        }

        static validateSelection() {
            const allSelected = Array.from(DOM.productItems).every(item => {
                return item.querySelector('input[type="radio"]:checked') !== null;
            });

            return allSelected;
        }
    }

    // Presentation - Event Handlers
    function handleAddToCart() {
        if (!OutfitService.validateSelection()) {
            Toast.show('Por favor selecciona todas las tallas', 'warning');
            return;
        }

        const selectedProducts = OutfitService.getSelectedProducts();
        let addedCount = 0;

        selectedProducts.forEach(product => {
            cart.addItem(product);
            addedCount++;
        });

        if (addedCount > 0) {
            Toast.show(`¡Outfit completo agregado! (${addedCount} productos)`, 'success');

            setTimeout(() => {
                const goToCart = confirm('¿Deseas ir al carrito de compras?');
                if (goToCart) {
                    window.location.href = 'carrito.html';
                }
            }, 500);
        }
    }

    // Event Listeners
    if (DOM.addToCartBtn) {
        DOM.addToCartBtn.addEventListener('click', handleAddToCart);
    }

    // Add hover effect to product items
    DOM.productItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateX(5px)';
            item.style.transition = 'transform 0.3s';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateX(0)';
        });
    });
});
