'use strict';

// ============================================
// ANIMATIONS.JS - GSAP ScrollTrigger Animations
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    if (!window.gsap || !window.ScrollTrigger) return;
    
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) return; // Exit if reduced motion preferred

    // 1. HERO ENTRANCE ANIMATION
    window.initHeroAnimation = () => {
        const tl = gsap.timeline();

        // Background
        tl.to('#hero', { opacity: 1, duration: 1, ease: 'power2.out' }, 0);
        
        // Stagger words
        const words = document.querySelectorAll('.hero-word');
        if (words.length > 0) {
            tl.fromTo(words, 
                { y: '100%', opacity: 0 },
                { y: '0%', opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power3.out' },
                0.2
            );
        }

        // CTA Buttons
        const ctas = document.querySelectorAll('.hero-cta');
        if (ctas.length > 0) {
            tl.fromTo(ctas,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out' },
                1.0
            );
        }

        // Scroll Indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            tl.fromTo(scrollIndicator,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, delay: 0.5 },
                1.2
            );
        }

        initFloatingShapes();
    };

    // Listen for custom event from app.js
    document.addEventListener('appReady', window.initHeroAnimation);

    // 2. FLOATING SHAPES
    function initFloatingShapes() {
        const shapes = document.querySelectorAll('.floating-shape');
        shapes.forEach((shape) => {
            gsap.to(shape, {
                y: 'random(-30, 30)',
                x: 'random(-20, 20)',
                rotation: 'random(-10, 10)',
                duration: 'random(6, 12)',
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
            });
            
            // Parallax on scroll
            gsap.to(shape, {
                y: (i) => (i + 1) * -50,
                scrollTrigger: {
                    trigger: '#hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });
    }

    // 3. COMMON SECTION REVEALS
    const revealUp = gsap.utils.toArray('.reveal-up');
    revealUp.forEach((el) => {
        gsap.fromTo(el, 
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 95%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    const revealLeft = gsap.utils.toArray('.reveal-left');
    revealLeft.forEach((el) => {
        gsap.fromTo(el, 
            { x: -40, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 95%' }
            }
        );
    });

    const revealRight = gsap.utils.toArray('.reveal-right');
    revealRight.forEach((el) => {
        gsap.fromTo(el, 
            { x: 40, opacity: 0 },
            {
                x: 0,
                opacity: 1,
                duration: 0.5,
                ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 95%' }
            }
        );
    });

    const revealScale = gsap.utils.toArray('.reveal-scale');
    revealScale.forEach((el) => {
        gsap.fromTo(el, 
            { scale: 0.9, opacity: 0 },
            {
                scale: 1,
                opacity: 1,
                duration: 0.5,
                ease: 'back.out(1.7)',
                scrollTrigger: { trigger: el, start: 'top 95%' }
            }
        );
    });

    // 4. ABOUT SECTION
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        // Stats Counters
        const statCounters = document.querySelectorAll('.stat-counter');
        statCounters.forEach(el => {
            const target = parseInt(el.getAttribute('data-target') || 0);
            const suffix = el.innerText.replace(/[0-9]/g, ''); // e.g. '+'
            
            ScrollTrigger.create({
                trigger: el,
                start: 'top 95%',
                once: true,
                onEnter: () => {
                    gsap.to(el, {
                        innerText: target,
                        duration: 2,
                        snap: { innerText: 1 },
                        ease: 'power2.out',
                        onUpdate: function() {
                            el.innerText = Math.ceil(this.targets()[0].innerText) + suffix;
                        }
                    });
                }
            });
        });

        const statItems = document.querySelectorAll('.stat-item');
        if (statItems.length) {
            gsap.fromTo(statItems,
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.05, duration: 0.4, ease: 'power2.out',
                    scrollTrigger: { trigger: '.stat-item', start: 'top 95%' }
                }
            );
        }
    }

    // 5. PORTFOLIO SECTION
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (portfolioGrid) {
        gsap.fromTo('.portfolio-item',
            { scale: 0.9, opacity: 0 },
            {
                scale: 1, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out',
                scrollTrigger: { trigger: portfolioGrid, start: 'top 95%' }
            }
        );
    }

    // 6. LAW SECTION
    const lawSection = document.getElementById('law');
    if (lawSection) {
        // Timeline line
        const timelineItems = document.querySelectorAll('.timeline-item');
        if (timelineItems.length) {
            gsap.fromTo(timelineItems,
                { x: -30, opacity: 0 },
                {
                    x: 0, opacity: 1, stagger: 0.05, duration: 0.5, ease: 'power2.out',
                    scrollTrigger: { trigger: timelineItems[0], start: 'top 95%' }
                }
            );
        }
        
        const insights = document.querySelectorAll('.insight-card');
        if (insights.length) {
            gsap.fromTo(insights,
                { y: 30, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power2.out',
                    scrollTrigger: { trigger: insights[0], start: 'top 95%' }
                }
            );
        }
    }

    // 7. LIFESTYLE SECTION
    const lifestyleSection = document.getElementById('lifestyle');
    if (lifestyleSection) {
        // Progress Bars
        const progressBars = document.querySelectorAll('.progress-bar');
        progressBars.forEach(bar => {
            const target = bar.getAttribute('data-progress');
            if (target) {
                gsap.to(bar, {
                    width: target + '%',
                    duration: 1.5,
                    ease: 'power3.out',
                    scrollTrigger: { trigger: bar, start: 'top 95%', once: true }
                });
            }
        });

        // Lifestyle Counters
        const lifestyleCounters = document.querySelectorAll('.lifestyle-counter');
        lifestyleCounters.forEach(el => {
            const target = parseInt(el.getAttribute('data-target') || 0);
            const suffix = el.innerText.replace(/[0-9,]/g, ''); // grab + or k
            
            ScrollTrigger.create({
                trigger: el,
                start: 'top 95%',
                once: true,
                onEnter: () => {
                    gsap.to(el, {
                        innerText: target,
                        duration: 2.5,
                        snap: { innerText: 1 },
                        ease: 'power2.out',
                        onUpdate: function() {
                            el.innerText = Math.ceil(this.targets()[0].innerText).toLocaleString() + suffix;
                        }
                    });
                }
            });
        });

        // Join Button Special Reveal
        const joinBtn = document.getElementById('join-btn');
        if (joinBtn) {
            gsap.fromTo(joinBtn,
                { scale: 0.8, opacity: 0 },
                {
                    scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: { trigger: joinBtn, start: 'top 95%' }
                }
            );
        }
    }

    // 8. AI PROJECTS SECTION
    const aiGrid = document.querySelector('.ai-grid');
    if (aiGrid) {
        const aiCards = document.querySelectorAll('.ai-card');
        if (aiCards.length) {
            gsap.fromTo(aiCards,
                { y: 40, opacity: 0 },
                {
                    y: 0, opacity: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out',
                    scrollTrigger: { trigger: aiGrid, start: 'top 95%' }
                }
            );
            
            // Special 5th card if exists
            if (aiCards[4]) {
                gsap.fromTo(aiCards[4],
                    { scale: 0.9, rotation: -2, opacity: 0 },
                    {
                        scale: 1, rotation: 0, opacity: 1, duration: 0.5, delay: 0.48, ease: 'back.out(1.5)',
                        scrollTrigger: { trigger: aiGrid, start: 'top 95%' }
                    }
                );
            }
        }
    }

    // 9. FOOTER
    const footer = document.getElementById('footer');
    if (footer) {
        gsap.fromTo('.footer-logo',
            { y: 20, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: 'power2.out',
                scrollTrigger: { trigger: footer, start: 'top 95%' }
            }
        );
    }

    // 10. TEXT GRADIENTS
    const textGradients = document.querySelectorAll('.text-gradient');
    textGradients.forEach(text => {
        gsap.to(text, {
            backgroundPosition: '200% center',
            duration: 3,
            repeat: -1,
            ease: 'linear'
        });
    });
});
