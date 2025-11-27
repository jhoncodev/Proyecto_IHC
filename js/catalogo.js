document.addEventListener('DOMContentLoaded', () => {
    // Domain - Entidades
    const CATEGORIES = [
        { id: 'blusas', name: 'Blusas' },
        { id: 'vestidos', name: 'Vestidos' },
        { id: 'pantalones', name: 'Pantalones de vestir' },
        { id: 'jeans', name: 'Jeans' },
        { id: 'chaquetas', name: 'Chaquetas' }
    ];

    const PRODUCTS = [
        // Blusas
        { id: 1, categoryId: 'blusas', name: 'Blusa Elegante', price: 89.90, image: 'images/blusa1.jpg', sizes: ['XS', 'S', 'M'], colors: ['Blanco','Rojo','Negro']},
        { id: 2, categoryId: 'blusas', name: 'Blusa Casual', price: 75.00, image: 'images/blusa2.jpg', sizes: ['L', 'XL', 'XXL'], colors: ['Azul','Rojo','Negro','Rosado'] },
        { id: 3, categoryId: 'blusas', name: 'Blusa de Seda Premium', price: 120.00, image: 'images/blusa3.jpg', sizes: ['S', 'M', 'XXL'], colors: ['Verde','Gris','Rosado']  },

        // Vestidos
        { id: 4, categoryId: 'vestidos', name: 'Vestido de Noche', price: 150.00, image: 'images/vestido1.jpg', sizes: ['S', 'M', 'L'], colors: ['Negro','Rosado','Blanco']  },
        { id: 5, categoryId: 'vestidos', name: 'Vestido Veraniego', price: 95.00, image: 'images/vestido2.jpg' , sizes: ['L', 'XL', 'XXL'], colors: ['Amarillo','Azul','Gris'] },
        { id: 6, categoryId: 'vestidos', name: 'Vestido Midi Elegante', price: 110.00, image: 'images/vestido3.jpg', sizes: ['S', 'L', 'XL'], colors: ['Azul','Rojo','Negro','Rosado']  },

        // Pantalones
        { id: 7, categoryId: 'pantalones', name: 'Pantalón de Vestir Gris', price: 130.00, image: 'images/pantalon1.jpg', sizes: ['S', 'M', 'L'], colors: ['Gris', 'Negro', 'Blanco'] },
        { id: 8, categoryId: 'pantalones', name: 'Pantalón Recto Negro', price: 125.00, image: 'images/pantalon2.jpg', sizes: ['M', 'L', 'XL'], colors: ['Negro', 'Azul', 'Gris'] },
        { id: 9, categoryId: 'pantalones', name: 'Pantalón Palazzo', price: 140.00, image: 'images/pantalon3.jpg', sizes: ['S', 'M', 'XL'], colors: ['Negro', 'Azul', 'Verde'] },

        // Jeans
        { id: 10, categoryId: 'jeans', name: 'Jean Skinny', price: 99.00, image: 'images/jean1.jpg', sizes: ['XS', 'S', 'M'], colors: ['Azul', 'Negro', 'Blanco'] },
        { id: 11, categoryId: 'jeans', name: 'Jean Mom Fit', price: 105.00, image: 'images/jean2.jpg', sizes: ['S', 'M', 'L'], colors: ['Azul', 'Gris', 'Negro'] },
        { id: 12, categoryId: 'jeans', name: 'Jean Negro Roto', price: 110.00, image: 'images/jean3.jpg', sizes: ['M', 'L', 'XL'], colors: ['Negro', 'Azul', 'Rojo'] },

        // Chaquetas
        { id: 13, categoryId: 'chaquetas', name: 'Chaqueta Bomber', price: 160.00, image: 'images/chaqueta1.jpg', sizes: ['XS', 'S', 'M'], colors: ['Rosado', 'Negro', 'Blanco'] },
        { id: 14, categoryId: 'chaquetas', name: 'Chaqueta de Cuero', price: 220.00, image: 'images/chaqueta2.jpg', sizes: ['S', 'M', 'L'], colors: ['Negro', 'Gris', 'Azul'] },
        { id: 15, categoryId: 'chaquetas', name: 'Chaqueta Denim', price: 145.00, image: 'images/chaqueta3.jpg', sizes: ['M', 'L', 'XL'], colors: ['Azul', 'Negro', 'Gris'] }
    ];

    // Infrastructure - DOM Elements
    const DOM = {
        categoryList: document.querySelector('#categoryBody .list-group'),
        productGrid: document.querySelector('.row-cols-2'),
        searchInput: document.querySelector('.search-input'),
        sizeCheckboxes: document.querySelectorAll('#sizeBody .form-check-input'),
        colorLinks: document.querySelectorAll('#colorsBody .list-group-item')
    };

    // Application - State
    class CatalogState {
        constructor() {
            this.currentCategory = 'all';
            this.currentSearch = '';
            this.currentSort = 'default';
            this.currentSize = 'all';
            this.currentColor = 'all';
        }

        setCategory(category) {
            this.currentCategory = category;
        }

        setSearch(search) {
            this.currentSearch = search.toLowerCase();
        }

        setSort(sort) {
            this.currentSort = sort;
        }

        setSize(size) {
            this.currentSize = size;
        }

        setColor(color) {
            this.currentColor = color;
        }
    }

    const state = new CatalogState();

    // Crear selector de ordenamiento
    const sortContainer = document.createElement('div');
    sortContainer.className = 'd-flex justify-content-end mb-3';
    sortContainer.innerHTML = `
        <select id="sortSelect" class="form-select w-auto">
            <option value="default">Ordenar por</option>
            <option value="price-asc">Precio: Menor a Mayor</option>
            <option value="price-desc">Precio: Mayor a Menor</option>
        </select>
    `;
    document.querySelector('.search-bar').parentElement.after(sortContainer);

    const sortSelect = document.getElementById('sortSelect');

    const clearButton = document.createElement('button');
    clearButton.className = 'btn btn-secondary ms-2';
    clearButton.textContent = 'Limpiar Filtros';
    sortContainer.appendChild(clearButton);

    clearButton.addEventListener('click', () => {
        // Reset state
        state.setCategory('all');
        state.setSearch('');
        state.setSort('default');
        state.setSize('all');
        state.setColor('all');

        DOM.searchInput.value = '';
        sortSelect.value = 'default';

        DOM.sizeCheckboxes.forEach(chk => chk.checked = false);
        
        const categoryLinks = DOM.categoryList.querySelectorAll('.list-group-item');
        categoryLinks.forEach((link, index)=>{
            link.classList.toggle('active', index === 0);
        });

        DOM.colorLinks.forEach(link => link.classList.remove('active'));

        renderProducts();
    })

    // Event Listeners para Categorías
    function setupCategoryFilters() {
        const categoryLinks = DOM.categoryList.querySelectorAll('.list-group-item');
        categoryLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = link.dataset.category;
                setActiveCategory(link);
                state.setCategory(categoryId);
                renderProducts();
            });
        });
    }

    // Event Listeners para Tallas
    function setupSizeFilters() {
        DOM.sizeCheckboxes.forEach(chk => {
            chk.addEventListener('change', (e) => {
                if (e.target.checked) {
                    // Desmarcar otras tallas
                    DOM.sizeCheckboxes.forEach(c => { if (c !== e.target) c.checked = false; });
                    state.setSize(e.target.value);
                } else {
                    state.setSize('all');
                }
                renderProducts();
            });
        });
    }

    // Event Listeners para Colores
    function setupColorFilters() {
        DOM.colorLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Limpiar activos anteriores
                DOM.colorLinks.forEach(l => l.classList.remove('active'));
                
                // Marcar como activo
                link.classList.add('active');
                
                // Extraer nombre del color del link
                const colorText = link.textContent.trim();
                state.setColor(colorText);
                renderProducts();
            });
        });
    }

    // Event Listeners
    DOM.searchInput.addEventListener('input', (e) => {
        state.setSearch(e.target.value);
        renderProducts();
    });

    sortSelect.addEventListener('change', (e) => {
        state.setSort(e.target.value);
        renderProducts();
    });

    // Presentation - Render Categories
    function renderCategories() {
        DOM.categoryList.innerHTML = '';

        const allLink = createCategoryLink('all', 'Todas', true);
        DOM.categoryList.appendChild(allLink);

        CATEGORIES.forEach(category => {
            const link = createCategoryLink(category.id, category.name, false);
            DOM.categoryList.appendChild(link);
        });
    }

    function createCategoryLink(categoryId, categoryName, isActive) {
        const link = document.createElement('a');
        link.href = '#';
        link.className = `list-group-item list-group-item-action ${isActive ? 'active' : ''}`;
        link.textContent = categoryName;
        link.dataset.category = categoryId;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            handleCategoryClick(categoryId, link);
        });
        return link;
    }

    function handleCategoryClick(categoryId, linkElement) {
        setActiveCategory(linkElement);
        state.setCategory(categoryId);
        renderProducts();
    }

    function setActiveCategory(activeElement) {
        const links = DOM.categoryList.querySelectorAll('.list-group-item');
        links.forEach(link => link.classList.remove('active'));
        activeElement.classList.add('active');
    }

    // Application - Product Service
    class ProductService {
        static filterByCategory(products, categoryId) {
            return categoryId === 'all'
                ? products
                : products.filter(p => p.categoryId === categoryId);
        }

        static filterBySearch(products, searchTerm) {
            return searchTerm
                ? products.filter(p => p.name.toLowerCase().includes(searchTerm))
                : products;
        }

        static filterBySize(products, size) {
            if (!size || size === 'all') return products;
            return products.filter(p => Array.isArray(p.sizes) && p.sizes.includes(size));
        }

        static filterByColor(products, color) {
            if (!color || color === 'all') return products;
            return products.filter(p => Array.isArray(p.colors) && p.colors.includes(color));
        }

        static sortProducts(products, sortType) {
            const sorted = [...products];
            switch (sortType) {
                case 'price-asc':
                    return sorted.sort((a, b) => a.price - b.price);
                case 'price-desc':
                    return sorted.sort((a, b) => b.price - a.price);
                default:
                    return sorted.sort((a, b) => a.id - b.id);
            }
        }

        static getFilteredProducts(products, state) {
            let filtered = this.filterByCategory(products, state.currentCategory);
            filtered = this.filterBySearch(filtered, state.currentSearch);
            filtered = this.filterBySize(filtered, state.currentSize);
            filtered = this.filterByColor(filtered, state.currentColor);
            filtered = this.sortProducts(filtered, state.currentSort);
            return filtered;
        }

        static findById(productId) {
            return PRODUCTS.find(p => p.id === productId);
        }
    }

    // Presentation - Render Products
    function renderProducts() {
        DOM.productGrid.innerHTML = '';

        const filteredProducts = ProductService.getFilteredProducts(PRODUCTS, state);

        if (filteredProducts.length === 0) {
            showNoProductsMessage();
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = createProductCard(product);
            DOM.productGrid.appendChild(productCard);
        });

        attachAddToCartListeners();
    }

    function showNoProductsMessage() {
        DOM.productGrid.innerHTML = '<p class="col-12 text-center">No se encontraron productos.</p>';
    }

    function createProductCard(product) {
        const col = document.createElement('div');
        col.className = 'col';
        col.innerHTML = `
            <div class="card h-100">
                <img src="${product.image}" alt="${product.name}" class="card-img-top">
                <div class="card-body p-2 d-flex flex-column">
                    <h6 class="card-title mb-1 text-truncate" title="${product.name}">${product.name}</h6>
                    <p class="card-text text-danger fw-bold mb-1">S/. ${product.price.toFixed(2)}</p>
                    <p class="mb-1 small text-muted">Tallas: ${Array.isArray(product.sizes) ? product.sizes.join(', ') : '-'}</p>
                    <p class="mb-2 small text-muted">Colores: ${Array.isArray(product.colors) ? product.colors.join(', ') : '-'}</p>
                    <button class="btn btn-dark btn-sm mt-auto add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        return col;
    }

    function attachAddToCartListeners() {
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
    }

    function handleAddToCart(e) {
        const productId = parseInt(e.currentTarget.dataset.id);
        const product = ProductService.findById(productId);

        if (product) {
            cart.addItem(product);
            Toast.show(`${product.name} agregado al carrito`, 'success');
        }
    }

    // Initialize
    function init() {
        renderCategories();
        setupCategoryFilters();
        setupSizeFilters();
        setupColorFilters();
        renderProducts();
    }

    init();
});
