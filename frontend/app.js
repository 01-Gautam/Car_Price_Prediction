/**
 * AUTOVALUATOR  -  Premium Interaction Engine
 * Deep Crimson Edition
 * Handles: cursor spotlight, scroll progress, KPI counters,
 *          word-by-word hero reveal, nav tracking, page curtain,
 *          card observers, parallax, magnetic buttons, auth particles
 */

document.addEventListener('DOMContentLoaded', () => {
    initPageCurtain();
    initCursorSpotlight();
    initScrollProgress();
    initNavbarScroll();
    initNavActiveTracking();
    initCardObserver();
    initFooterStatObserver();
    initHeroParallax();
    initHeroWordReveal();
    initKPICountUp();
    initMagneticButtons();
    initAuthParticles();
});

/* ----------------------------------------------------------------
   PAGE-LOAD CURTAIN  -  Dramatic brand flash on entry
   ---------------------------------------------------------------- */
function initPageCurtain() {
    const curtain = document.querySelector('.page-curtain');
    if (!curtain) return;

    setTimeout(() => {
        curtain.classList.add('lifted');
        // Remove from DOM after transition
        setTimeout(() => curtain.remove(), 700);
    }, 800);
}

/* ----------------------------------------------------------------
   CURSOR SPOTLIGHT  -  Subtle crimson glow follows mouse
   ---------------------------------------------------------------- */
function initCursorSpotlight() {
    const spot = document.querySelector('.cursor-spotlight');
    if (!spot) return;

    let mouseX = 0, mouseY = 0;
    let spotX = 0, spotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow with lerp for a premium feel
    function animate() {
        spotX += (mouseX - spotX) * 0.08;
        spotY += (mouseY - spotY) * 0.08;
        spot.style.left = spotX + 'px';
        spot.style.top = spotY + 'px';
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

/* ----------------------------------------------------------------
   SCROLL PROGRESS BAR
   ---------------------------------------------------------------- */
function initScrollProgress() {
    const bar = document.querySelector('.scroll-progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const winHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / winHeight) * 100;
        bar.style.width = scrolled + '%';
    }, { passive: true });
}

/* ----------------------------------------------------------------
   NAVBAR  -  Scroll state (background solidify)
   ---------------------------------------------------------------- */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    const onScroll = () => {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

/* ----------------------------------------------------------------
   NAV ACTIVE TRACKING  -  Highlight current section
   ---------------------------------------------------------------- */
function initNavActiveTracking() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    const isMatch = link.getAttribute('href') === '#' + id;
                    link.classList.toggle('active', isMatch);
                });
            }
        });
    }, { threshold: 0.25, rootMargin: '-68px 0px -30% 0px' });

    sections.forEach(section => observer.observe(section));
}

/* ----------------------------------------------------------------
   CARD REVEAL  -  IntersectionObserver
   ---------------------------------------------------------------- */
function initCardObserver() {
    const cards = document.querySelectorAll('.p-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => entry.target.classList.add('visible'), i * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach(card => observer.observe(card));
}

/* ----------------------------------------------------------------
   FOOTER STAT OBSERVER  -  Glow on scroll-in
   ---------------------------------------------------------------- */
function initFooterStatObserver() {
    const stats = document.querySelectorAll('.footer-stat-value');
    if (!stats.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

/* ----------------------------------------------------------------
   HERO PARALLAX  -  Subtle video drift on scroll
   ---------------------------------------------------------------- */
function initHeroParallax() {
    const video = document.querySelector('.hero-video-bg video');
    if (!video) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = Math.min(scrolled * 0.25, 200);
        video.style.transform = `scale(1.04) translateY(${rate}px)`;
    }, { passive: true });
}

/* ----------------------------------------------------------------
   HERO WORD-BY-WORD REVEAL  -  Subtitle text animation
   ---------------------------------------------------------------- */
function initHeroWordReveal() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent.trim();
    subtitle.innerHTML = '';

    const words = text.split(/\s+/);
    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        span.style.transitionDelay = `${1.2 + i * 0.06}s`;
        subtitle.appendChild(span);
        // Add space after each word except last
        if (i < words.length - 1) {
            subtitle.appendChild(document.createTextNode(' '));
        }
    });

    // Trigger after a brief delay
    setTimeout(() => {
        subtitle.querySelectorAll('.word').forEach(w => w.classList.add('visible'));
    }, 100);
}

/* ----------------------------------------------------------------
   KPI COUNT-UP ANIMATION  -  Numbers animate from 0
   ---------------------------------------------------------------- */
