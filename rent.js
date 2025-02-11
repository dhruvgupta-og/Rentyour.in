async function checkServer() {
    try {
        const response = await fetch('http://localhost:3000/api/onboard-retailer', {
            method: 'GET'
        });
        return true;
    } catch (error) {
        alert('Server is not running. Please start the server first.');
        return false;
    }
}

function onboardRetailer() {
    // Check server first
    checkServer().then(isRunning => {
        if (!isRunning) return;
        
        // Create modal HTML
        const modalHTML = `
            <div id="retailerModal" class="modal">
                <div class="modal-content">
                    <span class="close">&times;</span>
                    <h2>Retailer Onboarding</h2>
                    <form id="retailerForm">
                        <input type="text" id="name" placeholder="Your Name" required>
                        <input type="email" id="email" placeholder="Email" required>
                        <input type="tel" id="phone" placeholder="Phone Number" required>
                        <input type="text" id="shopName" placeholder="Shop Name" required>
                        <textarea id="address" placeholder="Shop Address" required></textarea>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        `;

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        const modal = document.getElementById('retailerModal');
        const closeBtn = document.getElementsByClassName('close')[0];
        const form = document.getElementById('retailerForm');

        modal.style.display = 'block';

        closeBtn.onclick = () => {
            modal.style.display = 'none';
        }

        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                shopName: document.getElementById('shopName').value,
                address: document.getElementById('address').value
            };

            try {
                console.log('Sending data:', formData);
                
                const response = await fetch('http://localhost:3000/api/onboard-retailer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();
                
                if (response.ok) {
                    alert('Thank you for registering! We will contact you shortly.');
                    modal.style.display = 'none';
                    form.reset();
                } else {
                    alert(`Error: ${data.error || 'Something went wrong!'}`);
                }
            } catch (error) {
                console.error('Submission error:', error);
                alert('Error submitting form. Please check if the server is running and try again.');
            }
        };
    });
}

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        alert(`Thank you, ${name}! Your message has been sent.`);
        document.getElementById('contactForm').reset();
    } else {
        alert("Please fill out all fields.");
    }
});

// Header scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Copy coupon code functionality
document.querySelectorAll('.copy-code').forEach(button => {
    button.addEventListener('click', function() {
        const code = this.previousElementSibling.textContent.split(': ')[1];
        navigator.clipboard.writeText(code);
        this.textContent = 'Copied!';
        setTimeout(() => {
            this.textContent = 'Copy Code';
        }, 2000);
    });
});

// Size guide video modal
document.querySelector('.measurement-video').addEventListener('click', function() {
    // Add your video modal logic here
    alert('Measurement guide video will play here!');
});

// Login Modal Functions
function showLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'block';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    modal.style.display = 'none';
}

function switchTab(type) {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // You can add logic here to switch form fields based on user type
    const loginForm = document.getElementById('loginForm');
    if (type === 'retailer') {
        // Add retailer specific fields if needed
    }
}

function showForgotPassword() {
    alert('Reset password link will be sent to your email');
    // Add your forgot password logic here
}

function showSignupModal() {
    closeLoginModal();
    const modal = document.getElementById('signupModal');
    modal.style.display = 'block';
}

function closeSignupModal() {
    const modal = document.getElementById('signupModal');
    modal.style.display = 'none';
}

function showLoginFromSignup() {
    closeSignupModal();
    showLoginModal();
}

function switchSignupTab(type) {
    const tabs = document.querySelectorAll('.signup-tabs .tab-btn');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    const form = document.getElementById('signupForm');
    if (type === 'retailer') {
        // Add retailer specific fields
        if (!document.getElementById('shopDetails')) {
            const retailerFields = `
                <div class="form-group" id="shopDetails">
                    <i class="fas fa-store"></i>
                    <input type="text" id="shopName" placeholder="Shop Name" required>
                </div>
                <div class="form-group">
                    <i class="fas fa-map-marker-alt"></i>
                    <input type="text" id="shopAddress" placeholder="Shop Address" required>
                </div>
            `;
            form.insertBefore(
                document.createRange().createContextualFragment(retailerFields),
                document.querySelector('.terms-privacy')
            );
        }
    } else {
        // Remove retailer specific fields
        const shopDetails = document.getElementById('shopDetails');
        if (shopDetails) {
            shopDetails.nextElementSibling.remove();
            shopDetails.remove();
        }
    }
}

