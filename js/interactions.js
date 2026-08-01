'use strict';

// ============================================
// INTERACTIONS.JS - User Interactions & Effects
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. MAGNETIC BUTTONS
    if (isHoverDevice && !prefersReducedMotion && window.gsap) {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            const content = btn.querySelector('span') || btn; // Optional inner content wrapping
            
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(btn, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
                if (content !== btn) {
                    gsap.to(content, { x: x * 0.5, y: y * 0.5, duration: 0.3, ease: 'power2.out' });
                }
            });
            
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
                if (content !== btn) {
                    gsap.to(content, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
                }
            });
        });

        // 2. TILT CARDS
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = ((y - centerY) / centerY) * -8;
                const rotateY = ((x - centerX) / centerX) * 8;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            
            card.addEventListener('mouseleave', () => {
                gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'power2.out' });
                // Reset direct style for GSAP to take over cleanly
                setTimeout(() => { card.style.transform = ''; }, 600);
            });
        });
    }

    // 3. PORTFOLIO FILTERING
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterBtns.length && portfolioItems.length && window.gsap) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active state
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.getAttribute('data-filter');
                
                // Hide unmatching
                const toHide = [];
                const toShow = [];
                
                portfolioItems.forEach(item => {
                    const catString = item.getAttribute('data-category') || '';
                    const categories = catString.split(' ');
                    if (filter === 'tumu' || categories.includes(filter)) {
                        toShow.push(item);
                    } else {
                        toHide.push(item);
                    }
                });
                
                if (toHide.length > 0) {
                    gsap.to(toHide, {
                        scale: 0.8,
                        opacity: 0,
                        duration: 0.3,
                        onComplete: () => {
                            toHide.forEach(el => el.style.display = 'none');
                        }
                    });
                }
                
                if (toShow.length > 0) {
                    toShow.forEach(el => {
                        el.style.display = 'block';
                    });
                    gsap.fromTo(toShow,
                        { scale: 0.8, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.1 }
                    );
                }
            });
        });
    }

    // 4. LIGHTBOX SYSTEM
    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    let currentLightboxIndex = -1;
    let visiblePortfolioItems = [];

    if (lightbox && portfolioItems.length && window.gsap) {
        const updateVisibleItems = () => {
            visiblePortfolioItems = Array.from(portfolioItems).filter(item => item.style.display !== 'none');
        };

        const openLightbox = (index) => {
            if (index < 0 || index >= visiblePortfolioItems.length) return;
            currentLightboxIndex = index;
            
            const item = visiblePortfolioItems[index];
            const title = item.querySelector('.portfolio-title')?.innerText || '';
            const imageDiv = item.querySelector('.portfolio-img') || item.querySelector('div[class*="bg-gradient"]') || item;
            
            // Clone background styles safely
            const computedStyle = window.getComputedStyle(imageDiv);
            lightboxContent.style.background = computedStyle.background;
            lightboxContent.style.backgroundImage = computedStyle.backgroundImage;
            lightboxContent.style.backgroundSize = 'contain';
            lightboxContent.style.backgroundPosition = 'center';
            lightboxContent.style.backgroundRepeat = 'no-repeat';
            lightboxContent.style.height = '80vh';
            
            lightboxCaption.innerText = title;
            lightbox.classList.add('active');
            
            if (window.lenis) window.lenis.stop();
            
            gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3 });
            gsap.fromTo(lightboxContent, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, delay: 0.1 });
        };

        const closeLightbox = () => {
            gsap.to(lightbox, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    lightbox.classList.remove('active');
                    if (window.lenis) window.lenis.start();
                }
            });
        };

        const nextLightbox = (e) => {
            e?.stopPropagation();
            if (visiblePortfolioItems.length === 0) return;
            const newIdx = (currentLightboxIndex + 1) % visiblePortfolioItems.length;
            openLightbox(newIdx);
        };

        const prevLightbox = (e) => {
            e?.stopPropagation();
            if (visiblePortfolioItems.length === 0) return;
            const newIdx = (currentLightboxIndex - 1 + visiblePortfolioItems.length) % visiblePortfolioItems.length;
            openLightbox(newIdx);
        };

        portfolioItems.forEach(item => {
            item.addEventListener('click', () => {
                updateVisibleItems();
                const idx = visiblePortfolioItems.indexOf(item);
                if (idx !== -1) openLightbox(idx);
            });
        });

        lightboxClose?.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        
        lightboxPrev?.addEventListener('click', prevLightbox);
        lightboxNext?.addEventListener('click', nextLightbox);

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') nextLightbox();
            if (e.key === 'ArrowLeft') prevLightbox();
        });
    }

    // 5. CANVAS PARTICLE SYSTEM
    const canvas = document.getElementById('hero-canvas');
    if (canvas && !prefersReducedMotion) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        let animationFrameId;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particles = [];
            const count = window.innerWidth < 768 ? 60 : 120;
            // Ember and ash colors (RGB) - More vibrant oranges and reds, plus dark ashes
            const colors = [
                { r: 255, g: 69, b: 0, glow: true },    // Red-Orange
                { r: 255, g: 140, b: 0, glow: true },   // Dark Orange
                { r: 255, g: 200, b: 50, glow: true },  // Yellow-Orange
                { r: 100, g: 100, b: 100, glow: false }, // Dark Ash
                { r: 40, g: 40, b: 40, glow: false }     // Black Ash
            ];
            for (let i = 0; i < count; i++) {
                const colorObj = colors[Math.floor(Math.random() * colors.length)];
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    size: Math.random() * 3 + 0.5,
                    speedX: Math.random() * 2 - 1,
                    speedY: Math.random() * -3 - 1, // Move up faster like heat
                    baseOpacity: Math.random() * 0.8 + 0.2,
                    colorStr: `${colorObj.r}, ${colorObj.g}, ${colorObj.b}`,
                    glow: colorObj.glow,
                    angle: Math.random() * Math.PI * 2,
                    spin: Math.random() * 0.2 - 0.1,
                    sway: Math.random() * 2
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                // Sway motion (chaotic wind)
                p.x += p.speedX + Math.sin(p.angle) * p.sway;
                p.y += p.speedY;
                p.angle += p.spin;
                
                // Sharp flicker effect for glowing embers
                let currentOpacity = p.baseOpacity;
                if (p.glow) {
                    currentOpacity = p.baseOpacity * (0.3 + Math.random() * 0.7);
                }
                
                // Wrap around smoothly and simulate dying out at the top
                if (p.y < -50) {
                    p.y = height + 50;
                    p.x = Math.random() * width;
                    p.baseOpacity = Math.random() * 0.8 + 0.2; // reset opacity
                }
                if (p.x < -50) p.x = width + 50;
                if (p.x > width + 50) p.x = -50;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                
                if (p.glow) {
                    ctx.shadowBlur = p.size * 3 + 2;
                    ctx.shadowColor = `rgba(${p.colorStr}, 1)`;
                } else {
                    ctx.shadowBlur = 0;
                }
                
                ctx.fillStyle = `rgba(${p.colorStr}, ${currentOpacity})`;
                ctx.fill();
            }
            
            // Reset shadow to not affect other things if any
            ctx.shadowBlur = 0;
            
            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', () => {
            resize();
            initParticles();
        });
        
        resize();
        initParticles();

        // Only animate when hero is visible
        const heroSection = document.getElementById('hero');
        if (heroSection && window.IntersectionObserver) {
            const obs = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    if (!animationFrameId) draw();
                } else {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            });
            obs.observe(heroSection);
        } else {
            draw(); // Fallback
        }
    }

    // 6. BANA KATIL BUTTON EFFECTS
    const joinBtn = document.getElementById('join-btn');
    if (joinBtn) {
        joinBtn.addEventListener('click', function(e) {
            // Ripple effect
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.position = 'absolute';
            ripple.style.width = '20px';
            ripple.style.height = '20px';
            ripple.style.background = 'rgba(255,255,255,0.5)';
            ripple.style.borderRadius = '50%';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'translate(-50%, -50%)';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            if (window.gsap) {
                gsap.to(ripple, {
                    scale: 15,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power2.out',
                    onComplete: () => ripple.remove()
                });
            } else {
                setTimeout(() => ripple.remove(), 600);
            }
        });
    }

    // 7. PHOTO CAROUSEL
    const carouselTrack = document.querySelector('.carousel-track');
    const btnPrev = document.querySelector('.carousel-prev');
    const btnNext = document.querySelector('.carousel-next');

    if (carouselTrack && btnPrev && btnNext) {
        const scrollAmount = 300; // Approx card width + gap
        
        btnNext.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
        
        btnPrev.addEventListener('click', () => {
            carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // 8. FORM INTERACTIONS
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('button[type="submit"]');
            let originalText = btn ? btn.innerText : 'Gönder';
            if (btn) {
                btn.innerText = 'Gönderiliyor...';
                btn.disabled = true;
            }
            
            // Determine subject
            let subject = 'Web Sitesi İletişim Formu';
            if (btn && btn.innerText.includes('Hukuki')) subject = 'Hukuki Danışmanlık Talebi';
            if (btn && btn.innerText.includes('Fikri')) subject = 'Yeni Fikir/Proje Önerisi';
            if (form.id === 'contact-form' || (btn && btn.innerText.includes('Mesaj Gönder'))) subject = 'Web Sitesi İletişim Mesajı';
            if (form.id === 'join-form') subject = 'Birlikte Antrenman Talebi';
            
            const formData = new FormData(form);
            formData.append('access_key', '657de853-b8ef-49ea-be2b-bba71949c6b7');
            formData.append('subject', subject);
            formData.append('from_name', 'Yusuf Bozok Portfolio');
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (btn) {
                        btn.innerText = 'Gönderildi! ✓';
                        btn.style.backgroundColor = '#10B981'; // Success green
                    }
                    setTimeout(() => {
                        form.reset();
                        if (btn) {
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                            btn.disabled = false;
                        }
                    }, 3000);
                } else {
                    if (btn) {
                        btn.innerText = 'Hata Oluştu!';
                        btn.style.backgroundColor = '#EF4444'; // Error red
                        setTimeout(() => {
                            btn.innerText = originalText;
                            btn.style.backgroundColor = '';
                            btn.disabled = false;
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error(error);
                if (btn) {
                    btn.innerText = 'Hata Oluştu!';
                    btn.style.backgroundColor = '#EF4444'; // Error red
                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 3000);
                }
            }
        });
    });

    // 9. KONAMI CODE
    let konamiBuffer = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiTimer;

    document.addEventListener('keydown', (e) => {
        konamiBuffer.push(e.key);
        
        clearTimeout(konamiTimer);
        konamiTimer = setTimeout(() => { konamiBuffer = []; }, 2000);
        
        if (konamiBuffer.length > konamiCode.length) {
            konamiBuffer.shift();
        }
        
        if (konamiBuffer.join('').toLowerCase() === konamiCode.join('').toLowerCase()) {
            // Trigger easter egg
            const msg = document.createElement('div');
            msg.innerText = '🎮 Gizli başarım açıldı!';
            msg.style.position = 'fixed';
            msg.style.top = '20px';
            msg.style.left = '50%';
            msg.style.transform = 'translateX(-50%)';
            msg.style.background = '#3b82f6';
            msg.style.color = '#fff';
            msg.style.padding = '12px 24px';
            msg.style.borderRadius = '8px';
            msg.style.fontWeight = 'bold';
            msg.style.zIndex = '9999';
            msg.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            document.body.appendChild(msg);
            
            if (window.gsap) {
                gsap.fromTo(msg, { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'back.out' });
                gsap.to(msg, { y: -50, opacity: 0, duration: 0.5, delay: 3, onComplete: () => msg.remove() });
            } else {
                setTimeout(() => msg.remove(), 3000);
            }
            
            konamiBuffer = [];
        }
    });

    // 10. BACK TO TOP
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                if (window.gsap) gsap.to(backToTopBtn, { opacity: 1, duration: 0.3, display: 'block' });
                else backToTopBtn.style.display = 'block';
            } else {
                if (window.gsap) gsap.to(backToTopBtn, { opacity: 0, duration: 0.3, display: 'none' });
                else backToTopBtn.style.display = 'none';
            }
        }, { passive: true });
        
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.lenis) {
                window.lenis.scrollTo(0, { duration: 1.5 });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
});

// Join Modal Functions
window.openJoinModal = function(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('join-modal');
    const content = document.getElementById('join-modal-content');
    if (!modal || !content) return;
    
    modal.classList.remove('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-95');
    content.classList.add('scale-100');
};

window.closeJoinModal = function() {
    const modal = document.getElementById('join-modal');
    const content = document.getElementById('join-modal-content');
    if (!modal || !content) return;
    
    modal.classList.add('opacity-0', 'pointer-events-none');
    content.classList.remove('scale-100');
    content.classList.add('scale-95');
};
