// Krisik Bazar Frontend JavaScript - Django Integration
let currentUser = null;
let userProducts = [];
let allProducts = [];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Krisik Bazar app initializing...');
    
    // Set up event listeners
    setupEventListeners();
    // Initialize filters
    initializeCategoryFilter();
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Load products if on products page
    if (document.getElementById('products-page').classList.contains('active')) {
        loadProducts();
    }
    
    // Check add product access
    checkAddProductAccess();
    
    console.log('Krisik Bazar app initialized successfully!');
});

// Set up all event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageName = this.getAttribute('data-page');
            showPage(pageName);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Auth buttons
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            showPage('login');
        });
    }
    
    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            showPage('register');
        });
    }
    
    // Hero buttons on homepage
    const heroBrowseBtn = document.getElementById('hero-browse-btn');
    if (heroBrowseBtn) {
        heroBrowseBtn.addEventListener('click', function() {
            showPage('products');
        });
    }
    
    const heroAddBtn = document.getElementById('hero-add-btn');
    if (heroAddBtn) {
        heroAddBtn.addEventListener('click', function() {
            showPage('add-product');
            checkAddProductAccess();
        });
    }
    
    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const addProductForm = document.getElementById('add-product-form');
    const contactForm = document.getElementById('contact-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContact);
    }
    
    // Search functionality
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                searchProducts(query);
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    searchProducts(query);
                }
            }
        });
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const category = this.value;
            filterProductsByCategory(category);
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Modal close button
    const closeModalBtn = document.getElementById('close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            document.getElementById('product-modal').classList.add('hidden');
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.add('hidden');
            }
        });
    }
}

// Show specific page and hide others
function showPage(pageName) {
    console.log(`Showing page: ${pageName}`);
    
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    
    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // Show selected page
    const targetPage = document.getElementById(`${pageName}-page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
        targetPage.classList.add('active');
        
        // Add active class to corresponding nav link
        const activeLink = document.querySelector(`[data-page="${pageName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Load page-specific content
        switch(pageName) {
            case 'products':
                initializeCategoryFilter();
                loadProducts();
                break;
            case 'add-product':
                checkAddProductAccess();
                break;
        }
    } else {
        console.error(`Page not found: ${pageName}-page`);
    }
}

// Check authentication status
function checkAuthStatus() {
    // Migrate old key to new branding if present
    const oldUserKey = localStorage.getItem('merobajar_user');
    if (oldUserKey && !localStorage.getItem('krisik_bazar_user')) {
        localStorage.setItem('krisik_bazar_user', oldUserKey);
        localStorage.removeItem('merobajar_user');
    }
    const user = localStorage.getItem('krisik_bazar_user');
    if (user) {
        try {
            currentUser = JSON.parse(user);
            updateAuthUI(true);
            loadUserProducts();
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('merobajar_user');
            updateAuthUI(false);
        }
    } else {
        updateAuthUI(false);
    }
}

// Update UI based on authentication status
function updateAuthUI(isLoggedIn) {
    const authButtons = document.getElementById('auth-buttons');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    
    if (isLoggedIn && currentUser) {
        if (authButtons) authButtons.classList.add('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            if (userName) userName.textContent = currentUser.name || currentUser.email;
        }
    } else {
        if (authButtons) authButtons.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields', true);
        return;
    }
    
    try {
        // For demo purposes, simulate login
        // In real app, this would be an API call
        const user = {
            id: Date.now(),
            email: email,
            name: email.split('@')[0],
            token: 'demo_token_' + Date.now()
        };
        
        currentUser = user;
        localStorage.setItem('krisik_bazar_user', JSON.stringify(user));
        
        updateAuthUI(true);
        showToast('Login successful!', false);
        
        // Redirect to home page
        showPage('home');
        
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login failed. Please try again.', true);
    }
}

// Handle registration form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    if (!name || !email || !password) {
        showToast('Please fill in all fields', true);
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', true);
        return;
    }
    
    try {
        // For demo purposes, simulate registration
        // In real app, this would be an API call
        const user = {
            id: Date.now(),
            name: name,
            email: email,
            token: 'demo_token_' + Date.now()
        };
        
        currentUser = user;
        localStorage.setItem('krisik_bazar_user', JSON.stringify(user));
        
        updateAuthUI(true);
        showToast('Registration successful! Welcome to MeroBajar!', false);
        
        // Redirect to home page
        showPage('home');
        
    } catch (error) {
        console.error('Registration error:', error);
        showToast('Registration failed. Please try again.', true);
    }
}