// Password strength checker
document.getElementById('signupPassword').addEventListener('input', function(e) {
    const password = e.target.value;
    const strengthBar = document.querySelector('.password-strength');
    
    // Simple password strength logic
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    const isLongEnough = password.length >= 8;
    
    const strength = [hasLower, hasUpper, hasNumber, hasSpecial, isLongEnough]
        .filter(Boolean).length;
    
    strengthBar.className = 'password-strength';
    if (strength < 3) {
        strengthBar.classList.add('weak');
    } else if (strength < 4) {
        strengthBar.classList.add('medium');
    } else {
        strengthBar.classList.add('strong');
    }
});

// Excel Export Functionality
function exportToExcel(data, fileName) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    
    // Auto-size columns
    const colWidths = [];
    for (let i = 0; i < Object.keys(data[0]).length; i++) {
        colWidths[i] = { wch: 15 };  // Set default width
    }
    ws['!cols'] = colWidths;
    
    // Save file
    XLSX.writeFile(wb, `${fileName}.xlsx`);
}

// Modify your signup form submission to include Excel export
document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    const formData = {
        name: document.getElementById('signupName').value,
        email: document.getElementById('signupEmail').value,
        phone: document.getElementById('signupPhone').value,
        userType: document.querySelector('.signup-tabs .active').textContent.toLowerCase(),
        registrationDate: new Date().toLocaleString(),
        status: 'Active'
    };
    
    if (formData.userType === 'retailer') {
        formData.shopName = document.getElementById('shopName').value;
        formData.shopAddress = document.getElementById('shopAddress').value;
    }
    
    try {
        // Get existing users from localStorage or initialize empty array
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Add new user
        users.push(formData);
        
        // Save to localStorage
        localStorage.setItem('users', JSON.stringify(users));
        
        // Export to Excel
        exportToExcel(users, 'RentYour_Users');
        
        alert('Account created successfully! User data exported to Excel.');
        closeSignupModal();
        showLoginModal();
    } catch (error) {
        alert('Signup failed. Please try again.');
        console.error(error);
    }
});

// Update login form submission to simpler version
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const userType = document.querySelector('.login-tabs .active').textContent;
    
    try {
        // Add your login logic here
        console.log('Login attempt:', { email, userType });
        showToast('Login successful!', 'success');
        closeLoginModal();
    } catch (error) {
        showToast('Login failed. Please try again.', 'error');
    }
});

// Social Login Handlers
document.querySelector('.google-btn').addEventListener('click', function() {
    // Add Google login logic here
    console.log('Google login clicked');
});

document.querySelector('.facebook-btn').addEventListener('click', function() {
    // Add Facebook login logic here
    console.log('Facebook login clicked');
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('loginModal');
    if (event.target === modal) {
        closeLoginModal();
    }
    const signupModal = document.getElementById('signupModal');
    if (event.target === signupModal) {
        closeSignupModal();
    }
});

// Add loading animation
window.addEventListener('load', function() {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
});

// Add number counter animation
function animateNumbers() {
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 100;
        const timer = setInterval(() => {
            current += increment;
            stat.textContent = Math.floor(current) + '+';
            if (current >= target) {
                stat.textContent = target + '+';
                clearInterval(timer);
            }
        }, 10);
    });
}

// Run animation when stats are in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumbers();
            observer.unobserve(entry.target);
        }
    });
});

document.querySelectorAll('.hero-stats').forEach(stats => {
    observer.observe(stats);
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Parallax Scrolling Effect
window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.hero-content');
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(window.pageYOffset * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
});

// Intersection Observer for Animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.service-item, .product-card, .review-card').forEach(item => {
    animateOnScroll.observe(item);
});

// Dynamic Background Color Change on Scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = (scrolled / maxScroll) * 100;
    
    document.body.style.setProperty('--scroll-progress', `${scrollProgress}%`);
});

// Advanced Form Validation
function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            isValid = false;
        } else {
            clearError(input);
            
            if (input.type === 'email' && !isValidEmail(input.value)) {
                showError(input, 'Please enter a valid email');
                isValid = false;
            }
            
            if (input.type === 'tel' && !isValidPhone(input.value)) {
                showError(input, 'Please enter a valid phone number');
                isValid = false;
            }
        }
    });

    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message') || 
                 document.createElement('div');
    error.className = 'error-message';
    error.textContent = message;
    
    if (!formGroup.querySelector('.error-message')) {
        formGroup.appendChild(error);
    }
    
    input.classList.add('error');
    
    // Shake Animation
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 500);
}

function clearError(input) {
    const formGroup = input.closest('.form-group');
    const error = formGroup.querySelector('.error-message');
    if (error) {
        error.remove();
    }
    input.classList.remove('error');
}

// Loading State Management
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = `
            <span class="spinner"></span>
            Loading...
        `;
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText;
    }
}

