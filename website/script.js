/* ═══════════════════════════════════════════════════════════════════════
   SHIFT — Landing Page Scripts
   ═══════════════════════════════════════════════════════════════════════ */

// ── Fade-in on scroll ────────────────────────────────────────────────
const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.fade-in').forEach((el) => observer.observe(el));

// ── Mobile nav toggle ────────────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        navToggle.classList.toggle('active');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            navToggle.classList.remove('active');
        });
    });
}

// ── Nav scroll effect ────────────────────────────────────────────────
const nav = document.querySelector('.nav');

if (nav) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

// ── Hero Wave Animation (WavyBackground Port) ────────────────────────
const initWaves = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    
    // Ensure SimplexNoise is available from CDN
    if (typeof SimplexNoise === 'undefined') {
        console.warn('SimplexNoise library not loaded.');
        return;
    }

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;
    let nt = 0;
    
    const waveColors = [
        "#ff0080", // Vibrant Pink
        "#7928ca", // Deep Purple
        "#4f46e5", // Indigo
        "#00d4ff", // Cyan
        "#ff0080"  // Pink loop
    ];
    
    const waveWidth = 200; // Much thicker to create the "aurora" effect
    const blur = 30; // High blur for soft gradients
    const waveOpacity = 0.5;

    // Fixed resize handler
    window.addEventListener('resize', () => {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
        ctx.filter = `blur(${blur}px)`;
    });

    const drawWave = (n) => {
        nt += 0.003; 
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];
            
            for (let x = 0; x < w; x += 5) {
                // Using 3D noise (x, y, z) -> (position, layer, time)
                // x / 600 -> smoother, wider curves
                // Multiplier * 300 -> tall amplitude
                const y = simplex.noise3D(x / 600, 0.3 * i, nt) * 300;
                ctx.lineTo(x, y + h * 0.5); 
            }
            ctx.stroke();
            ctx.closePath();
        }
    };

    const render = () => {
        ctx.fillStyle = "#1e002e"; // Deep plum/dark violet background
        ctx.globalAlpha = waveOpacity;
        ctx.fillRect(0, 0, w, h);
        ctx.filter = `blur(${blur}px)`;
        
        drawWave(6); 
        requestAnimationFrame(render);
    };

    render();
};

// ── Team Selection Wave Animation (Darker/Subtle) ────────────────────
const initTeamWaves = () => {
    const canvas = document.getElementById('team-canvas');
    if (!canvas) return;

    if (typeof SimplexNoise === 'undefined') return;

    const ctx = canvas.getContext('2d');
    const simplex = new SimplexNoise();

    let w = canvas.width = canvas.parentElement.offsetWidth;
    let h = canvas.height = canvas.parentElement.offsetHeight;
    let nt = 0;
    
    // "More waves and colours" but "not bright" -> richer dark palette
    const waveColors = [
        "#4c1d95", // Violet-900
        "#0f766e", // Teal-700 (Deep Teal)
        "#5b21b6", // Violet-800
        "#be185d", // Pink-700 (Deep Pink, not neon)
        "#4338ca", // Indigo-700
        "#1d4ed8", // Blue-700 (Darker Blue)
        "#701a75", // Fuchsia-900
    ];
    
    const waveWidth = 100; // Slightly thinner to accommodate more layers without clogging
    const blur = 25; 
    const waveOpacity = 0.35; // Slight bump to see the new colors

    window.addEventListener('resize', () => {
        w = canvas.width = canvas.parentElement.offsetWidth;
        h = canvas.height = canvas.parentElement.offsetHeight;
        ctx.filter = `blur(${blur}px)`;
    });

    const drawWave = (n) => {
        nt += 0.0025; 
        for (let i = 0; i < n; i++) {
            ctx.beginPath();
            ctx.lineWidth = waveWidth;
            ctx.strokeStyle = waveColors[i % waveColors.length];
            
            for (let x = 0; x < w; x += 30) { 
                // Larger amplitude (200) for more "movement/presence"
                const y = simplex.noise3D(x / 400, 0.2 * i, nt) * 200;
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
        
        drawWave(10); // "More waves" -> Increased from 4 to 10
        requestAnimationFrame(render);
    };

    render();
};

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initWaves();
    initTeamWaves();
    
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            navToggle.classList.toggle('active');
        });

        // Close mobile nav on link click (retained from original logic)
        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                navToggle.classList.remove('active');
            });
        });
    }

    // Navbar Scroll Effect
    const nav = document.querySelector('.nav');
    if (nav) { // Ensure nav exists before adding listener
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) { // Original threshold was 20, new was 50. Sticking to original.
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        });
    }

    // Fade-in Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px' // Retaining original rootMargin
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Retaining original class add
                // The new instruction had `entry.target.style.animationPlayState = 'running'; observer.unobserve(entry.target);`
                // but the original used `classList.add('visible')` and didn't unobserve.
                // Sticking to original behavior for fade-in unless explicitly told to change.
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        // Original code didn't set animationPlayState to paused initially.
        // Sticking to original behavior for fade-in unless explicitly told to change.
        observer.observe(el);
    });
});

// ── Smooth Scroll for Anchor Links ───────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = 80; // approximate nav height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navHeight;
    
            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});
