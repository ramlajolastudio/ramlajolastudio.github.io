/* ===== FUTURISTIC INTRO ===== */
(function() {
    const overlay = document.getElementById('introOverlay');
    const introCanvas = document.getElementById('introCanvas');
    const introCtx = introCanvas.getContext('2d');
    const taglineEl = document.getElementById('introTagline');

    document.body.classList.add('intro-active');

    // Resize intro canvas
    function resizeIntroCanvas() {
        introCanvas.width = window.innerWidth;
        introCanvas.height = window.innerHeight;
    }
    resizeIntroCanvas();
    window.addEventListener('resize', resizeIntroCanvas);

    // Intro particle grid
    const gridParticles = [];
    const gridCols = Math.floor(window.innerWidth / 30);
    const gridRows = Math.floor(window.innerHeight / 30);

    for (let i = 0; i < 80; i++) {
        gridParticles.push({
            x: Math.random() * introCanvas.width,
            y: Math.random() * introCanvas.height,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 1.5,
            speedY: (Math.random() - 0.5) * 1.5,
            opacity: Math.random() * 0.5 + 0.2,
            color: Math.random() > 0.5 ? '#e6b800' : '#ccff00'
        });
    }

    let introAnimId;
    function animateIntroParticles() {
        introCtx.clearRect(0, 0, introCanvas.width, introCanvas.height);

        gridParticles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = introCanvas.width;
            if (p.x > introCanvas.width) p.x = 0;
            if (p.y < 0) p.y = introCanvas.height;
            if (p.y > introCanvas.height) p.y = 0;

            introCtx.beginPath();
            introCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            introCtx.fillStyle = p.color;
            introCtx.globalAlpha = p.opacity;
            introCtx.fill();
        });

        // Draw connecting lines
        gridParticles.forEach((a, i) => {
            gridParticles.slice(i + 1).forEach(b => {
                const dx = a.x - b.x;
                const dy = a.y - b.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    introCtx.beginPath();
                    introCtx.moveTo(a.x, a.y);
                    introCtx.lineTo(b.x, b.y);
                    introCtx.strokeStyle = '#e6b800';
                    introCtx.globalAlpha = (1 - dist / 120) * 0.15;
                    introCtx.lineWidth = 0.5;
                    introCtx.stroke();
                }
            });
        });

        introCtx.globalAlpha = 1;
        introAnimId = requestAnimationFrame(animateIntroParticles);
    }
    animateIntroParticles();

    // Letter scramble effect
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&';
    const letters = document.querySelectorAll('.intro-letter:not(.intro-space)');

    letters.forEach((letter, i) => {
        const original = letter.textContent;
        const startTime = 800 + i * 70;
        let scrambleInterval;

        setTimeout(() => {
            let count = 0;
            scrambleInterval = setInterval(() => {
                letter.textContent = chars[Math.floor(Math.random() * chars.length)];
                count++;
                if (count > 6) {
                    clearInterval(scrambleInterval);
                    letter.textContent = original;
                }
            }, 50);
        }, startTime);
    });

    // Tagline typing effect
    const taglineText = 'CREATIVE  STUDIO';
    let charIndex = 0;
    setTimeout(() => {
        const typeInterval = setInterval(() => {
            taglineEl.textContent = taglineText.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex >= taglineText.length) {
                clearInterval(typeInterval);
                setTimeout(() => taglineEl.classList.add('typing-done'), 500);
            }
        }, 80);
    }, 2000);

    // Exit intro after animations complete
    setTimeout(() => {
        overlay.classList.add('intro-exit');
        setTimeout(() => {
            overlay.remove();
            document.body.classList.remove('intro-active');
            cancelAnimationFrame(introAnimId);
        }, 800);
    }, 3800);
})();

/* ===== PARTICLE BACKGROUND ===== */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: 0, y: 0 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.targetOpacity = this.opacity;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
            const force = (120 - dist) / 120;
            this.x -= dx * force * 0.02;
            this.y -= dy * force * 0.02;
            this.targetOpacity = 0.8;
        } else {
            this.targetOpacity = this.opacity;
        }

        this.opacity += (this.targetOpacity - this.opacity) * 0.05;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 184, 0, ${this.opacity})`;
        ctx.fill();
    }
}

// Create particles
const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.15;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(230, 184, 0, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawConnections();
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* ===== CUSTOM CURSOR ===== */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
});

function animateCursor() {
    followerX += (cursorX - followerX) * 0.12;
    followerY += (cursorY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor hover effects
const hoverElements = document.querySelectorAll('a, button, .work-item, .service-card');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

/* ===== NAVIGATION ===== */
const nav = document.getElementById('nav');
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

// Scroll effect
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 100;
        if (window.scrollY >= top) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
});

/* ===== SCROLL REVEAL ===== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
const statNumbers = document.querySelectorAll('.stat-number');
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-count'));
            animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

function animateCounter(el, target) {
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
        } else {
            el.textContent = Math.floor(current);
        }
    }, 30);
}

/* ===== PORTFOLIO FILTERS ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const workItems = document.querySelectorAll('.work-item');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        workItems.forEach(item => {
            if (filter === 'all' || item.getAttribute('data-category') === filter) {
                item.classList.remove('hidden');
                item.style.animation = 'fadeInUp 0.5s ease forwards';
            } else {
                item.classList.add('hidden');
            }
        });
    });
});

/* ===== CONTACT FORM ===== */
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = `<span>Message Sent!</span>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
        </svg>`;
    btn.style.background = 'linear-gradient(135deg, #e6b800, #ccff00)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        e.target.reset();
    }, 3000);
});

/* ===== SMOOTH SCROLL FOR ALL ANCHOR LINKS ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ===== MAGNETIC BUTTON EFFECT ===== */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
    });
});

/* ===== TILT EFFECT ON SERVICE CARDS ===== */
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ===== PAGE LOAD GLITCH TITLE EFFECT ===== */
const titleLines = document.querySelectorAll('.title-line');
titleLines.forEach((line, i) => {
    const text = line.textContent;
    line.setAttribute('data-text', text);
});
