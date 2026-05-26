/* ==========================================================================
   JavaScript Logic for Traditional Telugu Engagement Invitation
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 0. Configuration ---
    // If you want to save RSVPs to a Google Sheet:
    // 1. Follow the Google Apps Script instructions.
    // 2. Paste your deployed Web App URL below between the quotes!
    // If left blank (""), the form runs in a local test/simulation mode.
    const RSVP_API_URL = "https://script.google.com/macros/s/AKfycbzCg3JD_mdRF9EqjqbeOH1K1__1E1PxhYwN4JYCRxKQr92_mCkZ8EaaQONdYP5-SvNV/exec";

    // --- 1. Countdown Timer (Subhamuhurtham) ---
    // Target Date: June 21, 2026, 11:30:00 AM (Auspicious Sumuhurtham)
    const targetDate = new Date('June 21, 2026 11:30:00').getTime();

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Event has started!
            if (daysEl) daysEl.innerText = "00";
            if (hoursEl) hoursEl.innerText = "00";
            if (minutesEl) minutesEl.innerText = "00";
            if (secondsEl) secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (daysEl) daysEl.innerText = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.innerText = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.innerText = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.innerText = String(seconds).padStart(2, '0');
    }

    // Run initially and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);


    // --- 2. Marigold Falling Petals Canvas Particle System ---
    const canvas = document.getElementById('marigold-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const petalCount = 45;
        const petals = [];

        // Traditional marigold colors (turmeric yellows, kumkum oranges)
        const colors = [
            '#FDB813', // Turmeric Yellow
            '#FF8F00', // Deep Orange
            '#FFA000', // Marigold Light Orange
            '#FFC107', // Amber Gold
            '#E65100'  // Vermillion Red-Orange
        ];

        class Petal {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * -height - 20;
                this.size = Math.random() * 8 + 6;
                this.speedY = Math.random() * 1.5 + 0.8;
                this.speedX = Math.random() * 1 - 0.5;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.angle = Math.random() * Math.PI * 2;
                this.spin = Math.random() * 0.02 - 0.01;
                this.opacity = Math.random() * 0.4 + 0.6; // High visibility
                this.curl = Math.random() * 4 + 2;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX + Math.sin(this.y / 30) * 0.3; // Gentle wind swing
                this.angle += this.spin;

                // If it goes out of screen bounds, reset it
                if (this.y > height + 20 || this.x < -20 || this.x > width + 20) {
                    this.reset();
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.beginPath();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;

                // Drawing traditional oval/marigold petal shape
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(this.size, -this.size / 2, this.size, this.size / 2, 0, this.size);
                ctx.bezierCurveTo(-this.size, this.size / 2, -this.size, -this.size / 2, 0, 0);

                ctx.fill();

                // Draw a sweet subtle gold outline for premium detail
                ctx.strokeStyle = '#D4AF37';
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = this.opacity * 0.4;
                ctx.stroke();

                ctx.restore();
            }
        }

        // Initialize Petals
        for (let i = 0; i < petalCount; i++) {
            const p = new Petal();
            // Stagger initial heights to make them float continuously from startup
            p.y = Math.random() * height;
            petals.push(p);
        }

        function animatePetals() {
            ctx.clearRect(0, 0, width, height);
            petals.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animatePetals);
        }

        animatePetals();
    }


    // --- 3. Scroll-to-Reveal Animation (Intersection Observer) ---
    const revealElements = document.querySelectorAll('.reveal-element');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        revealElements.forEach(el => el.classList.add('active'));
    }


    // --- 4. Enter button handles scrolling past intro ---
    const enterInviteBtn = document.getElementById('btn-enter-invite');
    if (enterInviteBtn) {
        enterInviteBtn.addEventListener('click', () => {
            const heroSection = document.getElementById('hero-section');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }


    // --- 5. Interactive RSVP Form Submission to Google Sheets / Formspree ---
    const rsvpForm = document.getElementById('rsvp-invitation-form');
    const formSuccessMessage = document.getElementById('form-success');

    function showSuccessState() {
        // Apply scale down animation to the form
        rsvpForm.style.transition = 'all 0.5s ease';
        rsvpForm.style.opacity = '0';
        rsvpForm.style.transform = 'scale(0.9)';

        setTimeout(() => {
            rsvpForm.style.display = 'none';

            // Show traditional Telugu success blessing card with smooth fade in
            formSuccessMessage.style.display = 'block';
            formSuccessMessage.style.opacity = '0';
            formSuccessMessage.style.transform = 'scale(1.05)';

            // Force layout reflow
            formSuccessMessage.offsetHeight;

            formSuccessMessage.style.transition = 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
            formSuccessMessage.style.opacity = '1';
            formSuccessMessage.style.transform = 'scale(1)';

            // Trigger a local burst of extra falling marigold petals as a celebration!
            if (petals && petals.length > 0) {
                for (let i = 0; i < 30; i++) {
                    const extraPetal = new Petal();
                    extraPetal.y = Math.random() * -100; // spawn at top
                    extraPetal.speedY = Math.random() * 3 + 2; // fall faster for celebration burst
                    petals.push(extraPetal);
                }
            }
        }, 500);
    }

    if (rsvpForm && formSuccessMessage) {
        rsvpForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent page reload

            // Fetch inputs
            const guestName = document.getElementById('guest-name').value;
            const attendanceStatus = document.querySelector('input[name="attendance-status"]:checked').value;
            const guestCount = document.getElementById('guest-count').value;
            const guestMessage = document.getElementById('guest-message').value;

            // Prepare payload
            const payload = {
                name: guestName,
                attendance: attendanceStatus === "joyfully-accept" ? "Yes, I'll Be There" : "Decline Warmly",
                guests: guestCount,
                message: guestMessage
            };

            console.log("RSVP Submission received:", payload);

            if (RSVP_API_URL) {
                // Change submit button state to loading
                const submitBtn = rsvpForm.querySelector('.btn-submit');
                const originalText = submitBtn.innerText;
                submitBtn.innerText = "Submitting...";
                submitBtn.disabled = true;

                // POST fetch request to Google Apps Script / Formspree
                fetch(RSVP_API_URL, {
                    method: 'POST',
                    mode: 'no-cors', // Direct bypass for Google Web App CORS policies
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                })
                    .then(() => {
                        showSuccessState();
                    })
                    .catch(err => {
                        console.error("Submission failed, fallback to local success state:", err);
                        showSuccessState();
                    });
            } else {
                // Fallback simulation mode
                showSuccessState();
            }
        });
    }
});
