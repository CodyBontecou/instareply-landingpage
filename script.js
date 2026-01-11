/**
 * instarep.ly — Interactive Scripts
 * Handles cursor effects, scroll animations, and demo interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    initCursorGlow();
    initScrollAnimations();
    initPhoneDemo();
    initSmoothScroll();
    initNavScrollEffect();
});

/**
 * Cursor Glow Effect
 * Creates a subtle glow that follows the cursor
 */
function initCursorGlow() {
    const cursorGlow = document.getElementById('cursorGlow');
    if (!cursorGlow) return;

    let mouseX = 0;
    let mouseY = 0;
    let glowX = 0;
    let glowY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth animation loop
    function animateGlow() {
        // Lerp for smooth following
        glowX += (mouseX - glowX) * 0.1;
        glowY += (mouseY - glowY) * 0.1;

        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;

        requestAnimationFrame(animateGlow);
    }

    animateGlow();
}

/**
 * Scroll-triggered Animations
 * Uses Intersection Observer for performant scroll animations
 */
function initScrollAnimations() {
    // Add animate-on-scroll class to elements
    const animateElements = document.querySelectorAll(
        '.step, .feature-card, .setup-step, .testimonial-author'
    );

    animateElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.classList.add(`stagger-${(index % 5) + 1}`);
    });

    // Create observer
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    // Observe all animated elements
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.observe(el);
    });

    // Animate workflow line on scroll
    const workflowVisual = document.querySelector('.workflow-visual');
    if (workflowVisual) {
        const workflowObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        workflowVisual.classList.add('animate');
                    }
                });
            },
            { threshold: 0.5 }
        );
        workflowObserver.observe(workflowVisual);
    }
}

/**
 * Phone Demo Interactions
 * Makes the phone mockup interactive
 */
function initPhoneDemo() {
    const generateBtn = document.querySelector('.generate-btn');
    const keys = document.querySelectorAll('.ios-keyboard .key');
    const profileSelector = document.querySelector('.profile-selector');

    // Array of possible responses
    const responses = [
        "Thanks so much! 💕 It's from @fashionbrand - link in bio! ✨",
        "Aww you're so sweet! 🥰 Check my latest haul video for details!",
        "Thank you babe! Got it from my fave store - swipe up for the link! 💗",
        "Omg thanks! 😍 All outfit details are in my LTK!",
        "You're the best! 💖 It's tagged in the video - tap the shopping bag!",
        "Love you! 🤗 Full outfit breakdown coming tomorrow!",
        "Thanks hun! ✨ Use code CREATOR20 for a discount!",
        "So glad you like it! 💕 Check my stories for the try-on haul!"
    ];

    // Generate button click animation and add message
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            generateBtn.style.transform = 'scale(0.95)';
            generateBtn.classList.add('generating');

            setTimeout(() => {
                generateBtn.style.transform = 'scale(1)';
            }, 100);

            // Show generating animation
            const icon = generateBtn.querySelector('.generate-icon');
            if (icon) {
                icon.style.animation = 'spin 0.5s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 500);
            }

            // Add a generated response to the chat
            setTimeout(() => {
                addGeneratedMessage(responses);
            }, 300);
        });
    }

    // Keyboard key press animation
    keys.forEach((key) => {
        key.addEventListener('click', () => {
            key.style.transform = 'scale(0.9)';
            key.style.background = '#E8E8ED';
            setTimeout(() => {
                key.style.transform = 'scale(1)';
                key.style.background = '';
            }, 100);
        });
    });

    // Profile selector interaction
    if (profileSelector) {
        profileSelector.addEventListener('click', () => {
            profileSelector.style.transform = 'scale(0.95)';
            setTimeout(() => {
                profileSelector.style.transform = 'scale(1)';
            }, 100);
        });
    }

    // Function to add generated message to chat
    function addGeneratedMessage(responses) {
        const appDemo = document.querySelector('.app-demo');
        const keyboardArea = document.querySelector('.keyboard-area');

        if (!appDemo || !keyboardArea) return;

        // Get a random response
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        // Create the new message bubble with iOS blue style
        const messageBubble = document.createElement('div');
        messageBubble.className = 'comment-bubble outgoing';
        messageBubble.style.cssText = `
            background: #007AFF;
            color: white;
            padding: 8px 12px;
            border-radius: 18px;
            margin: 4px 12px;
            max-width: 70%;
            align-self: flex-end;
            margin-left: auto;
            font-size: 16px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
            line-height: 1.3;
            animation: slideInUp 0.3s ease;
            box-shadow: 0 1px 2px rgba(0,0,0,0.05);
            position: relative;
        `;

        const messageText = document.createElement('span');
        messageText.className = 'comment-text';
        messageText.textContent = randomResponse;
        messageBubble.appendChild(messageText);

        // Insert the message before the keyboard area
        appDemo.insertBefore(messageBubble, keyboardArea);

        // Scroll to show the new message if needed
        const phoneScreen = document.querySelector('.phone-screen');
        if (phoneScreen) {
            setTimeout(() => {
                phoneScreen.scrollTop = phoneScreen.scrollHeight;
            }, 100);
        }

        // Remove oldest message if there are too many (keep it clean)
        const allBubbles = appDemo.querySelectorAll('.comment-bubble.outgoing');
        if (allBubbles.length > 3) {
            allBubbles[0].style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                allBubbles[0].remove();
            }, 300);
        }
    }

    // Auto demo - pulse the generate button periodically
    let demoInterval;

    function startDemoCycle() {
        demoInterval = setInterval(() => {
            if (generateBtn) {
                generateBtn.classList.add('pulse');
                setTimeout(() => {
                    generateBtn.classList.remove('pulse');
                }, 600);
            }
        }, 3000);
    }

    // Start demo when phone is visible
    const phoneObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setTimeout(startDemoCycle, 1000);
                } else {
                    clearInterval(demoInterval);
                }
            });
        },
        { threshold: 0.5 }
    );

    const phoneMockup = document.querySelector('.phone-mockup');
    if (phoneMockup) {
        phoneObserver.observe(phoneMockup);
    }
}