// Handle logout
function handleLogout() {
    currentUser = null;
    userProducts = [];
    localStorage.removeItem('krisik_bazar_user');
    updateAuthUI(false);
    showToast('Logged out successfully', false);
    showPage('home');
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Load products from backend
async function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    if (!productsGrid) return;
    
    try {
        if (loadingSpinner) loadingSpinner.classList.remove('hidden');
        
        // Load from Django backend
        const response = await fetch('/api/prices/');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const prices = await response.json();
        
        // Normalize backend prices to product-like objects
        const backendProducts = (prices || []).map(price => ({
            id: price.id,
            name: price.crop_name,
            name_nepali: price.crop_name_nepali || '',
            price_per_kg: price.price_per_kg,
            market: price.market_name,
            date: price.date
        }));
        
        // Load user products from storage
        loadUserProducts();
        
        // Merge backend and user products
        allProducts = [...backendProducts, ...userProducts];
        
        // Display products
        displayProducts(allProducts, productsGrid);
        
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', true);
        
        // Fallback to demo data
        const demoProducts = [
            { id: 1, name: 'Rice', name_nepali: 'चामल', price_per_kg: 45.00, market: 'Kathmandu Market' },
            { id: 2, name: 'Wheat', name_nepali: 'गहुँ', price_per_kg: 38.50, market: 'Pokhara Market' },
            { id: 3, name: 'Corn', name_nepali: 'मकै', price_per_kg: 32.00, market: 'Biratnagar Market' },
            { id: 4, name: 'Potato', name_nepali: 'आलु', price_per_kg: 25.00, market: 'Kathmandu Market' },
            { id: 5, name: 'Tomato', name_nepali: 'गोलभेडा', price_per_kg: 60.00, market: 'Pokhara Market' },
            { id: 6, name: 'Onion', name_nepali: 'प्याज', price_per_kg: 40.00, market: 'Biratnagar Market' }
        ];
        
        allProducts = [...demoProducts, ...userProducts];
        displayProducts(allProducts, productsGrid);
    } finally {
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
    }
}

// Display products in grid
function displayProducts(products, container) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!products || products.length === 0) {
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">No products found</div>';
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Create product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300';
    
    card.innerHTML = `
        <div class="p-6">
            <div class="flex justify-between items-start mb-4">
                <h3 class="text-xl font-semibold text-gray-800">${product.name}</h3>
                ${product.name_nepali ? `<span class="text-sm text-gray-600">${product.name_nepali}</span>` : ''}
            </div>
            
            <div class="space-y-3">
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Price per kg:</span>
                    <span class="price-tag">₹${product.price_per_kg || 'N/A'}</span>
                </div>
                
                ${product.market ? `
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Market:</span>
                    <span class="text-gray-800 font-medium">${product.market}</span>
                </div>
                ` : ''}
                
                ${product.date ? `
                <div class="flex justify-between items-center">
                    <span class="text-gray-600">Date:</span>
                    <span class="text-gray-800">${formatDate(product.date)}</span>
                </div>
                ` : ''}
            </div>
            
            <div class="mt-6 flex space-x-3">
                <button onclick="showProductModal(${product.id})" 
                        class="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                    View Details
                </button>
                
                ${currentUser ? `
                <button onclick="deleteProduct(${product.id})" 
                        class="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
                    Delete
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    return card;
}

