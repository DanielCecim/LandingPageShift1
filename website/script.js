/* ═══════════════════════════════════════════════════════════════════════
   SHIFT — Landing Page Scripts
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Force autoplay on mobile for muted videos ───────────────────
    const video = document.querySelector('video.brand-logo');
    if (video) {
        video.muted = true;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay blocked — play on first user interaction
                const tryPlay = () => {
                    video.play();
                    document.removeEventListener('touchstart', tryPlay);
                    document.removeEventListener('click', tryPlay);
                };
                document.addEventListener('touchstart', tryPlay, { once: true });
                document.addEventListener('click', tryPlay, { once: true });
            });
        }
        // Remove native controls to prevent play button overlay
        video.removeAttribute('controls');
    }

    // ── Slider & Slides ──────────────────────────────────────────────
    const slider = document.getElementById('slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dots = Array.from(document.querySelectorAll('.dot'));
    const nav = document.querySelector('.nav');
    let current = 0;

    // ── Go to slide ──
    function goTo(index) {
        if (index < 0 || index >= slides.length) return;
        current = index;
        slides[index].scrollIntoView({ behavior: 'smooth' });
    }

    // Make goTo available globally for inline handlers
    window.goTo = goTo;

    // ── Dot clicks ──
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // ── Keyboard navigation ──
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            goTo(current + 1);
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goTo(current - 1);
        }
    });

    // ── Intersection Observer: detect active slide ──
    const slideObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const idx = slides.indexOf(entry.target);
            if (idx === -1) return;
            current = idx;

            // Update dots
            dots.forEach((d, i) => d.classList.toggle('active', i === idx));

            // Dot theme based on slide background
            const theme = entry.target.dataset.theme;
            dots.forEach(d => d.classList.toggle('light', theme === 'light'));

            // Animate slide content
            entry.target.classList.add('in-view');

            // Counter animation for impact numbers — fast linear count
            entry.target.querySelectorAll('.count-up').forEach(el => {
                if (el.dataset.done) return;
                el.dataset.done = '1';
                const target = parseInt(el.dataset.target);
                let val = 0;
                const step = Math.max(1, Math.ceil(target / 40));
                const t = setInterval(() => {
                    val += step;
                    if (val >= target) { val = target; clearInterval(t); }
                    el.textContent = val;
                }, 12);
            });
        });
    }, { threshold: 0.3, root: slider });

    slides.forEach(s => slideObserver.observe(s));

    // Trigger first slide immediately
    slides[0].classList.add('in-view');

    // ── Nav scroll effect ──
    if (slider && nav) {
        slider.addEventListener('scroll', () => {
            if (slider.scrollTop > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // ── Mobile Navigation Toggle ──
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // ── Smooth Scroll for Anchor Links (within slider) ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') { goTo(0); return; }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Find the slide that contains this target
                const targetSlide = targetElement.closest('.slide') || targetElement;
                const idx = slides.indexOf(targetSlide);
                if (idx !== -1) {
                    goTo(idx);
                } else {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // ── Wave Animations ──────────────────────────────────────────────
    try {
        initMeshGradient();
        initTeamWaves();
    } catch (e) {
        console.warn('Wave animations failed:', e);
    }

    // ── New Visagio-style Effects ────────────────────────────────────
    initTypewriter();
    initNetwork();
    initTilt();
    initGlowingEffect();
});

// ── Hero Wave Animation (SimplexNoise — mirrors team section) ─────────
function initMeshGradient() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    if (typeof SimplexNoise === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let w, h;
    let nt = 0;
    let animId = null;
    let isVisible = true; // Hero is the first slide — start immediately

    const waveColors = [
        "#6366f1", "#ec4899", "#0ea5e9",  /* primary, secondary, accent /
        "#3b82f6", "#a855f7", "#4f46e5",  / blue, purple, deep indigo  /
        "#7c3aed", "#db2777"              / violet, deep pink          */
    ];

    const waveWidth = 100;
    let blur = 25;
    const waveOpacity = 0.35;

    function updateDimensions() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        blur = window.innerWidth < 768 ? 10000 : 25;
    }

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    // Pause when not visible
    const section = canvas.closest('.slide');
    if (section) {
        new IntersectionObserver(entries => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animId) render();
        }, { threshold: 0.05 }).observe(section);
    }

    const drawWave = (n) => {
        nt += 0.002;
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];

            for (let x = 0; x < w; x += 35) {
                const y = simplex.noise3D(x / 350, 0.15 * i, nt) * 300;
                const verticalOffset = h * 0.5;
                ctx.lineTo(x, y + verticalOffset);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        if (!isVisible) { animId = null; return; }
        ctx.clearRect(0, 0, w, h);

        ctx.filter = `blur(${blur}px)`;
        ctx.globalAlpha = waveOpacity;

        drawWave(8);
        animId = requestAnimationFrame(render);
    };

    render();
}