/**
 * Show sent feedback animation
 */
function showSentFeedback(element) {
    const feedback = document.createElement('div');
    feedback.className = 'sent-feedback';
    feedback.textContent = '✓ Copied';
    feedback.style.cssText = `
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
        font-family: var(--font-mono);
        font-size: 10px;
        color: #22c55e;
        opacity: 0;
        animation: fadeInOut 1s ease forwards;
    `;

    element.style.position = 'relative';
    element.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

// Add the animation keyframes dynamically
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(-50%) translateX(10px); }
        30% { opacity: 1; transform: translateY(-50%) translateX(0); }
        70% { opacity: 1; transform: translateY(-50%) translateX(0); }
        100% { opacity: 0; transform: translateY(-50%) translateX(-10px); }
    }

    @keyframes slideInUp {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fadeOut {
        0% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(0.9);
        }
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .app-demo {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow-y: auto;
    }
`;
document.head.appendChild(styleSheet);

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Navigation scroll effect
 * Changes nav appearance on scroll
 */
function initNavScrollEffect() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class for styling
        if (currentScroll > scrollThreshold) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }

        // Hide/show nav on scroll direction (optional)
        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

/**
 * Typing effect for hero title (optional enhancement)
 */
function initTypingEffect() {
    const accentLine = document.querySelector('.title-line.accent');
    if (!accentLine) return;

    const words = ['hundreds', 'thousands', 'comments', 'followers'];
    let currentWord = 0;
    let currentChar = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const word = words[currentWord];

        if (isPaused) {
            setTimeout(type, 1500);
            isPaused = false;
            isDeleting = true;
            return;
        }

        if (isDeleting) {
            accentLine.textContent = word.substring(0, currentChar - 1);
            currentChar--;
        } else {
            accentLine.textContent = word.substring(0, currentChar + 1);
            currentChar++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && currentChar === word.length) {
            isPaused = true;
            typeSpeed = 100;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentWord = (currentWord + 1) % words.length;
            typeSpeed = 300;
        }

        setTimeout(type, typeSpeed);
    }

    // Uncomment to enable typing effect
    // setTimeout(type, 2000);
}

/**
 * Stats counter animation
 */
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-value');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    stats.forEach((stat) => {
        observer.observe(stat);
    });
}

function animateValue(element) {
    const finalValue = element.textContent;

    // Handle special cases
    if (finalValue === '∞' || finalValue.includes('+')) {
        return; // Don't animate these
    }

    const numericValue = parseInt(finalValue.replace(/\D/g, ''));
    if (isNaN(numericValue)) return;

    const suffix = finalValue.replace(/[0-9]/g, '');
    const duration = 1500;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(start + (numericValue - start) * easeOut);

        element.textContent = currentValue + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = finalValue;
        }
    }

    requestAnimationFrame(update);
}

// Initialize stats counter
initStatsCounter();

/**
 * Feature cards parallax effect (subtle)
 */
function initParallax() {
    const cards = document.querySelectorAll('.feature-card');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const windowCenterY = window.innerHeight / 2;
            const diff = (centerY - windowCenterY) / window.innerHeight;

            // Subtle parallax
            const translateY = diff * 10 * (index % 2 === 0 ? 1 : -1);
            card.style.transform = `translateY(${translateY}px)`;
        });
    });
}

// Uncomment to enable parallax
// initParallax();

/**
 * Mobile menu toggle (if needed)
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
}

/**
 * Preload critical resources
 */
function preloadResources() {
    // Preload fonts if not using font-display: swap
    const fonts = [
        'https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap'
    ];

    fonts.forEach((fontUrl) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = fontUrl;
        document.head.appendChild(link);
    });
}

// Run preload on page load
preloadResources();
