/* ═══════════════════════════════════════════════════════════════════════
   SHIFT — Landing Page Scripts
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Slider & Slides ──────────────────────────────────────────────
    const slider = document.getElementById('slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const dots   = Array.from(document.querySelectorAll('.dot'));
    const nav    = document.querySelector('.nav');
    let current  = 0;

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
    const navLinks  = document.querySelector('.nav-links');

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
    initWaves();
    initTeamWaves();
});

// ── Hero Wave Animation (WavyBackground Port) ────────────────────────
function initWaves() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    if (typeof SimplexNoise === 'undefined') {
        console.warn('SimplexNoise library not loaded.');
        return;
    }

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let w, h, waveWidth, blur, amplitude, noiseScale, stepSize;

    const waveColors = [
        "#ff0080", "#7928ca", "#4f46e5", "#00d4ff", "#ff0080"
    ];
    const waveOpacity = 0.5;
    let nt = 0;

    // Scale wave params to viewport so mobile and desktop look similar
    function updateParams() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        const scale = Math.min(w / 1400, 1); // 1400 = reference desktop width
        waveWidth = 200 * scale;
        blur = Math.round(30 * scale);
        amplitude = 300 * scale;
        noiseScale = 600 * scale;
        stepSize = Math.max(3, Math.round(5 / scale));
    }

    updateParams();
    window.addEventListener('resize', updateParams);

    const drawWave = (n) => {
        nt += 0.003;
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];

            for (let x = 0; x < w; x += stepSize) {
                const y = simplex.noise3D(x / noiseScale, 0.3 * i, nt) * amplitude;
                ctx.lineTo(x, y + h * 0.5);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        ctx.fillStyle = "#1e002e";
        ctx.globalAlpha = waveOpacity;
        ctx.fillRect(0, 0, w, h);
        ctx.filter = `blur(${blur}px)`;

        drawWave(6);
        requestAnimationFrame(render);
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

    let w, h, waveWidth, blur, amplitude, noiseScale;
    let nt = 0;

    const waveColors = [
        "#4c1d95", "#0f766e", "#5b21b6", "#be185d",
        "#4338ca", "#1d4ed8", "#701a75"
    ];
    const waveOpacity = 0.35;

    function updateParams() {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
        const scale = Math.min(w / 1400, 1);
        waveWidth = 100 * scale;
        blur = Math.round(25 * scale);
        amplitude = 200 * scale;
        noiseScale = 400 * scale;
    }

    updateParams();
    window.addEventListener('resize', updateParams);

    const drawWave = (n) => {
        nt += 0.0025;
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];

            for (let x = 0; x < w; x += 30) {
                const y = simplex.noise3D(x / noiseScale, 0.2 * i, nt) * amplitude;
                ctx.lineTo(x, y + h * 0.5);
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        ctx.clearRect(0, 0, w, h);

        ctx.filter = `blur(${blur}px)`;
        ctx.globalAlpha = waveOpacity;

        drawWave(10);
        requestAnimationFrame(render);
    };

    render();
}