// ── Team Section Wave Animation (Darker/Subtle) ────────────────────
function initTeamWaves() {
    const canvas = document.getElementById('team-canvas');
    if (!canvas) return;

    if (typeof SimplexNoise === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let w, h;
    let nt = 0;
    let animId = null;
    let isVisible = false;

    const waveColors = [
        "#6366f1", "#ec4899", "#0ea5e9",
        "#3b82f6", "#a855f7", "#4f46e5",
        "#7c3aed", "#db2777"
    ];

    const waveWidth = 120;
    let blur = 30;
    const waveOpacity = 0.4;

    function updateTeamDimensions() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
        blur = window.innerWidth < 768 ? 10000 : 30;
    }

    window.addEventListener('resize', updateTeamDimensions);
    updateTeamDimensions();

    // Pause when not visible
    const section = canvas.closest('.slide');
    if (section) {
        const visObs = new IntersectionObserver(entries => {
            isVisible = entries[0].isIntersecting;
            if (isVisible && !animId) render();
        }, { threshold: 0.05 });
        visObs.observe(section);
    }

    const drawWave = (n) => {
        nt += 0.0025;
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];

            for (let x = 0; x < w; x += 40) {
                const y = simplex.noise3D(x / 400, 0.2 * i, nt) * 200;
                ctx.lineTo(x, y + h * 0.5);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        if (!isVisible) { animId = null; return; }
        ctx.clearRect(0, 0, w, h);

        ctx.filter = `blur(${blur}px)`;
        ctx.globalAlpha = waveOpacity;

        drawWave(7);
        animId = requestAnimationFrame(render);
    };

    render();
}

// ── Typewriter Effect ──────────────────────────────────────────────
function initTypewriter() {
    const el = document.querySelector('.typewriter-text');
    if (!el) return;

    const texts = [
        "Machine Learning",
        "Ciência de Dados",
        "a Shift"
    ];

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 150;
    const mobile = window.innerWidth < 768;
    console.log('[Typewriter] initialized, mobile:', mobile, 'el:', el);

    // Add cursor
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.parentNode.insertBefore(cursor, el.nextSibling);

    function type() {
        const current = texts[textIndex];

        if (isDeleting) {
            charIndex--;
            el.textContent = current.substring(0, charIndex);
            typeSpeed = mobile ? 100 : 75;
        } else {
            charIndex++;
            el.textContent = current.substring(0, charIndex);
            typeSpeed = mobile ? 70 : 55;
        }

        if (!isDeleting && charIndex === current.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typeSpeed = 500; // Pause before typing new
        }

        setTimeout(type, typeSpeed);
    }

    // Start with the text already there, then begin deleting after a pause
    charIndex = texts[0].length;
    isDeleting = true;
    setTimeout(type, 2000);
}

// ── Network Particle Animation (About Section) ─────────────────────
function initNetwork() {
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];
    const particleCount = 60;
    const connectionDist = 150;
    let mouse = { x: null, y: null };

    // Resize
    function resize() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
        createParticles();
    }

    window.addEventListener('resize', resize);

    // Mouse interaction
    canvas.parentElement.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            // Mouse interaction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (150 - distance) / 150;
                    const directionX = forceDirectionX * force * 0.5;
                    const directionY = forceDirectionY * force * 0.5;
                    this.vx += directionX;
                    this.vy += directionY;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        if (!w || !h) return;
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(99, 102, 241, ${1 - distance / connectionDist})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    resize(); // init
    animate();
}

// ── Glowing Mouse-Follow Border Effect ────────────────────────────
function initGlowingEffect() {
    const elements = Array.from(document.querySelectorAll(
        '.feature-card, .process-card, .team-card, .contact-form'
    ));
    if (!elements.length) return;

    const PROXIMITY = 64;   // px outside the card that still activates the glow
    const INACTIVE_ZONE = 0.01; // fraction of the card radius that disables glow at center

    document.addEventListener('mousemove', (e) => {
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width * 0.5;
            const cy = rect.top + rect.height * 0.5;

            const distFromCenter = Math.hypot(e.clientX - cx, e.clientY - cy);
            const inactiveRadius = 0.5 * Math.min(rect.width, rect.height) * INACTIVE_ZONE;

            if (distFromCenter < inactiveRadius) {
                el.style.setProperty('--active', '0');
                return;
            }

            const isNear =
                e.clientX > rect.left - PROXIMITY &&
                e.clientX < rect.right + PROXIMITY &&
                e.clientY > rect.top - PROXIMITY &&
                e.clientY < rect.bottom + PROXIMITY;

            el.style.setProperty('--active', isNear ? '1' : '0');

            if (isNear) {
                const angle = (Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI) + 90;
                el.style.setProperty('--start', angle.toFixed(1));
            }
        });
    });

    // Reset all when mouse leaves the page
    document.addEventListener('mouseleave', () => {
        elements.forEach(el => el.style.setProperty('--active', '0'));
    });
}

// ── 3D Tilt Effect for Cards ───────────────────────────────────────
function initTilt() {
    const cards = document.querySelectorAll('.feature-card, .process-card, .team-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Mouse position relative to center
            const mouseX = x - centerX;
            const mouseY = y - centerY;

            // Rotation (max 10deg)
            const rotateX = (mouseY / centerY) * -5;
            const rotateY = (mouseX / centerX) * 5;

            card.classList.add('tilt-active');
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.classList.remove('tilt-active');
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}
