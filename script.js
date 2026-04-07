// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && mobileMenu.classList.contains('open')) {
                mobileMenu.classList.remove('open');
            }
        }
    });
});

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}

// Hero section slideshow
function initHeroSlideshow() {
    const slides = document.querySelectorAll('.hero-slide');
    let currentSlide = 0;
    if (slides.length === 0) return;
    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        slides[index].classList.add('active');
    }
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    setInterval(nextSlide, 5000);
}

// Intersection Observer for section animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, observerOptions);
    document.querySelectorAll('.section-animate').forEach(section => {
        observer.observe(section);
    });
}

// Animate skill bars when they come into view
function initSkillBarAnimations() {
    const observerOptions = {
        threshold: 0.5
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-bar-fill');
                skillBars.forEach(bar => {
                    const width = bar.style.width;
                    bar.style.width = '0';
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 100);
                });
            }
        });
    }, observerOptions);
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Initialize Network Background Animation
function initNetworkBackground() {
    const networkContainer = document.getElementById('network-background');
    if (!networkContainer) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'network-canvas';
    networkContainer.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = networkContainer.clientWidth;
    let height = networkContainer.clientHeight;
    canvas.width = width;
    canvas.height = height;

    const config = {
        nodeColor: 'rgba(45, 212, 191, 0.8)',
        lineColor: 'rgba(45, 212, 191, 0.2)',
        nodeRadius: 2,
        nodeCount: 100,
        maxDistance: 150,
        speed: 0.5
    };

    class Node {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * config.speed;
            this.vy = (Math.random() - 0.5) * config.speed;
            this.radius = config.nodeRadius + Math.random() * 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            this.x = Math.max(0, Math.min(this.x, width));
            this.y = Math.max(0, Math.min(this.y, height));
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = config.nodeColor;
            ctx.fill();
        }
    }

    let nodes = [];
    for (let i = 0; i < config.nodeCount; i++) {
        nodes.push(new Node());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        nodes.forEach(node => {
            node.update();
            node.draw();
        });

        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = 1;
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < config.maxDistance) {
                    const opacity = 1 - (distance / config.maxDistance);
                    ctx.strokeStyle = `rgba(45, 212, 191, ${0.2 * opacity})`;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    function resizeCanvas() {
        width = networkContainer.clientWidth;
        height = networkContainer.clientHeight;
        canvas.width = width;
        canvas.height = height;
        nodes = [];
        for (let i = 0; i < config.nodeCount; i++) {
            nodes.push(new Node());
        }
    }

    window.addEventListener('resize', resizeCanvas);

    animate();
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initHeroSlideshow();
    initScrollAnimations();
    initSkillBarAnimations();
    initNetworkBackground();
});