function initKPICountUp() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    if (!kpiValues.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);
                if (isNaN(num)) return;

                const unit = el.querySelector('.kpi-unit');
                const unitText = unit ? unit.textContent : '';
                const duration = 1800;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 4);
                    const current = Math.round(num * ease);

                    if (unit) {
                        el.innerHTML = current + `<span class="kpi-unit">${unitText}</span>`;
                    } else {
                        el.textContent = current;
                    }

                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        el.classList.add('counted');
                    }
                }
                requestAnimationFrame(update);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    kpiValues.forEach(kpi => observer.observe(kpi));
}

/* ----------------------------------------------------------------
   ULTIMATE MAGNETIC BUTTON PHYSICS (Frosted Orb + 3D Tilt)
   ---------------------------------------------------------------- */
function initMagneticButtons() {
    const magneticContainers = document.querySelectorAll('.magnetic-btn-container');

    magneticContainers.forEach(container => {
        const btn = container.querySelector('.cta-btn') || container.querySelector('.editorial-btn');
        if (!btn) return;

        const textLayer = btn.querySelector('.btn-label');

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            
            // 1. Calculate relative mouse position (0 to 1)
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            // 2. Move the internal glowing orb to exactly the mouse pixel coordinates
            const xPx = e.clientX - rect.left;
            const yPx = e.clientY - rect.top;
            btn.style.setProperty('--x', `${xPx}px`);
            btn.style.setProperty('--y', `${yPx}px`);

            // 3. Move the ENTIRE button towards the mouse (Magnetic Pull)
            // Maps 0-1 to -1 to +1, then multiplies by strength (e.g. 15px max movement)
            const moveX = (x - 0.5) * 20; 
            const moveY = (y - 0.5) * 20;
            
            // 4. Subtle 3D tilt
            const rotateX = (y - 0.5) * -10; // degrees
            const rotateY = (x - 0.5) * 10;

            container.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            
            // 5. Parallax the text slightly in the opposite direction for depth
            if (textLayer) {
                const textMoveX = (x - 0.5) * -4;
                const textMoveY = (y - 0.5) * -4;
                textLayer.style.transform = `translate(${textMoveX}px, ${textMoveY}px)`;
            }
        });

        container.addEventListener('mouseleave', () => {
            // Reset all inline styles on mouse leave
            container.style.transform = `translate(0, 0) rotateX(0) rotateY(0)`;
            if (textLayer) {
                textLayer.style.transform = `translate(0, 0)`;
            }
        });
    });
}

/* ----------------------------------------------------------------
   AUTH PAGE FLOATING PARTICLES
   ---------------------------------------------------------------- */
function initAuthParticles() {
    const authWrapper = document.querySelector('.auth-wrapper');
    if (!authWrapper) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'auth-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.bottom = '-10px';
        particle.style.animationDuration = (4 + Math.random() * 8) + 's';
        particle.style.animationDelay = (Math.random() * 6) + 's';
        particle.style.width = (1 + Math.random() * 2) + 'px';
        particle.style.height = particle.style.width;
        authWrapper.appendChild(particle);
    }
}

/* ----------------------------------------------------------------
   SLOT MACHINE COUNTER  -  Price animation (predict.html)
   ---------------------------------------------------------------- */
function animateSlotMachine(elementId, targetValue) {
    const el = document.getElementById(elementId);
    if (!el) return;

    const duration = 2400;
    const startTime = performance.now();

    function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 5);

        if (progress < 1) {
            const jitter = Math.floor(Math.random() * targetValue * 0.08);
            const current = targetValue * ease + jitter * (1 - ease);
            el.textContent = '\u20B9' + Math.floor(current).toLocaleString('en-IN');
            el.classList.remove('glow');
            requestAnimationFrame(update);
        } else {
            el.textContent = '\u20B9' + targetValue.toLocaleString('en-IN');
            el.classList.add('glow');
            setTimeout(() => {
                el.style.transition = 'color 1.5s ease, text-shadow 1.5s ease';
                el.classList.remove('glow');
            }, 3000);
        }
    }
    requestAnimationFrame(update);
}

/* ----------------------------------------------------------------
   LOGOUT
   ---------------------------------------------------------------- */
function handleLogout() {
    localStorage.removeItem('autovaluator_token');
    localStorage.removeItem('autovaluator_user');
    window.location.href = '/auth';
}

// Expose globals
window.animateSlotMachine = animateSlotMachine;
window.handleLogout = handleLogout;
