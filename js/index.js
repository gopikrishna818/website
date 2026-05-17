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

// ── COUNT UP ANIMATION ENGINE ──
const animateCountUp = (counter) => {
  if (counter.classList.contains('counted')) return;
  counter.classList.add('counted');
  const target = parseFloat(counter.dataset.target);
  const decimals = parseInt(counter.dataset.decimals || '0');
  const duration = 2000;
  const startTime = performance.now();
  const update = (now) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
    const current = target * eased;
    counter.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
};

// ── KINETIC WORD SWAP ──
const initWordSwap = () => {
  const words = ["Production AI Engineer", "OCR Specialist", "RAG Architect", "ML System Builder"];
  const container = document.querySelector('.role-swap-container');
  if (!container) return;
  
  container.innerHTML = '';
  words.forEach((word, idx) => {
    const span = document.createElement('span');
    span.className = `role-swap-word ${idx === 0 ? 'active' : ''}`;
    span.textContent = word;
    container.appendChild(span);
  });

  let currentIdx = 0;
  setInterval(() => {
    const currentWord = container.children[currentIdx];
    currentIdx = (currentIdx + 1) % words.length;
    const nextWord = container.children[currentIdx];

    if (currentWord && nextWord) {
      currentWord.classList.remove('active');
      currentWord.classList.add('exit');
      
      nextWord.classList.add('active');
      nextWord.classList.remove('exit');

      setTimeout(() => {
        currentWord.classList.remove('exit');
      }, 500);
    }
  }, 3000);
};

// ── SKILLS RADAR CHART ──
const initRadarChart = () => {
  const ctx = document.getElementById('radarChart');
  if (!ctx || typeof Chart === 'undefined') return;

  const gridColor = 'rgba(255, 255, 255, 0.08)';
  const angleLineColor = 'rgba(255, 255, 255, 0.1)';
  const labelColor = 'rgba(255, 255, 255, 0.7)';

  const data = {
    labels: ['Computer Vision', 'NLP/LLMs', 'MLOps', 'Data Eng', 'API Systems', 'Automation'],
    datasets: [{
      label: 'Capability',
      data: [0, 0, 0, 0, 0, 0], // Start at 0 for visual entry flow
      backgroundColor: 'rgba(0, 68, 238, 0.15)',
      borderColor: 'rgba(0, 68, 238, 1)',
      borderWidth: 2,
      pointBackgroundColor: '#0044ee',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#0044ee',
      pointRadius: 4,
      pointHoverRadius: 6
    }]
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#0a0a0a',
          titleFont: { family: 'DM Sans', size: 12, weight: 'bold' },
          bodyFont: { family: 'DM Sans', size: 12 },
          displayColors: false,
          borderColor: 'rgba(0, 68, 238, 0.3)',
          borderWidth: 1
        }
      },
      scales: {
        r: {
          angleLines: { color: angleLineColor },
          grid: { color: gridColor },
          pointLabels: {
            color: labelColor,
            font: {
              family: 'DM Sans',
              size: 10,
              weight: 'bold'
            }
          },
          ticks: {
            display: false,
            stepSize: 20
          },
          suggestedMin: 0,
          suggestedMax: 100
        }
      }
    }
  };

  const chart = new Chart(ctx, config);

  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.create({
      trigger: ctx,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        chart.data.datasets[0].data = [90, 85, 80, 88, 92, 85];
        chart.update();
      }
    });
  } else {
    chart.data.datasets[0].data = [90, 85, 80, 88, 92, 85];
    chart.update();
  }
};

