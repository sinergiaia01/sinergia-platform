document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If it's a stats item, animate the counter
                const counter = entry.target.querySelector('.counter');
                if (counter && !counter.classList.contains('animated')) {
                    animateCounter(counter);
                    counter.classList.add('animated');
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section-reveal').forEach(el => {
        revealObserver.observe(el);
    });

    // Counter Animation Logic
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        const duration = 2000;
        const stepTime = 16; // 60fps
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, stepTime);
    }

    // Mobile Menu Toggle (Simplified)
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'rgba(0,0,0,0.95)';
            navLinks.style.padding = '40px';
        });
    }

    // Smooth Scroll for Nav Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Particle Background (Simplified Canvas approach)
    const initParticles = () => {
        const container = document.getElementById('particles-js');
        if (!container) return;

        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.style.position = 'absolute';
            particle.style.width = Math.random() * 3 + 'px';
            particle.style.height = particle.style.width;
            particle.style.backgroundColor = 'rgba(0, 230, 118, ' + (Math.random() * 0.3 + 0.1) + ')';
            particle.style.borderRadius = '50%';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';

            const animation = particle.animate([
                { transform: 'translate(0, 0)', opacity: 0.3 },
                { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * -200 - 50}px)`, opacity: 0 }
            ], {
                duration: 5000 + Math.random() * 5000,
                iterations: Infinity,
                easing: 'ease-out'
            });

            container.appendChild(particle);
        }
    };

    initParticles();

    // 3D Tilt Effect for Service Cards
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
        });
    });

    // Mesh Gradient Mouse Follow
    const mesh = document.querySelector('.mesh-gradient');
    document.addEventListener('mousemove', (e) => {
        if (!mesh) return;
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        mesh.style.background = `
            radial-gradient(at ${x}% ${y}%, hsla(150,100%,50%,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, hsla(220,100%,50%,0.15) 0px, transparent 50%),
            radial-gradient(at 100% 100%, hsla(280,100%,50%,0.1) 0px, transparent 50%),
            radial-gradient(at 0% 100%, hsla(150,100%,50%,0.1) 0px, transparent 50%)
        `;
    });

    // Form Submission Logic (n8n ready)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
                ? 'http://localhost:5000'
                : 'https://api.sinergia.sbs';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            formStatus.textContent = 'Enviando...';
            formStatus.className = 'form-status';

            try {
                const response = await fetch(`${API_URL}/api/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (result.success) {
                    formStatus.textContent = '🎉 ¡Mensaje enviado con éxito! Nos contactaremos pronto.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    throw new Error(result.message || 'Error al enviar');
                }

            } catch (error) {
                formStatus.textContent = '❌ Hubo un error al enviar. Por favor intenta de nuevo.';
                formStatus.className = 'form-status error';
            }
        });
    }
});
