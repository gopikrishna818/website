/**
 * shared.js — Portfolio Global Scripts
 * Gopikrishna Chegoni · 2026
 *
 * Handles: theme, cursor, smart navbar, scroll progress,
 *          command palette, page transitions, magnetic CTA, back-to-top
 */

(function () {
  'use strict';

  // ── 1. THEME (respects prefers-color-scheme & localStorage) ──
  const applyTheme = () => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'dark' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    _syncThemeIcon();
  };

  const _syncThemeIcon = () => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const icon = btn.querySelector('i');
    if (!icon) return;
    const isDark = document.documentElement.classList.contains('dark-mode');
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  };

  // Apply theme immediately (prevents flash)
  applyTheme();

  document.addEventListener('DOMContentLoaded', () => {

    // Re-apply (in case DOMContentLoaded fires before inline script)
    applyTheme();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        _syncThemeIcon();
      });
    }



    // ── 2. CUSTOM CURSOR ──
    const cursor = document.querySelector('.custom-cursor');
    if (cursor && window.matchMedia('(pointer: fine)').matches) {
      document.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate(${e.clientX - 6}px, ${e.clientY - 6}px)`;
      }, { passive: true });

      document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
      });

      document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));
      document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
    }

    // ── 3. MESH GRADIENT REACTIVE ──
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });

    // ── 4. SMART NAVBAR (hide on scroll-down, show on scroll-up) ──
    const navbar = document.querySelector('nav');
    let lastScroll = window.pageYOffset;

    const handleNavbarScroll = () => {
      const current = window.pageYOffset;
      if (!navbar) return;
      if (current <= 80) {
        navbar.classList.remove('nav-hidden');
      } else if (current > lastScroll) {
        navbar.classList.add('nav-hidden');
      } else {
        navbar.classList.remove('nav-hidden');
      }
      lastScroll = current;
    };

    window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    handleNavbarScroll();

    // ── 5. SCROLL PROGRESS BAR ──
    const progress = document.getElementById('scrollProgress');
    if (progress) {
      window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (h > 0) {
          progress.style.transform = `scaleX(${window.pageYOffset / h})`;
        }
      }, { passive: true });
    }

    // ── 6. ACTIVE NAV LINK ──
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
      if (link.getAttribute('href') === currentPage) link.classList.add('active');
    });

    // ── 7. COMMAND PALETTE ──
    const cmdBtn = document.getElementById('navCommand');
    const cmdPalette = document.getElementById('cmdPalette');
    const cmdSearch = document.getElementById('cmdSearch');

    const openPalette = () => {
      if (!cmdPalette) return;
      cmdPalette.classList.add('active');
      setTimeout(() => cmdSearch && cmdSearch.focus(), 80);
    };
    const closePalette = () => cmdPalette && cmdPalette.classList.remove('active');

    if (cmdBtn) cmdBtn.addEventListener('click', openPalette);
    if (cmdPalette) {
      cmdPalette.addEventListener('click', (e) => {
        if (e.target === cmdPalette) closePalette();
      });
    }

    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        cmdPalette && cmdPalette.classList.contains('active') ? closePalette() : openPalette();
      }
      if (e.key === 'Escape') closePalette();
    });

    // Keyboard navigation inside palette
    if (cmdSearch) {
      let activeIdx = -1;
      const getCmdItems = () => [...document.querySelectorAll('.cmd-item')]
        .filter(i => i.style.display !== 'none');

      cmdSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.cmd-item').forEach(item => {
          item.style.display = item.textContent.toLowerCase().includes(term) ? 'flex' : 'none';
        });
        activeIdx = -1;
        getCmdItems().forEach(i => i.classList.remove('focused'));
      });

      cmdSearch.addEventListener('keydown', (e) => {
        const items = getCmdItems();
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          activeIdx = Math.min(activeIdx + 1, items.length - 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          activeIdx = Math.max(activeIdx - 1, 0);
        } else if (e.key === 'Enter' && activeIdx >= 0) {
          items[activeIdx].click();
          closePalette();
          return;
        } else { return; }
        items.forEach((item, i) => item.classList.toggle('focused', i === activeIdx));
        if (items[activeIdx]) items[activeIdx].scrollIntoView({ block: 'nearest' });
      });
    }

    // ── 8. PAGE TRANSITIONS (Fast Smooth Fade) ──
    const overlay = document.getElementById('pageTransition');
    if (overlay) {
      // Fade out on load
      requestAnimationFrame(() => {
        overlay.style.opacity = '0';
      });

      document.querySelectorAll('a').forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.endsWith('.html') && !href.startsWith('http') && !link.target && !href.startsWith('#')) {
          link.addEventListener('click', (e) => {
            if (e.metaKey || e.ctrlKey) return;
            e.preventDefault();
            overlay.style.opacity = '1';
            setTimeout(() => { window.location.href = href; }, 250);
          });
        }
      });
    }

    // ── 9. MAGNETIC CTA — "Hire Me" button only ──
    const hireMeBtn = document.querySelector('.nav-cta');
    if (hireMeBtn && typeof gsap !== 'undefined') {
      hireMeBtn.addEventListener('mousemove', (e) => {
        const rect = hireMeBtn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(hireMeBtn, { x: x * 0.35, y: y * 0.35, duration: 0.4, ease: 'power2.out' });
      });
      hireMeBtn.addEventListener('mouseleave', () => {
        gsap.to(hireMeBtn, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      });
    }

    // ── 10. BACK TO TOP ──
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
      window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
      }, { passive: true });
      backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }

    // ── 11. SCROLL-TRIGGERED CARD ANIMATIONS ──
    let animObserver;
    if ('IntersectionObserver' in window) {
      animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');

            // Special handling for count-up elements
            if (entry.target.classList.contains('count-up') && !entry.target.dataset.counted) {
              _animateCounter(entry.target);
            }

            animObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.05, rootMargin: '0px 0px -40px 0px' });

      document.querySelectorAll('.card, .anim-item, .exp-block, .edu-tile, .skills-strip, .ach-card, .count-up, .project-item-row').forEach((el, i) => {
        if (el.classList.contains('hero-card') || el.classList.contains('photo-card')) return;
        el.style.transitionDelay = `${(i % 5) * 0.05}s`;
        animObserver.observe(el);
      });
    }

    function _animateCounter(el) {
      el.dataset.counted = '1';
      const target = parseFloat(el.dataset.target || el.textContent);
      const decimals = parseInt(el.dataset.decimals || (target % 1 !== 0 ? 1 : 0));
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;
        el.textContent = (decimals > 0 ? current.toFixed(decimals) : Math.floor(current)) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      };
      requestAnimationFrame(update);
    }

    // ── 12. FOOTER YEAR ──
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // ── 13. CHATBOT STATE RESET (Safety) ──
    const chatbot = document.getElementById('chatbotContainer');
    if (chatbot) chatbot.classList.remove('active');

    // ── 14. PROJECT MODAL & FILTER LOGIC ──
    // Shared projects data for detail modal
    window.portfolioProjects = [
      {
        id: 1, title: "AI Lead-Gen & Outreach Production Engine", impact: "70% Manual Reduction",
        image: "images/lead_gen_rel.png",
        brief: "An automated growth engine that moves beyond 'working code' to a production system that manages LinkedIn scraping and AI voice calls at scale.",
        category: "Automation",
        beforeAfter: {
          before: "Sales team spent 8+ hours/day manually finding leads and making follow-up calls.",
          after: "Autonomous pipeline handles prospecting and voice calls, freeing the team for high-value closing.",
          stat: "70% Reduction",
          statLabel: "in manual outreach work"
        },
        caseStudy: { 
          problem: "Business growth stalled by manual lead-gen bottlenecks.", 
          approach: "Translated n8n, Retell AI, and Gemini research into a production-grade automation engine.", 
          results: "Reclaimed 5+ hours daily for the sales team while maintaining 95% lead quality.", 
          learnings: "Production reliability > Model accuracy." 
        },
        year: "2025", techStack: ["n8n", "Retell AI", "Gemini"], buttons: [{ label: "GitHub", url: "https://github.com/gopikrishna818/AI-Lead-Gen-Outreach-Automation-Engine", icon: "fab fa-github" }],
        diagram: [
          { name: "LinkedIn Agent", x: 50, y: 40, tooltip: "Automated agent that extracts target profiles based on ICP." },
          { name: "Gemini Brain", x: 200, y: 40, tooltip: "LMM analyzing profiles to generate hyper-personalized scripts." },
          { name: "Retell AI Voice", x: 350, y: 40, tooltip: "Production voice interface for outbound lead qualification." },
          { name: "Supabase CRM", x: 500, y: 40, tooltip: "Centralized database for lead status and call transcripts." },
          { name: "n8n Orchestrator", x: 200, y: 100, tooltip: "The production brain managing retries and business logic." }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }, { from: 1, to: 4 }
        ]
      },
      {
        id: 2, title: "SmartDoc Parser (Production OCR)", impact: "80% Efficiency Gain",
        image: "images/smartdoc_rel.png",
        brief: "A production-grade OCR pipeline that takes paper research (DocTR/Paddle) and transforms it into a system that replaces manual data entry.",
        category: "AI/ML",
        beforeAfter: {
          before: "Manual entry from invoices took 6hrs/day with a 12% error rate.",
          after: "SmartDoc extracts financial data in 45s with 98.2% reliability in production.",
          stat: "80% Efficiency",
          statLabel: "gain across document workflows"
        },
        caseStudy: { 
          problem: "Financial data entry is an expensive, error-prone human bottleneck.", 
          approach: "Ensembled DocTR and PaddleOCR for production reliability over benchmark scores.", 
          results: "Reduced manual data entry time by 80% while increasing accuracy by 10%.", 
          learnings: "Edge cases in production define true system performance." 
        },
        year: "2024", techStack: ["Python", "DocTR", "PaddleOCR"], buttons: [{ label: "GitHub", url: "https://github.com/gopikrishna818/SmartDoc-Parser-Invoice-Bank-Statement-Extraction", icon: "fab fa-github" }],
        diagram: [
          { name: "Doc Ingestion", x: 50, y: 60, tooltip: "Production-ready S3 bucket ingestion with validation." },
          { name: "OCR Ensemble", x: 220, y: 60, tooltip: "Ensembled PaddleOCR/DocTR for 98.2% production reliability." },
          { name: "Data Extraction", x: 390, y: 60, tooltip: "Regex and LLM-based verification for structural integrity." },
          { name: "ERP Export", x: 560, y: 60, tooltip: "Structured API output for business system integration." }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 }
        ]
      },
      {
        id: 3, title: "AI Content Strategy Production Engine", impact: "10x Delivery ROI",
        image: "images/content_strategy_rel.png",
        brief: "Accelerated business content delivery by 10x, reducing research and planning from days to minutes.",
        category: "AI/ML",
        beforeAfter: {
          before: "Marketing team needed 3 days to research and plan a content strategy.",
          after: "Full production-ready strategy generated in 18 minutes, including topic clusters and copy.",
          stat: "10x ROI",
          statLabel: "on content planning delivery speed"
        },
        caseStudy: { 
          problem: "High-quality content planning is a slow research-intensive manual process.", 
          approach: "FastAPI-based production architecture for scalable LLM orchestration.", 
          results: "Strategic planning time cut by 90%, enabling faster campaign cycles.", 
          learnings: "Architecting for scale is as critical as the AI itself." 
        },
        year: "2025", techStack: ["FastAPI", "Nginx", "Docker"], buttons: [{ label: "GitHub", url: "#", icon: "fab fa-github" }],
        diagram: [
          { name: "SERP Research", x: 60, y: 60, tooltip: "Real-time analysis for business intent mapping." },
          { name: "LLM Chain", x: 250, y: 60, tooltip: "Multi-prompt chain generating content pillars and briefs." },
          { name: "Prod Dashboard", x: 440, y: 60, tooltip: "Interface for final review and production scheduling." }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }
        ]
      },
      {
        id: 4, title: "Enterprise Multi-Agent RAG", impact: "95% Self-Service",
        image: "images/rag_agents_rel.png",
        brief: "A complex agentic architecture designed for production environments, reducing support overhead by resolving 95% of queries.",
        category: "AI/ML",
        beforeAfter: {
          before: "Support team overwhelmed by repetitive queries; existing bots hallucinated on 30% of cases.",
          after: "Grounded RAG agents provide verifiably accurate answers with citations for 95% of queries.",
          stat: "95% ROI",
          statLabel: "increase in automated support resolution"
        },
        caseStudy: { 
          problem: "Production support bots erode trust when they hallucinate on complex data.", 
          approach: "Built a multi-agent critique layer to ensure business-grounded responses.", 
          results: "Reduced support overhead while maintaining 98%+ groundedness scores.", 
          learnings: "Agentic guardrails are the key to production RAG trust." 
        },
        year: "2026", techStack: ["Python", "Groq", "ChromaDB"], buttons: [{ label: "GitHub", url: "https://github.com/gopikrishna818/enterprise-multi-agent-rag.git", icon: "fab fa-github" }],
        diagram: [
          { name: "User Intent", x: 50, y: 60, tooltip: "Complex query ingestion from production frontend." },
          { name: "Router Agent", x: 200, y: 60, tooltip: "Analyzes intent and routes to specialized domain agents." },
          { name: "Knowledge Base", x: 350, y: 30, tooltip: "Production vector store holding business knowledge." },
          { name: "Critic Agent", x: 350, y: 90, tooltip: "Guardrail agent verifying groundedness of responses." },
          { name: "Production API", x: 500, y: 60, tooltip: "Hallucination-free response delivered with citations." }
        ],
        connections: [
          { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 4 }
        ]
      }
    ];

    window.openProjectModal = (idx) => {
      const p = window.portfolioProjects[idx];
      const m = document.getElementById('projectModal');
      if (!m || !p) return;

      const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
      setEl('modalImpact', p.impact);
      setEl('modalTitle', p.title);
      setEl('modalProblem', p.caseStudy.problem);
      setEl('modalApproach', p.caseStudy.approach);
      setEl('modalResults', p.caseStudy.results);
      setEl('modalLearnings', p.caseStudy.learnings);
      setEl('modalYear', p.year);
      setEl('modalCategory', p.category);

      const ts = document.getElementById('modalTechStack');
      if (ts) ts.innerHTML = p.techStack.map(t => `<span class="cs-tech-item">${t}</span>`).join('');

      const ma = document.getElementById('modalActions');
      if (ma) ma.innerHTML = p.buttons.map(b => `<a href="${b.url}" target="_blank" rel="noopener noreferrer" class="modal-btn"><i class="${b.icon}"></i> ${b.label}</a>`).join('');

      m.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    window.closeProjectModal = () => {
      const m = document.getElementById('projectModal');
      if (m) m.classList.remove('active');
      document.body.style.overflow = 'auto';
    };

    // Global modal close listeners
    const modal = document.getElementById('projectModal');
    if (modal) {
      modal.addEventListener('click', (e) => { if (e.target === modal) window.closeProjectModal(); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') window.closeProjectModal(); });
    }

    // ── 15. PROJECT FILTERING LOGIC (For projects.html) ──
    const filterTabs = document.querySelectorAll('.filter-tab');
    if (filterTabs.length > 0) {
      const grid = document.getElementById('projectsGrid');
      const indicator = document.querySelector('.filter-indicator');

      const updateIndicator = (tab) => {
        if (!indicator || !tab) return;
        indicator.style.width = `${tab.offsetWidth}px`;
        indicator.style.left = `${tab.offsetLeft}px`;
      };

      const renderList = (filter = 'all') => {
        if (!grid) return;
        const filtered = filter === 'all' ? window.portfolioProjects : window.portfolioProjects.filter(p => p.category.toLowerCase() === filter.toLowerCase());

        const resetBtn = document.getElementById('resetFilters');
        if (resetBtn) resetBtn.style.display = filter === 'all' ? 'none' : 'block';
        grid.innerHTML = filtered.map((p, i) => `
          <div class="project-item-row anim-item ${i === 0 ? 'lead-project' : ''}" onclick="window.openProjectModal(${window.portfolioProjects.indexOf(p)})">
            <div class="project-content-left">
              <h3 class="project-title-new">${p.title}</h3>
              <p class="project-desc-new">${p.brief}</p>
              
              <!-- INTERACTIVE ARCHITECTURE DIAGRAM -->
              <div class="arch-diagram-wrap" onclick="event.stopPropagation()">
                <div class="arch-label">↳ System Flow</div>
                <svg viewBox="0 0 600 160" class="arch-svg">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0,0,0,0.2)" />
                    </marker>
                  </defs>
                  <!-- Connections -->
                  ${p.connections.map(c => {
          const from = p.diagram[c.from];
          const to = p.diagram[c.to];
          return `<line x1="${from.x + 50}" y1="${from.y + 15}" x2="${to.x - 10}" y2="${to.y + 15}" class="arch-line" marker-end="url(#arrowhead)" />`;
        }).join('')}
                  <!-- Nodes -->
                  ${p.diagram.map(n => `
                    <g class="arch-node-group">
                      <rect x="${n.x}" y="${n.y}" width="110" height="30" rx="8" class="arch-node" />
                      <text x="${n.x + 55}" y="${n.y + 19}" class="arch-node-text">${n.name}</text>
                      <foreignObject x="${n.x - 45}" y="${n.y - 70}" width="200" height="70" class="arch-tooltip-wrap">
                        <div class="arch-tooltip">${n.tooltip}</div>
                      </foreignObject>
                    </g>
                  `).join('')}
                </svg>
              </div>

              <div class="project-pills">
                ${p.techStack.map(t => `<span class="project-pill">${t}</span>`).join('')}
              </div>
              <button class="project-cta-new" onclick="event.stopPropagation(); window.openProjectModal(${window.portfolioProjects.indexOf(p)})">
                View Case Study →
              </button>
            </div>
            <div class="flip-card" title="Hover to see business impact">
              <div class="flip-card-inner">
                <div class="flip-card-front">
                  <img src="${p.image}" alt="${p.title}" loading="lazy">
                  <div class="flip-card-badge">${p.impact}</div>
                  <div class="flip-card-hint">Hover to see impact →</div>
                </div>
                <div class="flip-card-back">
                  <div class="flip-back-label">REAL IMPACT</div>
                  <div class="flip-section">
                    <div class="flip-tag before-tag">BEFORE</div>
                    <p>${p.beforeAfter.before}</p>
                  </div>
                  <div class="flip-divider"></div>
                  <div class="flip-section">
                    <div class="flip-tag after-tag">AFTER</div>
                    <p>${p.beforeAfter.after}</p>
                  </div>
                  <div class="flip-stat">
                    <span class="flip-stat-num">${p.beforeAfter.stat}</span>
                    <span class="flip-stat-label">${p.beforeAfter.statLabel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('');

        // Re-observe new items
        if (animObserver) {
          grid.querySelectorAll('.anim-item').forEach(el => animObserver.observe(el));
        } else {
          // Fallback if IO not supported
          grid.querySelectorAll('.anim-item').forEach(el => el.classList.add('is-visible'));
        }
      };

      filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
          filterTabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          updateIndicator(tab);
          renderList(tab.dataset.filter);
        });
      });

      // Initial render if on projects page
      if (grid) {
        renderList();
        setTimeout(() => updateIndicator(document.querySelector('.filter-tab.active')), 100);
      }
    }

    // ── 13. TECH STACK EASTER EGG (THE FLEX) ──
    const initStackFlex = () => {
      const overlayHTML = `
        <div class="stack-overlay" id="stackOverlay">
          <div class="stack-content">
            <div class="stack-flex-title">Architecture: Zero Bloat</div>
            <p class="stack-flex-text">This site was built with <strong>Vanilla HTML, CSS, and JS</strong>. Powered by GSAP for motion. Zero frameworks. Zero build tools. 100% hand-crafted engineering.</p>
            <div class="stack-badge-row">
              <span class="stack-badge">Vanilla JS</span>
              <span class="stack-badge">CSS Grid</span>
              <span class="stack-badge">GSAP ScrollTrigger</span>
              <span class="stack-badge">Zero Frameworks</span>
              <span class="stack-badge">Zero Dependencies</span>
            </div>
            <button style="margin-top:40px; background:transparent; border:1px solid rgba(255,255,255,0.2); color:#fff; padding:12px 24px; border-radius:100px; cursor:pointer; font-size:12px; font-weight:800;" onclick="document.getElementById('stackOverlay').classList.remove('active')">CLOSE ESC</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', overlayHTML);

      const overlay = document.getElementById('stackOverlay');
      
      // Keyboard Shortcut: Cmd/Ctrl + /
      window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === '/') {
          e.preventDefault();
          overlay.classList.toggle('active');
          if (overlay.classList.contains('active')) {
            gsap.from('.stack-content > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" });
          }
        }
        if (e.key === 'Escape') overlay.classList.remove('active');
      });

      // Hidden Footer Trigger
      const footers = document.querySelectorAll('footer .footer-bottom');
      footers.forEach(f => {
        const trigger = document.createElement('div');
        trigger.className = 'hidden-stack-trigger';
        trigger.textContent = 'Inspect System Architecture';
        trigger.onclick = () => {
          overlay.classList.add('active');
          gsap.from('.stack-content > *', { y: 20, opacity: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" });
        };
        f.appendChild(trigger);
      });
    };

    initStackFlex();

    // ── 14. CHALLENGE ME HANDLER ──
    window.handleChallenge = () => {
      const text = document.getElementById('challengeText').value;
      if (!text) {
        alert('Please describe your problem first.');
        return;
      }
      const subject = encodeURIComponent("Challenge from [Company] for Gopikrishna");
      const body = encodeURIComponent(text);
      window.location.href = `mailto:chegoni.gk@gmail.com?subject=${subject}&body=${body}`;
    };


    // ── 16. PAGE TRANSITION WIPE ──
    const initPageTransitions = () => {
      const wipe = document.createElement('div');
      wipe.className = 'page-wipe';
      document.body.appendChild(wipe);

      // Inbound reveal: Slide the wipe out to the right
      gsap.set(wipe, { x: '0%' });
      gsap.to(wipe, {
        x: '100%',
        duration: 0.4,
        ease: "expo.inOut",
        onComplete: () => {
          gsap.set(wipe, { x: '-100%' }); // Reset for outbound
        }
      });

      // Outbound transition: Intercept internal link clicks
      document.body.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Only trigger for internal .html pages
        if (href && href.includes('.html') && !href.startsWith('http') && target !== '_blank') {
          e.preventDefault();
          gsap.to(wipe, {
            x: '0%',
            duration: 0.3,
            ease: "expo.inOut",
            onComplete: () => {
              window.location.href = href;
            }
          });
        }
      });
    };

    initPageTransitions();

  }); // end DOMContentLoaded

})();
