/**
 * Shopping Cart - Domain Layer
 * Manages cart operations with Clean Architecture principles
 */

// Domain - Cart Entity
class CartItem {
    constructor(product, quantity = 1) {
        this.id = product.id;
        this.name = product.name;
        this.price = product.price;
        this.image = product.image;
        this.categoryId = product.categoryId;
        this.quantity = quantity;
        this.selectedSize = product.selectedSize || null;
    }

    getTotalPrice() {
        return this.price * this.quantity;
    }

    incrementQuantity() {
        this.quantity++;
    }

    decrementQuantity() {
        if (this.quantity > 0) {
            this.quantity--;
        }
    }

    setQuantity(newQuantity) {
        if (newQuantity >= 0) {
            this.quantity = newQuantity;
        }
    }
}

// Infrastructure - Storage Service
class StorageService {
    static CART_KEY = 'cart';

    static save(items) {
        try {
            const serialized = JSON.stringify(items);
            localStorage.setItem(this.CART_KEY, serialized);
            return true;
        } catch (error) {
            console.error('Error saving cart:', error);
            return false;
        }
    }

    static load() {
        try {
            const serialized = localStorage.getItem(this.CART_KEY);
            return serialized ? JSON.parse(serialized) : [];
        } catch (error) {
            console.error('Error loading cart:', error);
            return [];
        }
    }

    static clear() {
        try {
            localStorage.removeItem(this.CART_KEY);
            return true;
        } catch (error) {
            console.error('Error clearing cart:', error);
            return false;
        }
    }
}

// Application - Cart Service
class Cart {
    constructor() {
        this.items = this.loadItems();
    }

    // Private Methods
    loadItems() {
        return StorageService.load();
    }

    saveItems() {
        StorageService.save(this.items);
        this.notifyUpdate();
    }

    findItemById(productId) {
        return this.items.find(item => item.id === productId);
    }

    findItemIndex(productId) {
        return this.items.findIndex(item => item.id === productId);
    }

    notifyUpdate() {
        const event = new CustomEvent('cart-updated', {
            detail: {
                count: this.getCount(),
                total: this.getTotal(),
                items: this.items
            }
        });
        window.dispatchEvent(event);
    }

    // Public Methods - Commands
    addItem(product) {
        const existingItem = this.findItemById(product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const newItem = new CartItem(product);
            this.items.push(newItem);
        }

        this.saveItems();
    }

    removeItem(productId) {
        const index = this.findItemIndex(productId);

        if (index !== -1) {
            this.items.splice(index, 1);
            this.saveItems();
        }
    }

    updateQuantity(productId, newQuantity) {
        const item = this.findItemById(productId);

        if (item) {
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveItems();
            }
        }
    }

    clear() {
        this.items = [];
        StorageService.clear();
        this.notifyUpdate();
    }

    // Public Methods - Queries
    getItems() {
        return [...this.items];
    }

    getCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount(productId) {
        const item = this.findItemById(productId);
        return item ? item.quantity : 0;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    hasItem(productId) {
        return this.findItemById(productId) !== undefined;
    }
}

// Global Cart Instance
const cart = new Cart();
