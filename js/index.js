{
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Gopikrishna Chegoni",
    "jobTitle": "AI/ML Engineer",
    "email": "chegoni.gk@gmail.com",
    "telephone": "+91-8184835291",
    "url": "https://gopikrishna818.github.io/",
    "image": "https://gopikrishna818.github.io/pp-1.png",
    "sameAs": [
      "https://www.linkedin.com/in/gopikrishnachegoni/",
      "https://github.com/gopikrishna818"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressCountry": "IN"
    },
    "alumniOf": {
      "@type": "CollegeOrUniversity",
      "name": "Guru Nanak Institutions Technical Campus"
    },
    "knowsAbout": ["Machine Learning", "OCR", "Python", "FastAPI", "Document Intelligence", "AI Automation"]
  }

// ── SCRAMBLE TEXT CLASS ──
    class TextScramble {
      constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
      }
      setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
          const from = oldText[i] || '';
          const to = newText[i] || '';
          const start = Math.floor(Math.random() * 40);
          const end = start + Math.floor(Math.random() * 40);
          this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
      }
      update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
          let { from, to, start, end, char } = this.queue[i];
          if (this.frame >= end) {
            complete++;
            output += to;
          } else if (this.frame >= start) {
            if (!char || Math.random() < 0.28) {
              char = this.randomChar();
              this.queue[i].char = char;
            }
            output += `<span class="dud">${char}</span>`;
          } else {
            output += from;
          }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
          this.resolve();
        } else {
          this.frameRequest = requestAnimationFrame(this.update);
          this.frame++;
        }
      }
      randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
      }
    }

    // ── FORM SUBMISSION ──
    function handleSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const submitBtn = form.querySelector('.btn-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      fetch("https://formsubmit.co/ajax/chegoni.gk@gmail.com", {
        method: "POST",
        headers: { 'Accept': 'application/json' },
        body: new FormData(form)
      })
        .then(response => response.json())
        .then(data => {
          form.style.display = 'none';
          const successState = form.parentElement.querySelector('.form-success-state');
          if (successState) {
            successState.style.display = 'flex';
            setTimeout(() => {
              successState.style.opacity = '1';
              successState.style.transform = 'translateY(0)';
            }, 50);
          }
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        })
        .catch(error => {
          alert('Oops! Something went wrong. Please try again later.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        });
    }

    // ── ALL PAGE ANIMATIONS (single unified IIFE) ──
    (() => {
      if (typeof gsap === 'undefined') return;
      gsap.registerPlugin(ScrollTrigger);

      // ── CINEMATIC ENTRANCE (runs first, immediately) ──
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl
        .from('nav', { y: -40, opacity: 0, duration: 0.4, delay: 0.05 })
        .from('.hero-available', { opacity: 0, y: 10, duration: 0.3 }, '-=0.15')
        .from('.hero-role', { opacity: 0, y: 12, duration: 0.4 }, '-=0.15')
        .from('.hero-name', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
        .from('.hero-desc', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
        .from('.hero-btns', { opacity: 0, y: 8, duration: 0.3 }, '-=0.15')
        .from('.photo-card', { opacity: 0, scale: 0.98, duration: 0.5 }, '-=0.4');

      // ── 3D TILT for Photo & Project Cards ──
      document.querySelectorAll('.photo-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const x = e.clientX - r.left;
          const y = e.clientY - r.top;
          const rx = (y - r.height / 2) / 10;
          const ry = (r.width / 2 - x) / 10;
          gsap.to(card, { rotateX: rx, rotateY: ry, transformPerspective: 1000, duration: 0.5 });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.8, ease: "elastic.out(1, 0.3)" });
        });
      });

      // ── PHOTO PARALLAX ──
      const photoImg = document.querySelector('.photo-inner img');
      if (photoImg) {
        ScrollTrigger.create({
          trigger: '.photo-card',
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            gsap.to(photoImg, { y: self.progress * -40, duration: 0.1, ease: 'none' });
          }
        });
      }

      // ── COUNTER ANIMATION ──
      document.querySelectorAll('.count-up').forEach(counter => {
        const target = parseFloat(counter.dataset.target);
        const decimals = parseInt(counter.dataset.decimals || '0');
        ScrollTrigger.create({
          trigger: counter,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            const duration = 1800;
            const startTime = performance.now();
            const update = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = target * eased;
              counter.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
              if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
          }
        });
      });

      // ── STAGGERED REVEALS (skip hero elements — cinematic entrance handles those) ──
      const heroSelectors = ['hero-card', 'photo-card'];
      gsap.utils.toArray('.card, .bento-grid section, .section-header').forEach((el) => {
        if (heroSelectors.some(cls => el.classList.contains(cls))) return;
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none none" },
          opacity: 0, y: 60, scale: 0.98, duration: 1.2, ease: "power4.out"
        });
      });

      // ── PROCESS CARDS STAGGER ──
      const procesCards = document.querySelectorAll('.card[style*="padding: 32px"]');
      if (procesCards.length > 0) {
        gsap.from(procesCards, {
          scrollTrigger: { trigger: procesCards[0].parentElement, start: 'top 80%' },
          opacity: 0, y: 40, stagger: 0.12, duration: 0.8, ease: 'power3.out'
        });
      }
    })();

    // ── GITHUB LIVE ACTIVITY FEED ──
    document.addEventListener('DOMContentLoaded', async () => {
      const feed = document.getElementById('gh-feed');
      if (!feed) return;
      const USER = 'gopikrishna818';

      const typeLabel = {
        PushEvent: { icon: 'fa-code-branch', color: '#0044ee', label: 'Pushed' },
        CreateEvent: { icon: 'fa-plus-circle', color: '#00b96b', label: 'Created' },
        PullRequestEvent: { icon: 'fa-code-pull-request', color: '#7b2ff7', label: 'PR' },
        WatchEvent: { icon: 'fa-star', color: '#f5a623', label: 'Starred' },
        ForkEvent: { icon: 'fa-code-fork', color: '#ff4d00', label: 'Forked' },
        IssuesEvent: { icon: 'fa-circle-exclamation', color: '#e53e3e', label: 'Issue' },
        default: { icon: 'fa-circle-dot', color: '#888', label: 'Activity' }
      };

      const timeAgo = (dateStr) => {
        const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
        return `${Math.floor(diff/86400)}d ago`;
      };

      try {
        const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=10`);
        if (!res.ok) throw new Error('API error');
        const events = await res.json();

        if (!events.length) {
          feed.innerHTML = '<div style="color:var(--text-muted);font-size:14px;padding:20px 0;">No recent activity found.</div>';
          return;
        }

        feed.innerHTML = events.slice(0, 6).map(ev => {
          const t = typeLabel[ev.type] || typeLabel.default;
          const repo = ev.repo?.name || '';
          const repoName = repo.split('/').pop();
          let detail = '';
          if (ev.type === 'PushEvent') {
            const commits = ev.payload?.commits || [];
            const msg = commits[0]?.message || '';
            detail = `<div style="font-size:12px;color:var(--text-muted);margin-top:4px;font-family:var(--font-mono);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:400px;">${msg}</div>`;
          }
          return `
            <div style="display:flex;align-items:flex-start;gap:14px;padding:14px 16px;background:var(--card);border:1px solid var(--border);border-radius:14px;transition:border-color 0.2s;" onmouseenter="this.style.borderColor='${t.color}'" onmouseleave="this.style.borderColor='var(--border)'">
              <div style="width:36px;height:36px;border-radius:10px;background:${t.color}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <i class="fas ${t.icon}" style="color:${t.color};font-size:16px;"></i>
              </div>
              <div style="flex:1;min-width:0;">
                <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
                  <span style="font-size:13px;font-weight:600;color:var(--text);">${t.label}</span>
                  <a href="https://github.com/${repo}" target="_blank" rel="noopener noreferrer" style="font-size:12px;font-family:var(--font-mono);color:var(--accent);text-decoration:none;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:200px;">${repoName}</a>
                  <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">${timeAgo(ev.created_at)}</span>
                </div>
                ${detail}
              </div>
            </div>`;
        }).join('');
      } catch (e) {
        feed.innerHTML = `<div style="padding:20px;background:var(--card);border:1px solid var(--border);border-radius:14px;text-align:center;"><a href="https://github.com/${USER}" target="_blank" rel="noopener noreferrer" style="color:var(--accent);font-weight:600;font-size:14px;"><i class="fab fa-github"></i> View @${USER} on GitHub</a></div>`;
      }
    });