// Show product modal
function showProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    if (!modal || !modalTitle || !modalContent) return;
    
    // Find product data
    const product = findProductById(productId);
    if (!product) {
        showToast('Product not found', true);
        return;
    }
    
    // Set modal content
    modalTitle.textContent = product.name;
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700">Product Name</label>
                    <p class="text-gray-900">${product.name}</p>
                </div>
                ${product.name_nepali ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700"> Nepali Name</label>
                    <p class="text-gray-900">${product.name_nepali}</p>
                </div>
                ` : ''}
                <div>
                    <label class="block text-sm font-medium text-gray-700">Price per kg</label>
                    <p class="text-gray-900">₹${product.price_per_kg || 'N/A'}</p>
                </div>
                ${product.market ? `
                <div>
                    <label class="block text-sm font-medium text-gray-700">Market</label>
                    <p class="text-gray-900">${product.market}</p>
                </div>
                ` : ''}
            </div>
            
            ${product.description ? `
            <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <p class="text-gray-900">${product.description}</p>
            </div>
            ` : ''}
            
            <div class="flex justify-end space-x-3 pt-4">
                <button onclick="closeProductModal()" 
                        class="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors">
                    Close
                </button>
                ${currentUser ? `
                <button onclick="editProduct(${product.id})" 
                        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Edit
                </button>
                ` : ''}
            </div>
        </div>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
}

// Close product modal
function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Find product by ID
function findProductById(productId) {
    // Search in user products first
    const userProduct = userProducts.find(p => p.id === productId);
    if (userProduct) return userProduct;
    
    // Search in merged list
    const backendProduct = (allProducts || []).find(p => p.id === productId);
    return backendProduct || null;
}

// Search products
function searchProducts(query) {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Filter merged products
    const filteredProducts = (allProducts || []).filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        (product.name_nepali && product.name_nepali.toLowerCase().includes(query.toLowerCase()))
    );
    
    displayProducts(filteredProducts, productsGrid);
    
    if (filteredProducts.length === 0) {
        showToast('No products found matching your search', false);
    }
}

// Filter products by category
function filterProductsByCategory(category) {
    if (!category) {
        loadProducts();
        return;
    }
    
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    // Filter merged products
    const filteredProducts = (allProducts || []).filter(product => 
        product.category === category
    );
    
    displayProducts(filteredProducts, productsGrid);
}

// Handle add product form submission
async function handleAddProduct(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('Please login to add a product', true);
        return;
    }
    
    const name = document.getElementById('product-name').value.trim();
    const category = document.getElementById('product-category').value;
    const quantity = parseFloat(document.getElementById('product-quantity').value);
    const price = parseFloat(document.getElementById('product-price').value);
    const description = document.getElementById('product-description').value.trim();
    const imageFile = document.getElementById('product-image').files[0];
    
    // Validation
    if (!name || !category || !quantity || !price || !description) {
        showToast('Please fill in all required fields', true);
        return;
    }
    
    if (quantity <= 0) {
        showToast('Quantity must be greater than 0', true);
        return;
    }
    
    if (price <= 0) {
        showToast('Price must be greater than 0', true);
        return;
    }
    
    try {
        // Create new product
        const newProduct = {
            id: Date.now(),
            name: name,
            category: category,
            quantity: quantity,
            price_per_kg: price,
            description: description,
            seller: currentUser.name || currentUser.email,
            date: new Date().toISOString(),
            isUserProduct: true
        };
        
        // Add to user products
        userProducts.push(newProduct);
        saveUserProducts();
        
        // Show success message
        showToast('Product added successfully!', false);
        
        // Clear form
        document.getElementById('add-product-form').reset();
        
        // Redirect to products page
        showPage('products');
        
    } catch (error) {
        console.error('Error adding product:', error);
        showToast('Failed to add product. Please try again.', true);
    }
}

// Delete product
function deleteProduct(productId) {
    if (!currentUser) {
        showToast('Please login to delete products', true);
        return;
    }
    
    if (confirm('Are you sure you want to delete this product?')) {
        // Remove from user products
        userProducts = userProducts.filter(p => p.id !== productId);
        saveUserProducts();
        
        showToast('Product deleted successfully', false);
        
        // Refresh products display
        if (document.getElementById('products-page').classList.contains('active')) {
            loadProducts();
        }
    }
}

// Edit product
function editProduct(productId) {
    // Implementation for editing products
    showToast('Edit functionality coming soon!', false);
}

// Load user products from localStorage
function loadUserProducts() {
    // Migrate old products key
    const oldProdKey = localStorage.getItem('merobajar_user_products');
    if (oldProdKey && !localStorage.getItem('krisik_bazar_user_products')) {
        localStorage.setItem('krisik_bazar_user_products', oldProdKey);
        localStorage.removeItem('merobajar_user_products');
    }
    const stored = localStorage.getItem('krisik_bazar_user_products');
    if (stored) {
        try {
            userProducts = JSON.parse(stored);
        } catch (e) {
            console.error('Error parsing user products:', e);
            userProducts = [];
        }
    }
}

// Save user products to localStorage
function saveUserProducts() {
    localStorage.setItem('krisik_bazar_user_products', JSON.stringify(userProducts));
}

// Check if user can add products
function checkAddProductAccess() {
    const loginRequired = document.getElementById('login-required');
    const addProductForm = document.getElementById('add-product-form');
    
    if (!currentUser) {
        if (loginRequired) loginRequired.classList.remove('hidden');
        if (addProductForm) addProductForm.classList.add('hidden');
    } else {
        if (loginRequired) loginRequired.classList.add('hidden');
        if (addProductForm) addProductForm.classList.remove('hidden');
    }
}

// Handle contact form submission
function handleContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();
    
    if (!name || !email || !message) {
        showToast('Please fill in all fields', true);
        return;
    }
    
    if (!validateEmail(email)) {
        showToast('Please enter a valid email address', true);
        return;
    }
    
    // For demo purposes, show success message
    // In real app, this would be an API call
    showToast('Message sent successfully! We\'ll get back to you soon.', false);
    
    // Clear form
    document.getElementById('contact-form').reset();
}

// Show toast notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');
    
    if (!toast || !toastMessage || !toastIcon) return;
    
    // Set message and icon
    toastMessage.textContent = message;
    toastIcon.className = isError ? 'fas fa-exclamation-circle text-red-500' : 'fas fa-check-circle text-green-500';
    
    // Show toast
    toast.classList.remove('hidden');
    toast.classList.remove('translate-x-full');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        hideToast();
    }, 5000);
}

// Hide toast notification
function hideToast() {
    const toast = document.getElementById('toast');
    if (toast) {
        toast.classList.add('translate-x-full');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 300);
    }
}

// Format date for display
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (e) {
        return 'Invalid Date';
    }
}

// Utility function to get CSRF token
function getCSRFToken() {
    const token = document.querySelector('[name=csrfmiddlewaretoken]');
    return token ? token.value : '';
}

// Handle API errors
function handleAPIError(error, fallbackMessage = 'An error occurred') {
    console.error('API Error:', error);
    
    if (error.response) {
        // Server responded with error status
        showToast(`Error: ${error.response.data?.message || fallbackMessage}`, true);
    } else if (error.request) {
        // Request was made but no response received
        showToast('Network error. Please check your connection.', true);
    } else {
        // Something else happened
        showToast(fallbackMessage, true);
    }
}

// Initialize category filter options
function initializeCategoryFilter() {
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) return;
    
    const categories = [
        { value: 'vegetables', label: 'Vegetables' },
        { value: 'fruits', label: 'Fruits' },
        { value: 'grains', label: 'Grains' },
        { value: 'dairy', label: 'Dairy Products' },
        { value: 'spices', label: 'Spices' },
        { value: 'equipment', label: 'Equipment' },
        { value: 'fertilizers', label: 'Fertilizers' },
        { value: 'other', label: 'Other' }
    ];
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.label;
        categoryFilter.appendChild(option);
    });

    // Additional JavaScript for enhanced UI interactions
    document.addEventListener('DOMContentLoaded', function() {
        // Update user avatar with initials
        function updateUserAvatar() {
            const user = JSON.parse(localStorage.getItem('krisik_bazar_user') || '{}');
            if (user.name) {
                const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
                document.getElementById('user-avatar').textContent = initials;
                document.getElementById('mobile-user-avatar').textContent = initials;
            }
        }
        
        // Initialize user avatar
        updateUserAvatar();
        
        // Mobile menu auth buttons
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileRegisterBtn = document.getElementById('mobile-register-btn');
        const mobileLogoutBtn = document.getElementById('mobile-logout-btn');
        
        if (mobileLoginBtn) {
            mobileLoginBtn.addEventListener('click', function() {
                showPage('login');
                document.getElementById('mobile-menu').classList.add('hidden');
            });
        }
        
        if (mobileRegisterBtn) {
            mobileRegisterBtn.addEventListener('click', function() {
                showPage('register');
                document.getElementById('mobile-menu').classList.add('hidden');
            });
        }
        
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', function() {
                handleLogout();
                document.getElementById('mobile-menu').classList.add('hidden');
            });
        }
        
        // Update mobile auth UI
        function updateMobileAuthUI(isLoggedIn) {
            const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
            const mobileUserMenu = document.getElementById('mobile-user-menu');
            const mobileUserName = document.getElementById('mobile-user-name');
            
            if (isLoggedIn && currentUser) {
                if (mobileAuthButtons) mobileAuthButtons.classList.add('hidden');
                if (mobileUserMenu) {
                    mobileUserMenu.classList.remove('hidden');
                    if (mobileUserName) mobileUserName.textContent = currentUser.name || currentUser.email;
                }
            } else {
                if (mobileAuthButtons) mobileAuthButtons.classList.remove('hidden');
                if (mobileUserMenu) mobileUserMenu.classList.add('hidden');
            }
        }
        
        // Override the updateAuthUI function to include mobile
        const originalUpdateAuthUI = updateAuthUI;
        window.updateAuthUI = function(isLoggedIn) {
            originalUpdateAuthUI(isLoggedIn);
            updateMobileAuthUI(isLoggedIn);
            updateUserAvatar();
            
            // Show/hide FAB based on auth status
            const fab = document.querySelector('.fab');
            if (fab) {
                if (isLoggedIn) {
                    fab.classList.remove('hidden');
                } else {
                    fab.classList.add('hidden');
                }
            }
        };
        
        // Initialize FAB visibility
        if (currentUser) {
            document.querySelector('.fab')?.classList.remove('hidden');
        }
        
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    });
}

// Export functions for global access
window.showPage = showPage;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.searchProducts = searchProducts;
window.filterProductsByCategory = filterProductsByCategory;


// Export functions for global access
window.showPage = showPage;
window.showProductModal = showProductModal;
window.closeProductModal = closeProductModal;
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.searchProducts = searchProducts;
window.filterProductsByCategory = filterProductsByCategory;