// Image Lazy Loading with Blur Effect
document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    img.style.filter = 'blur(5px)';
    img.onload = function() {
        img.style.filter = 'none';
        img.style.transition = 'filter 0.3s ease';
    }
});

// Toast Notification System
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    });
}

// Quick View Functionality
function showQuickView(productId) {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'block';
    
    // Fetch product details and update modal
    // This is a placeholder for actual API call
    updateQuickViewModal({
        title: 'Designer Lehenga',
        rentPrice: '₹2000/day',
        originalPrice: '₹25,000',
        description: 'Beautiful designer lehenga perfect for weddings and special occasions.',
        images: ['lehenga1.jpg', 'lehenga2.jpg', 'lehenga3.jpg']
    });
}

function updateQuickViewModal(product) {
    const modal = document.querySelector('.product-quick-view');
    modal.querySelector('.product-title').textContent = product.title;
    modal.querySelector('.rent-price').textContent = product.rentPrice;
    modal.querySelector('.original-price').textContent = product.originalPrice;
    // Add more updates as needed
}

// Enhanced Cart Functionality
let cartItems = [];
let cartTotal = 0;

function addToCart(product) {
    // Check if product already exists
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Item quantity updated!', 'info');
    } else {
        cartItems.push({
            ...product,
            quantity: 1
        });
        showToast('Item added to cart!', 'success');
    }
    
    updateCart();
    saveCartToLocal();
}

function removeFromCart(productId) {
    cartItems = cartItems.filter(item => item.id !== productId);
    updateCart();
    saveCartToLocal();
    showToast('Item removed from cart!', 'warning');
}

function updateQuantity(productId, change) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        updateCart();
        saveCartToLocal();
    }
}

function updateCart() {
    updateCartCount();
    updateCartPreview();
    updateCartTotal();
}

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Add bounce animation
    cartCount.classList.remove('bounce');
    void cartCount.offsetWidth; // Trigger reflow
    cartCount.classList.add('bounce');
}

function updateCartPreview() {
    const cartItemsContainer = document.querySelector('.cart-items');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.title}">
            <div class="item-details">
                <h4>${item.title}</h4>
                <p>${item.rentPrice}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart(${item.id})" class="remove-item">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
}

function updateCartTotal() {
    cartTotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.rentPrice.replace(/[^0-9.-]+/g, ''));
        return total + (price * item.quantity);
    }, 0);
    
    document.querySelector('.total-amount').textContent = 
        `₹${cartTotal.toLocaleString('en-IN')}`;
}

function saveCartToLocal() {
    localStorage.setItem('cart', JSON.stringify(cartItems));
}

function loadCartFromLocal() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCart();
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', loadCartFromLocal);

// Toggle cart preview
document.querySelector('.floating-cart').addEventListener('click', function(e) {
    const preview = this.querySelector('.cart-preview');
    preview.classList.toggle('show');
    e.stopPropagation();
});

// Close cart preview when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.cart-preview')) {
        document.querySelector('.cart-preview').classList.remove('show');
    }
});

// Mobile Menu Toggle
function toggleMenu() {
    const nav = document.querySelector('nav ul');
    const menuIcon = document.querySelector('.menu-toggle i');
    
    nav.classList.toggle('active');
    menuIcon.classList.toggle('fa-bars');
    menuIcon.classList.toggle('fa-times');
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const nav = document.querySelector('nav ul');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
        toggleMenu();
    }
});