// ── ALL PAGE ANIMATIONS ──
const initAnimations = () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Initialize word swapper and radar chart
  initWordSwap();
  initRadarChart();

  // ── CINEMATIC ENTRANCE ──
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .from('nav', { y: -40, opacity: 0, duration: 0.4, delay: 0.05 })
    .from('.live-status-widget', { opacity: 0, y: -10, duration: 0.35 }, '-=0.15')
    .from('.hero-role-wrapper', { opacity: 0, y: 12, duration: 0.4 }, '-=0.15')
    .from('.hero-name', { opacity: 0, y: 16, duration: 0.5 }, '-=0.2')
    .from('.hero-desc', { opacity: 0, y: 12, duration: 0.4 }, '-=0.2')
    .from('.hero-btns', { opacity: 0, y: 8, duration: 0.3 }, '-=0.15')
    .from('.photo-card', { opacity: 0, scale: 0.98, duration: 0.5 }, '-=0.4');


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
    // If it is inside moments stack, let stacking timeline trigger it
    if (counter.closest('.moment-section')) return;

    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => animateCountUp(counter)
    });
  });

  // ── STAGGERED REVEALS ──
  const heroSelectors = ['hero-card', 'photo-card'];
  gsap.utils.toArray('.card, .bento-grid section, .section-header').forEach((el) => {
    if (heroSelectors.some(cls => el.classList.contains(cls))) return;
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: "top 92%",
        toggleActions: "play none none none"
      },
      opacity: 0,
      y: 40,
      scale: 0.98,
      duration: 1.0,
      ease: "power3.out",
      clearProps: "all"
    });
  });

  // ── PROCESS CARDS STAGGER ──
  const procesCards = document.querySelectorAll('.card[style*="padding: 32px"]');
  if (procesCards.length > 0) {
    gsap.from(procesCards, {
      scrollTrigger: { trigger: procesCards[0].parentElement, start: 'top 80%' },
      opacity: 0, y: 30, stagger: 0.1, duration: 0.8, ease: 'power2.out',
      clearProps: "all"
    });
  }

  // ── MOMENTS STACKING ENGINE ──
  const moments = gsap.utils.toArray('.moment-section');
  moments.forEach((section, i) => {
    const isLast = i === moments.length - 1;
    const content = section.querySelector('.moment-content');
    const number = section.querySelector('.moment-number');
    const eyebrow = section.querySelector('.moment-eyebrow');
    const narrative = section.querySelector('.moment-narrative');
    const flare = section.querySelector('.moment-flare');

    const mt = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=60%",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onEnter: () => {
          const counter = section.querySelector('.count-up');
          if (counter) animateCountUp(counter);
        }
      }
    });

    mt.to(number, { opacity: 1, scale: 1, y: 0, duration: 0.4 })
      .to(eyebrow, { opacity: 1, y: 0, duration: 0.2 }, "-=0.2")
      .to(narrative, { opacity: 1, y: 0, duration: 0.3 }, "-=0.1")
      .to(flare, { opacity: i % 2 === 0 ? 0.1 : 0.2, scale: 1.1, duration: 0.5 }, 0);

    if (!isLast) {
      mt.to(content, { opacity: 0, y: -20, duration: 0.3 }, "+=0.1");
    }
  });

  // ── PROJECT SCROLLER PAGINATION SYNC ──
  const rail = document.querySelector('.projects-rail');
  const cards = document.querySelectorAll('.scroller-project-card');
  const dots = document.querySelectorAll('.pagination-dot');

  if (rail && cards.length > 0 && dots.length > 0) {
    const observerOptions = {
      root: rail,
      threshold: 0.6
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Array.from(cards).indexOf(entry.target);
          dots.forEach((dot, i) => {
            if (i === index) {
              dot.classList.add('active');
              dot.style.background = 'var(--accent)';
              dot.style.transform = 'scale(1.5)';
            } else {
              dot.classList.remove('active');
              dot.style.background = 'rgba(0,0,0,0.1)';
              dot.style.transform = 'scale(1)';
            }
          });
        }
      });
    }, observerOptions);

    cards.forEach(card => observer.observe(card));
  }

  // ── STICKY SECTION LABELS ──
  const stickyLabel = document.getElementById('sticky-label');
  const sections = [
    { id: '.moments-stack', label: '02 // CREDIBILITY' },
    { id: '#methodology', label: '03 // METHODOLOGY' },
    { id: '#projects', label: '04 // PROJECTS' },
    { id: '#github-activity', label: '05 // LIVE ACTIVITY' },
    { id: '#skills', label: '06 // TECH STACK' },
    { id: '#contact', label: '07 // CONNECT' }
  ];

  sections.forEach(sec => {
    const el = document.querySelector(sec.id);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 40%",
      end: "bottom 40%",
      onEnter: () => updateLabel(sec.label),
      onEnterBack: () => updateLabel(sec.label),
      onLeave: () => hideLabelIfLast(sec.id),
      onLeaveBack: () => hideLabelIfFirst(sec.id)
    });
  });

  function updateLabel(text) {
    if (stickyLabel) {
      stickyLabel.innerText = text;
      stickyLabel.classList.add('active');
    }
  }

  function hideLabelIfLast(id) {
    if (id === '#contact' && stickyLabel) stickyLabel.classList.remove('active');
  }

  function hideLabelIfFirst(id) {
    if (id === '.moments-stack' && stickyLabel) stickyLabel.classList.remove('active');
  }
};

