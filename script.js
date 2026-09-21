// ===== NAVIGATION TOGGLE =====
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');
const navList = document.getElementById('navList');
const navClose = document.getElementById('navClose');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        nav.classList.add('active');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        nav.classList.remove('active');
    });
}

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== NAVBAR SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (header) {
        header.classList.toggle('scrolled', window.scrollY > 50);
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ===== TESTIMONIAL SLIDER =====
let currentTestimonial = 0;
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const testimonialDots = document.querySelectorAll('.testimonial-dot');

function showTestimonial(index) {
    if (!testimonialSlides.length || !testimonialDots.length) return;

    // Reset all slides and dots
    testimonialSlides.forEach(slide => slide.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));

    // Handle index bounds
    currentTestimonial = index;
    if (index >= testimonialSlides.length) currentTestimonial = 0;
    if (index < 0) currentTestimonial = testimonialSlides.length - 1;

    // Show current slide and dot
    testimonialSlides[currentTestimonial].classList.add('active');
    testimonialDots[currentTestimonial].classList.add('active');
}

// Auto-advance testimonials
let testimonialInterval;
function startTestimonialAuto() {
    testimonialInterval = setInterval(() => {
        showTestimonial(currentTestimonial + 1);
    }, 5000);
}

function stopTestimonialAuto() {
    clearInterval(testimonialInterval);
}

// Start auto-advance if testimonial section exists
if (testimonialSlides.length > 0 && testimonialDots.length > 0) {
    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopTestimonialAuto();
            showTestimonial(index);
            startTestimonialAuto();
        });
    });
    startTestimonialAuto();
}

// ===== CONTACT FORM SUBMISSION =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form data
        const formData = new FormData(this);
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const phone = this.querySelector('input[name="phone"]').value;
        const subject = this.querySelector('input[name="subject"]').value;
        const message = this.querySelector('textarea[name="message"]').value;

        // Simple validation
        if (!name || !email || !phone || !subject || !message) {
            showNotification('Please fill in all fields.', 'error');
            return;
        }

        // Show success message
        showNotification('Thank you! Your message has been sent successfully.', 'success');

        // Reset form
        this.reset();
    });
}

// ===== NOTIFICATION =====
function showNotification(message, type) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        min-width: 350px;
        padding: 16px 20px;
        border-radius: 12px;
        color: white;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        z-index: 3000;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        ${type === 'success' ? 'background: linear-gradient(135deg, #4caf50, #388e3c);' : 'background: linear-gradient(135deg, #f44336, #d32f2f);'}
        animation: slideIn 0.3s ease;
    `;

    // Append to body
    document.body.appendChild(notification);

    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        margin-left: auto;
    `;
    closeBtn.addEventListener('click', () => notification.remove());

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// ===== ANIMATED COUNTERS =====
function animateCounter(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const result = Math.floor(progress * (end - start) + start);
        element.textContent = result.toLocaleString();
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');

            // Animate stat counters
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const endValue = parseInt(stat.textContent);
                const isPlus = stat.textContent.includes('+');
                const isHours = stat.textContent.includes(':');
                animateCounter(stat, 0, endValue, 1500);
                if (isPlus) stat.textContent = stat.textContent;
                if (isHours) stat.textContent = '24/7';
            });

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe sections that have stat counters
document.addEventListener('DOMContentLoaded', () => {
    const sectionsToAnimate = document.querySelectorAll('.hero');
    sectionsToAnimate.forEach(section => observer.observe(section));
});

// ===== CATEGORY HOVER EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
});

// ===== FLOATING PHARMACY ICONS (Subtle background animation) =====
function createFloatingElements() {
    const elements = [
        { icon: '💊', count: 5, color: 'var(--secondary)' },
        { icon: '🩺', count: 3, color: 'var(--primary)' },
        { icon: '💉', count: 4, color: 'var(--accent)' },
        { icon: '🌿', count: 6, color: 'var(--secondary-dark)' }
    ];

    elements.forEach(set => {
        for (let i = 0; i < set.count; i++) {
            const el = document.createElement('div');
            el.className = 'floating-icon';
            el.textContent = set.icon;
            el.style.left = `${Math.random() * 100}%`;
            el.style.animationDelay = `${Math.random() * 8}s`;
            el.style.animationDuration = `${6 + Math.random() * 4}s`;
            el.style.opacity = `${0.3 + Math.random() * 0.3}`;
            el.style.fontSize = `${14 + Math.random() * 12}px`;
            document.body.appendChild(el);
        }
    });

    // Add floating styles
    const style = document.createElement('style');
    style.textContent = `
        .floating-icon {
            position: fixed;
            bottom: 10%;
            pointer-events: none;
            z-index: 0;
            user-select: none;
            animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(5deg); }
            50% { transform: translateY(-10px) rotate(0deg); }
            75% { transform: translateY(-25px) rotate(-5deg); }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createFloatingElements();
});

// ===== SCROLL REVEAL ANIMATIONS =====
const revealElements = document.querySelectorAll('.service-card, .category-card, .contact-item, .footer-brand');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    revealObserver.observe(el);
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav) {
        nav.classList.remove('active');
    }
});

// ===== LAZY LOADING PLACEHOLDER =====
// Replace placeholder images with actual gradient backgrounds when images load
function initImagePlaceholders() {
    const placeholders = document.querySelectorAll('.hero-image-box, .hero-image-overlay, .about-image-box, .pharmacist-placeholder');
    placeholders.forEach(placeholder => {
        // These are already styled with CSS gradients
    });
}

document.addEventListener('DOMContentLoaded', initImagePlaceholders);
