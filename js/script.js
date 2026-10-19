/* ============================================================
   KISHAN KUMAR — Portfolio Scripts (Vanilla JS)
   Typing | Counters | Reveal | Filters | Menu | Form | More
   ============================================================ */

'use strict';

/* ---------- Helper ---------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ============================================================
   1. Preloader
============================================================ */
window.addEventListener('load', () => {
    const preloader = $('#preloader');
    setTimeout(() => preloader.classList.add('hidden'), 450);
    // Fallback hide (agar 'load' event slow ho)
    setTimeout(() => preloader.classList.add('hidden'), 3000);
});

/* ============================================================
   2. Cursor Glow (desktop only)
============================================================ */
const cursorGlow = $('#cursorGlow');
const isDesktop = window.matchMedia('(pointer: fine)').matches;

if (cursorGlow && isDesktop) {
    let gx = 0, gy = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', (e) => {
        gx = e.clientX;
        gy = e.clientY;
        cursorGlow.style.opacity = '1';
    });

    (function animateGlow() {
        cx += (gx - cx) * 0.08;
        cy += (gy - cy) * 0.08;
        cursorGlow.style.left = cx + 'px';
        cursorGlow.style.top = cy + 'px';
        requestAnimationFrame(animateGlow);
    })();
}

/* ============================================================
   3. Navbar — scrolled state + scrollspy + mobile menu
============================================================ */
const navbar = $('#navbar');
const navMenu = $('#navMenu');
const hamburger = $('#hamburger');
const navLinks = $$('.nav-link');
const sections = $$('main section[id]');

window.addEventListener('scroll', () => {
    // Scrolled background
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Scrollspy
    let current = 'home';
    sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Back to top visibility
    const backToTop = $('#backToTop');
    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close menu on link click
navLinks.forEach((link) => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

/* ============================================================
   4. Typing Effect
============================================================ */
const typingEl = $('#typing');
const roles = [
    'Full Stack Software Engineer',
    'PHP & Laravel Expert',
    'REST API Developer',
    'React.js Developer',
    'MySQL Database Designer'
];

let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeEffect() {
    const current = roles[roleIndex];

    typingEl.textContent = current.substring(0, charIndex);

    if (!isDeleting && charIndex < current.length) {
        charIndex++;
        setTimeout(typeEffect, 65);
    } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 32);
    } else {
        if (!isDeleting) {
            isDeleting = true;
            setTimeout(typeEffect, 1800); // pause at full word
        } else {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(typeEffect, 350);
        }
    }
}

if (typingEl) typeEffect();

/* ============================================================
   5. Reveal on Scroll + Counters + Skill Bars
============================================================ */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        el.classList.add('revealed');

        // Counter animation
        const counter = el.querySelector('.counter');
        if (counter && !counter.dataset.done) {
            counter.dataset.done = '1';
            animateCounter(counter);
        }

        // Skill bar fill
        const bar = el.querySelector('.skill-bar span');
        if (bar && !bar.dataset.done) {
            bar.dataset.done = '1';
            setTimeout(() => { bar.style.width = bar.style.getPropertyValue('--w'); }, 120);
        }

        revealObserver.unobserve(el);
    });
}, { threshold: 0.18, rootMargin: '0px 0px -40px 0px' });

$$('.reveal').forEach((el) => revealObserver.observe(el));

function animateCounter(el) {
    const target = +el.dataset.count;
    const duration = 1600;
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
}

/* ============================================================
   6. Skills Filter
============================================================ */
const skillFilterBtns = $$('[data-skill-filter]');
const skillItems = $$('#skillsGrid .skill-item');

skillFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        skillFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const value = btn.dataset.skillFilter;
        skillItems.forEach((item) => {
            const show = value === 'all' || item.dataset.category === value;
            item.classList.toggle('hide', !show);
            if (show) {
                item.classList.remove('revealed');
                requestAnimationFrame(() => item.classList.add('revealed'));
            }
        });
    });
});

/* ============================================================
   7. Projects Filter
============================================================ */
const projectFilterBtns = $$('[data-filter]');
const projectCards = $$('#projectsGrid .project-card');

projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
        projectFilterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const value = btn.dataset.filter;
        projectCards.forEach((card) => {
            const show = value === 'all' || card.dataset.category === value;
            card.classList.toggle('hide', !show);
            if (show) {
                card.classList.remove('revealed');
                requestAnimationFrame(() => card.classList.add('revealed'));
            }
        });
    });
});

/* ============================================================
   8. Back To Top
============================================================ */
$('#backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   9. Contact Form (FormSubmit AJAX)
============================================================ */
const contactForm = $('#contactForm');
const submitBtn = $('#submitBtn');
const formStatus = $('#formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btnText = submitBtn.querySelector('.btn-text');
        const original = btnText.textContent;

        btnText.textContent = 'Sending...';
        submitBtn.disabled = true;
        formStatus.style.color = '#96a0b5';
        formStatus.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.style.color = '#34d399';
                formStatus.textContent = '✓ Message sent successfully! I will get back to you within 24 hours.';
                contactForm.reset();
            } else {
                throw new Error('Send failed');
            }
        } catch (err) {
            formStatus.style.color = '#f87171';
            formStatus.textContent = 'Message could not send. Please email me directly at kishankashyap0563@gmail.com';
        } finally {
            btnText.textContent = original;
            submitBtn.disabled = false;
        }
    });
}

/* ============================================================
   10. Blob Parallax (light mouse parallax on desktop)
============================================================ */
if (isDesktop) {
    const blobs = $$('.blob');
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5);
        const y = (e.clientY / window.innerHeight - 0.5);
        blobs.forEach((blob, i) => {
            const depth = (i + 1) * 14;
            blob.style.marginLeft = x * depth + 'px';
            blob.style.marginTop = y * depth + 'px';
        });
    }, { passive: true });
}

/* ============================================================
   11. Auto Year + Smooth anchor offset for older browsers
============================================================ */
$('#year').textContent = new Date().getFullYear();

$$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
        const id = anchor.getAttribute('href');
        if (id === '#' || id.length < 2) return;
        const target = $(id);
        if (!target) return;
        e.preventDefault();
        const top = id === '#home' ? 0 : target.getBoundingClientRect().top + window.scrollY - 78;
        window.scrollTo({ top, behavior: 'smooth' });
    });
});
