'use strict';

// ============================================
// APP.JS - Core Initialization & Global Behaviors
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Check if the user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. LOADING SCREEN
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.body.classList.add('loaded');
            
            if (window.gsap && !prefersReducedMotion) {
                gsap.to('#loading-screen', {
                    opacity: 0,
                    duration: 0.6,
                    delay: 0.8,
                    onComplete: () => {
                        const loadingScreen = document.getElementById('loading-screen');
                        if (loadingScreen) loadingScreen.style.display = 'none';
                        
                        // Dispatch event for animations.js to catch
                        document.dispatchEvent(new CustomEvent('appReady'));
                    }
                });
            } else {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) loadingScreen.style.display = 'none';
                document.dispatchEvent(new CustomEvent('appReady'));
            }
        }, 800);
    });

    // 2. LENIS SMOOTH SCROLL
    let lenis;
    if (window.Lenis) {
        lenis = new Lenis({
            duration: 0.8, // Faster, snappier duration
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.2 // Make scrolling feel more responsive
        });

        if (window.gsap && window.ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        window.lenis = lenis;
    }

    // 3. CUSTOM CURSOR
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    if (isHoverDevice && !prefersReducedMotion) {
        const cursor = document.getElementById('custom-cursor');
        const glow = document.getElementById('cursor-glow');
        
        if (cursor && glow) {
            let mouseX = window.innerWidth / 2;
            let mouseY = window.innerHeight / 2;
            let cursorX = mouseX;
            let cursorY = mouseY;
            let glowX = mouseX;
            let glowY = mouseY;

            const lerp = (a, b, f) => a + (b - a) * f;

            window.addEventListener('mousemove', (e) => {
                mouseX = e.clientX;
                mouseY = e.clientY;
            });

            const renderCursor = () => {
                cursorX = mouseX;
                cursorY = mouseY;
                glowX = lerp(glowX, mouseX, 0.08);
                glowY = lerp(glowY, mouseY, 0.08);

                cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                glow.style.transform = `translate(${glowX - 150}px, ${glowY - 150}px)`; // Offset by half the width/height (300/2)

                requestAnimationFrame(renderCursor);
            };
            requestAnimationFrame(renderCursor);

            // Hover effects
            const interactiveElements = document.querySelectorAll('a, button, .magnetic-btn, .filter-btn, .portfolio-item, input, textarea, .social-link, .nav-link');
            
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
            });
        }
    }

    // 4. NAVBAR BEHAVIOR
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleScroll = () => {
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isActive = mobileMenu.classList.toggle('active');
            mobileMenuBtn.classList.toggle('active');
            // Override inline styles when active
            mobileMenu.style.opacity = isActive ? '1' : '0';
            mobileMenu.style.pointerEvents = isActive ? 'auto' : 'none';
        });
    }

    // Nav Links Click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('data-section');
            if (targetId && window.lenis) {
                window.lenis.scrollTo(`#${targetId}`, { offset: -80 });
            } else if (targetId) {
                const targetEl = document.getElementById(targetId);
                if (targetEl) {
                    const top = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top, behavior: 'smooth' });
                }
            }
            
            // Close mobile menu
            if (mobileMenu?.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                mobileMenuBtn?.classList.remove('active');
                mobileMenu.style.opacity = '0';
                mobileMenu.style.pointerEvents = 'none';
            }
        });
    });

    // 5. ACTIVE SECTION TRACKING
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        root: null,
        rootMargin: '-50% 0px -50% 0px', // Trigger when section is in the middle of viewport
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Remove active from all
                navLinks.forEach(link => link.classList.remove('active'));
                // Add to current
                const activeLink = document.querySelector(`.nav-link[data-section="${id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section.id) sectionObserver.observe(section);
    });

    // 6. SCROLL PROGRESS
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const percentage = (scrollTop / scrollHeight) * 100;
            scrollProgress.style.width = percentage + '%';
        }, { passive: true });
    }

    // 7. MOUSE GRADIENT EFFECT (Removed for performance)
    // Removed global CSS variable updates on mousemove as they trigger heavy layout recalculations
    // and cause significant scroll lag on complex pages.

    // 8. LUCIDE ICONS
    if (window.lucide) {
        lucide.createIcons();
    }

    // 9. SMOOTH ANCHOR LINKS (Catch all)
    document.querySelectorAll('a[href^="#"]:not(.nav-link)').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && window.lenis) {
                e.preventDefault();
                window.lenis.scrollTo(href, { offset: -80 });
            }
        });
    });
});
