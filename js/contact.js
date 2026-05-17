/**
 * contact.js — Premium dynamic functionalities for the Contact page
 * Implements: Smart prefill, simulated high-conviction form post, problem challenge, and live timezone clock.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live Timezone Clock (IST - UTC+5:30)
  const updateClock = () => {
    const clockEl = document.getElementById('local-time');
    if (!clockEl) return;

    try {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      
      const formatter = new Intl.DateTimeFormat('en-US', options);
      clockEl.textContent = formatter.format(new Date());
    } catch (e) {
      // Fallback if Intl.DateTimeFormat timezone is unsupported
      const now = new Date();
      // UTC time
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      // IST is UTC + 5.5 hours
      const istTime = new Date(utc + (3600000 * 5.5));
      clockEl.textContent = istTime.toLocaleTimeString();
    }
  };

  updateClock();
  setInterval(updateClock, 1000);

  // 2. Smart Subject Line Prefill
  const urlParams = new URLSearchParams(window.location.search);
  const subjectParam = urlParams.get('subject');
  const referrer = document.referrer.toLowerCase();
  const subjectInput = document.getElementById('subject');

  if (subjectInput) {
    if (subjectParam === 'projects' || referrer.includes('projects.html') || referrer.includes('projects')) {
      subjectInput.value = "Enquiry about SmartDoc Parser";
    } else if (subjectParam === 'experience' || referrer.includes('experience_new.html') || referrer.includes('experience.html') || referrer.includes('experience')) {
      subjectInput.value = "AI/ML Role Discussion";
    }
  }

  // 3. Simple fade-up animation triggers via GSAP if loaded
  if (typeof gsap !== 'undefined') {
    gsap.from('.card', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
      clearProps: 'all'
    });
  }
});

/**
 * Handle form submission with premium micro-interactions
 */
window.handleSubmit = function(event) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('.btn-submit');
  const successState = document.querySelector('.form-success-state');

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  }

  // Simulate form submission to showcase custom product thinking
  setTimeout(() => {
    form.style.transition = 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
    form.style.opacity = '0';
    form.style.transform = 'translateY(-10px)';

    setTimeout(() => {
      form.style.display = 'none';
      if (successState) {
        successState.style.display = 'flex';
        // Force reflow
        successState.offsetHeight;
        successState.style.opacity = '1';
        successState.style.transform = 'translateY(0)';
      }
    }, 400);
  }, 1200);
};

/**
 * Handle the "Challenge Me" proposal card submission
 */
window.handleChallenge = function() {
  const challengeArea = document.getElementById('challengeText');
  const text = challengeArea ? challengeArea.value : '';

  if (!text || !text.trim()) {
    alert("Please enter a short description of your system bottleneck or manual process so I can propose a high-level system design!");
    return;
  }

  const origText = challengeArea.value;
  challengeArea.value = '';
  challengeArea.placeholder = 'Challenge received! Preparing custom architecture proposal...';
  challengeArea.disabled = true;
  
  const challengeBtn = document.querySelector('.challenge-card button');
  if (challengeBtn) {
    challengeBtn.disabled = true;
    challengeBtn.textContent = 'Analyzing Bottleneck...';
  }

  setTimeout(() => {
    if (challengeBtn) {
      challengeBtn.innerHTML = '<i class="fas fa-check"></i> Proposal Initialized!';
      challengeBtn.style.background = '#22c55e';
      challengeBtn.style.color = '#fff';
    }
    alert("High-conviction bottleneck challenge received! Gopikrishna is already designing an optimal MLOps/RAG architecture. Check your inbox (chegoni.gk@gmail.com) or LinkedIn messages in under 24 hours for your bespoke PDF proposal.");
  }, 1500);
};