// ── GITHUB DYNAMIC HEATMAP ──
const initGitHubHeatmap = (events) => {
  const container = document.getElementById('github-heatmap');
  if (!container) return;

  const activityMap = {};
  events.forEach(event => {
    if (event.created_at) {
      const dateStr = event.created_at.split('T')[0];
      activityMap[dateStr] = (activityMap[dateStr] || 0) + 1;
    }
  });

  container.innerHTML = '';
  const now = new Date();
  const startDate = new Date();
  startDate.setDate(now.getDate() - 83); // 12 weeks = 84 days

  for (let w = 0; w < 12; w++) {
    const col = document.createElement('div');
    col.style.display = 'flex';
    col.style.flexDirection = 'column';
    col.style.gap = '3px';

    for (let d = 0; d < 7; d++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + (w * 7) + d);
      const dateStr = currentDate.toISOString().split('T')[0];
      const count = activityMap[dateStr] || 0;

      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      cell.style.width = '10px';
      cell.style.height = '10px';
      cell.style.borderRadius = '2px';
      cell.style.cursor = 'pointer';
      cell.title = `${dateStr}: ${count} activity point${count !== 1 ? 's' : ''}`;
      
      let bgColor = 'var(--heatmap-bg-empty, #e5e5e7)';
      if (count > 0) {
        if (count === 1) bgColor = 'rgba(0, 68, 238, 0.25)';
        else if (count <= 3) bgColor = 'rgba(0, 68, 238, 0.5)';
        else if (count <= 6) bgColor = 'rgba(0, 68, 238, 0.75)';
        else bgColor = 'rgba(0, 68, 238, 1.0)';
      }
      cell.style.background = bgColor;
      col.appendChild(cell);
    }
    container.appendChild(col);
  }
};

// ── GITHUB LIVE ACTIVITY FEED ──
const initGitHubFeed = async () => {
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
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  try {
    const res = await fetch(`https://api.github.com/users/${USER}/events/public?per_page=30`);
    if (!res.ok) throw new Error('API error');
    const events = await res.json();

    if (!events.length) {
      feed.innerHTML = '<div style="color:var(--text-muted);font-size:14px;padding:20px 0;">No recent activity found.</div>';
      return;
    }

    // Render Heatmap Grid
    initGitHubHeatmap(events);

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
};

// ── TERMINAL TYPING ANIMATION ──
const initTerminal = () => {
  const termCmd = document.getElementById('termCmd');
  const termOutput = document.getElementById('termOutput');
  if (!termCmd || !termOutput) return;

  const command = "analyzing_problem --type=invoice-extraction";
  const outputs = [
    "> 3 OCR engines benchmarked: Tesseract, PaddleOCR, DocTR",
    "> PaddleOCR wins on handwriting. DocTR wins on structured docs.",
    "> Ensemble approach: 98% accuracy achieved.",
    "> Manual review time: \u2193 80%",
    "bash$ reasoning_complete --status=success"
  ];

  let charIdx = 0;
  let outputIdx = 0;

  const typeCommand = () => {
    if (charIdx < command.length) {
      termCmd.textContent += command.charAt(charIdx);
      charIdx++;
      setTimeout(typeCommand, 50 + Math.random() * 50);
    } else {
      setTimeout(showOutputs, 600);
    }
  };

  const showOutputs = () => {
    if (outputIdx < outputs.length) {
      const line = document.createElement('div');
      line.className = 'terminal-line terminal-output';
      line.textContent = outputs[outputIdx];
      termOutput.appendChild(line);
      outputIdx++;
      setTimeout(showOutputs, 800 + Math.random() * 400);
    }
  };


  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typeCommand();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const terminal = document.querySelector('.terminal-window');
  if (terminal) observer.observe(terminal);
};

// ── MASTER INITIALIZATION ──
const init = () => {
  initAnimations();
  initGitHubFeed();
  initTerminal();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