// Close menu when clicking a link
document.querySelectorAll('nav ul li a').forEach(link => {
    link.addEventListener('click', () => {
        const nav = document.querySelector('nav ul');
        if (nav.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Add Dark Mode Toggle
function addDarkModeToggle() {
    const header = document.querySelector('nav ul');
    const darkModeButton = document.createElement('li');
    darkModeButton.innerHTML = `
        <button onclick="toggleDarkMode()" class="dark-mode-btn">
            <i class="fas fa-moon"></i>
        </button>
    `;
    header.appendChild(darkModeButton);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const icon = document.querySelector('.dark-mode-btn i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Check dark mode preference on load
document.addEventListener('DOMContentLoaded', function() {
    addDarkModeToggle();
    if (localStorage.getItem('darkMode') === 'true') {
        toggleDarkMode();
    }
});

// Wishlist Functionality
let wishlistItems = [];

function toggleWishlist(productId, productName) {
    const index = wishlistItems.indexOf(productId);
    if (index === -1) {
        wishlistItems.push(productId);
        showToast(`${productName} added to wishlist!`, 'success');
    } else {
        wishlistItems.splice(index, 1);
        showToast(`${productName} removed from wishlist!`, 'info');
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    updateWishlistUI();
}

function updateWishlistUI() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const productId = btn.dataset.productId;
        const icon = btn.querySelector('i');
        if (wishlistItems.includes(productId)) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btn.classList.add('active');
        } else {
            icon.classList.add('far');
            icon.classList.remove('fas');
            btn.classList.remove('active');
        }
    });
}

// Share Functionality
function shareProduct(productName, productUrl) {
    if (navigator.share) {
        navigator.share({
            title: productName,
            text: `Check out this amazing ${productName} on RentYour.in!`,
            url: productUrl
        })
        .then(() => showToast('Shared successfully!', 'success'))
        .catch((error) => console.log('Error sharing:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
            `Check out this amazing ${productName} on RentYour.in! ${productUrl}`
        )}`;
        window.open(shareUrl, '_blank');
    }
}

// Virtual Try-On Functionality
let stream = null;
let capturedImage = null;

async function openVirtualTryOn(productImage) {
    const modal = document.getElementById('virtualTryOnModal');
    const video = document.getElementById('webcamVideo');
    const productOverlay = document.getElementById('productOverlay');
    
    modal.style.display = 'block';
    productOverlay.src = productImage;
    
    try {
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" } 
        });
        video.srcObject = stream;
    } catch (error) {
        showToast('Unable to access camera', 'error');
        console.error('Camera error:', error);
    }
}

function capturePhoto() {
    const video = document.getElementById('webcamVideo');
    const canvas = document.getElementById('tryOnCanvas');
    const productOverlay = document.getElementById('productOverlay');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw product overlay
    const overlayWidth = canvas.width * 0.5;
    const overlayHeight = (overlayWidth * productOverlay.height) / productOverlay.width;
    const x = (canvas.width - overlayWidth) / 2;
    const y = (canvas.height - overlayHeight) / 2;
    
    ctx.drawImage(productOverlay, x, y, overlayWidth, overlayHeight);
    
    // Add watermark
    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText('RentYour.in', 20, canvas.height - 20);
    
    capturedImage = canvas.toDataURL('image/png');
    showToast('Photo captured!', 'success');
}

function downloadPhoto() {
    if (!capturedImage) {
        showToast('Capture a photo first!', 'warning');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'virtual-try-on.png';
    link.href = capturedImage;
    link.click();
}

// Clean up camera stream when modal closes
document.querySelector('#virtualTryOnModal .close').addEventListener('click', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    document.getElementById('virtualTryOnModal').style.display = 'none';
});

// Size Recommender System
let currentStep = 1;
const totalSteps = 3;

function openSizeRecommender() {
    const modal = document.getElementById('sizeRecommenderModal');
    modal.style.display = 'block';
    currentStep = 1;
    updateStepUI();
}

function updateStepUI() {
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    
    // Update indicators
    document.querySelectorAll('.indicator').forEach((ind, index) => {
        ind.classList.toggle('active', index + 1 <= currentStep);
    });
    
    // Update navigation buttons
    document.querySelector('.prev-step').disabled = currentStep === 1;
    const nextBtn = document.querySelector('.next-step');
    nextBtn.textContent = currentStep === totalSteps ? 'Finish' : 'Next';
}

function calculateSize() {
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bodyType = document.getElementById('bodyType').value;
    
    // Simple size calculation logic (can be made more sophisticated)
    let size = 'M';
    let measurements = {
        shoulder: 42,
        chest: 98,
        waist: 82,
        hip: 96
    };
    
    if (height < 165) size = 'S';
    else if (height > 180) size = 'L';
    
    if (weight < 60) size = 'S';
    else if (weight > 80) size = 'L';
    
    if (bodyType === 'athletic' || bodyType === 'curvy') {
        measurements.chest += 4;
        measurements.shoulder += 2;
    }
    
    return { size, measurements };
}

// Event Listeners
document.querySelector('.next-step').addEventListener('click', () => {
    if (currentStep === totalSteps) {
        document.getElementById('sizeRecommenderModal').style.display = 'none';
        return;
    }
    
    if (currentStep === 1) {
        const result = calculateSize();
        document.querySelector('.recommended-size').textContent = result.size;
        document.querySelectorAll('.size-stats span').forEach((span, index) => {
            const measurement = Object.values(result.measurements)[index];
            span.textContent = `${measurement} cm`;
        });
    }
    
    currentStep++;
    updateStepUI();
});

document.querySelector('.prev-step').addEventListener('click', () => {
    currentStep--;
    updateStepUI();
});

// Fit preference selection
document.querySelectorAll('.fit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.fit-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});
