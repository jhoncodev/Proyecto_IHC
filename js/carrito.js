document.addEventListener('DOMContentLoaded', () => {
    // Infrastructure - DOM Elements
    const DOM = {
        cartItemsContainer: document.querySelector('.cart-items'),
        subtotalEl: document.getElementById('subtotal'),
        totalEl: document.getElementById('total'),
        promoInput: document.getElementById('promo-input'),
        promoContainer: document.getElementById('promo-container'),
        promoIcon: document.getElementById('promo-icon')
    };

    // Application - Discount Service
    class DiscountService {
        static PROMO_CODES = {
            'ALELI10': { discount: 0.10, message: '¡Código aplicado! 10% de descuento' },
            'ALELI20': { discount: 0.20, message: '¡Código aplicado! 20% de descuento' },
            'BIENVENIDA': { discount: 0.15, message: '¡Bienvenida! 15% de descuento' }
        };

        static applyDiscount(code) {
            const promoCode = code.trim().toUpperCase();
            return this.PROMO_CODES[promoCode] || null;
        }
    }

    // Application - Cart State
    let appliedDiscount = 0;

    // Presentation - Render Cart Items
    function renderCart() {
        const items = cart.getItems();
        const title = DOM.cartItemsContainer.querySelector('.cart-title');

        DOM.cartItemsContainer.innerHTML = '';
        if (title) DOM.cartItemsContainer.appendChild(title);

        if (items.length === 0) {
            showEmptyCartMessage();
            updateTotals();
            return;
        }

        items.forEach(item => {
            const itemElement = createCartItemElement(item);
            DOM.cartItemsContainer.appendChild(itemElement);
        });

        attachCartEventListeners();
        updateTotals();
    }

    function showEmptyCartMessage() {
        const message = document.createElement('p');
        message.className = 'text-center my-5';
        message.innerHTML = `
            Tu carrito está vacío.<br>
            <a href="catalogo.html" class="btn btn-dark mt-3">Ver productos</a>
        `;
        DOM.cartItemsContainer.appendChild(message);
    }

    function createCartItemElement(item) {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='images/modelo-tendencia.jpg'">
            <div class="item-details">
                <h3 class="item-name">${item.name}</h3>
                <p class="item-color">Código: #${item.id.toString().padStart(5, '0')}</p>
                <div class="item-quantity">
                    <span class="quantity-label">Cantidad:</span>
                    <div class="quantity-controls">
                        <button class="quantity-btn decrease" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn increase" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <div class="item-price-container">
                    <p class="item-price">S/ ${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <div class="action-links">
                    <span class="action-link remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </span>
                </div>
            </div>
        `;
        return itemEl;
    }

    function attachCartEventListeners() {
        attachQuantityListeners('.quantity-btn.decrease', handleDecrease);
        attachQuantityListeners('.quantity-btn.increase', handleIncrease);
        attachQuantityListeners('.remove-item', handleRemove);
    }

    function attachQuantityListeners(selector, handler) {
        document.querySelectorAll(selector).forEach(btn => {
            btn.addEventListener('click', handler);
        });
    }

    function handleDecrease(e) {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cart.getItems().find(i => i.id === id);

        if (item && item.quantity > 1) {
            cart.updateQuantity(id, item.quantity - 1);
            renderCart();
        } else if (item && item.quantity === 1) {
            handleRemove(e);
        }
    }

    function handleIncrease(e) {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cart.getItems().find(i => i.id === id);

        if (item) {
            cart.updateQuantity(id, item.quantity + 1);
            renderCart();
        }
    }

    function handleRemove(e) {
        const id = parseInt(e.currentTarget.dataset.id);
        const item = cart.getItems().find(i => i.id === id);

        if (confirm(`¿Estás seguro de eliminar "${item.name}" del carrito?`)) {
            cart.removeItem(id);
            renderCart();
            Toast.show('Producto eliminado del carrito', 'warning');
        }
    }

    function updateTotals() {
        const subtotal = cart.getTotal();
        const discount = subtotal * appliedDiscount;
        const total = subtotal - discount;

        DOM.subtotalEl.textContent = `S/ ${subtotal.toFixed(2)}`;
        DOM.totalEl.textContent = `S/ ${total.toFixed(2)}`;

        if (appliedDiscount > 0) {
            showDiscountInfo(discount);
        }
    }

    function showDiscountInfo(discountAmount) {
        const existingDiscount = document.querySelector('.discount-row');
        if (existingDiscount) existingDiscount.remove();

        const discountRow = document.createElement('div');
        discountRow.className = 'summary-row discount-row';
        discountRow.innerHTML = `
            <span class="summary-label">Descuento</span>
            <span class="summary-value text-success">-S/ ${discountAmount.toFixed(2)}</span>
        `;

        const totalRow = document.querySelector('.total-row');
        totalRow.parentElement.insertBefore(discountRow, totalRow);
    }

    // Promo Code Functionality
    window.togglePromo = function() {
        DOM.promoContainer.classList.toggle('active');
        const isActive = DOM.promoContainer.classList.contains('active');
        DOM.promoIcon.style.transform = isActive ? 'rotate(180deg)' : 'rotate(0deg)';
    };

    window.applyPromo = function() {
        const code = DOM.promoInput.value;
        const promoResult = DiscountService.applyDiscount(code);

        if (promoResult) {
            appliedDiscount = promoResult.discount;
            updateTotals();
            Toast.show(promoResult.message, 'success');
            DOM.promoInput.value = '';
            DOM.promoInput.disabled = true;
        } else if (!code.trim()) {
            Toast.show('Por favor ingresa un código promocional', 'warning');
        } else {
            Toast.show('Código promocional inválido', 'danger');
        }
    };

    // Checkout Functionality
    window.checkout = function() {
        const itemCount = cart.getCount();

        if (itemCount === 0) {
            alert('El carrito está vacío', 'warning');
            return;
        }

        const total = cart.getTotal() * (1 - appliedDiscount);
        showPaymentSuccessModal(total);
    };

    function showPaymentSuccessModal(total) {
        const modal = document.createElement('div');
        modal.className = 'payment-modal';
        modal.innerHTML = `
            <div class="payment-modal-overlay"></div>
            <div class="payment-modal-content">
                <div class="payment-success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h2>¡Pago Realizado!</h2>
                <p>Tu compra ha sido procesada exitosamente</p>
                <div class="payment-details">
                    <p><strong>Total pagado:</strong> S/ ${total.toFixed(2)}</p>
                    <p><strong>Productos:</strong> ${cart.getCount()} artículos</p>
                </div>
                <p class="payment-message">Recibirás un correo de confirmación en breve</p>
                <button class="btn-close-modal" onclick="closePaymentModal()">Aceptar</button>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);
    }

    window.closePaymentModal = function() {
        const modal = document.querySelector('.payment-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.remove();
                cart.clear();
                appliedDiscount = 0;
                renderCart();
                Toast.show('Carrito vaciado', 'info');
            }, 300);
        }
    };

    // Initialize
    renderCart();

    // Listen to cart updates
    window.addEventListener('cart-updated', () => {
        renderCart();
    });
});
