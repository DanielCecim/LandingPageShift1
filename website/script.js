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

// Initialize waves when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaves);
} else {
    initWaves();
}

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

