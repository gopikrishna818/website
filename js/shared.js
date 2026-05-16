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
      { id: 1, title: "AI Lead-Gen & Outreach Automation Engine", impact: "95% Automation", image: "images/lead_gen_rel.png", brief: "End-to-end lead generation pipeline with AI voice calls and automated follow-ups.", category: "Automation", caseStudy: { problem: "Manual lead outreach is slow and expensive.", approach: "Built n8n pipeline with Retell AI and Gemini.", results: "Reduced outreach time by 95%.", learnings: "Mastered workflow orchestration." }, year: "2025", techStack: ["n8n", "Retell AI", "Gemini"], buttons: [{ label: "GitHub", url: "#", icon: "fab fa-github" }] },
      { id: 2, title: "SmartDoc Parser", impact: "98% OCR Accuracy", image: "images/smartdoc_rel.png", brief: "Production-grade OCR pipeline for financial documents.", category: "AI/ML", caseStudy: { problem: "Financial data entry is error-prone.", approach: "DocTR and PaddleOCR hybrid strategy.", results: "98% extraction accuracy.", learnings: "Deep CV expertise." }, year: "2024", techStack: ["Python", "DocTR", "PaddleOCR"], buttons: [{ label: "GitHub", url: "#", icon: "fab fa-github" }] },
      { id: 3, title: "AI Content Strategy Engine", impact: "10x Faster", image: "images/content_strategy_rel.png", brief: "AI application automating digital marketing strategy.", category: "AI/ML", caseStudy: { problem: "Content planning is research-intensive.", approach: "FastAPI architecture with LLM integration.", results: "Planning time cut by 90%.", learnings: "System architecture focus." }, year: "2025", techStack: ["FastAPI", "Nginx", "Docker"], buttons: [{ label: "GitHub", url: "#", icon: "fab fa-github" }] },
      { id: 4, title: "Enterprise Multi-Agent RAG", impact: "98% Accuracy", image: "images/rag_agents_rel.png", brief: "Multi-agent system for support with strict guardrails.", category: "AI/ML", caseStudy: { problem: "Chatbots hallucinate on complex support queries.", approach: "Hybrid vector search with multi-agent orchestration.", results: "98% hallucination-free groundedness.", learnings: "Agentic design patterns." }, year: "2026", techStack: ["Python", "Groq", "ChromaDB"], buttons: [{ label: "Live Demo", url: "#", icon: "fas fa-external-link-alt" }] }
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
        
        grid.innerHTML = filtered.map(p => `
          <div class="project-item-row anim-item" onclick="window.openProjectModal(${window.portfolioProjects.indexOf(p)})">
            <div class="project-content-left">
              <h3 class="project-title-new">${p.title}</h3>
              <p class="project-desc-new">${p.brief}</p>
              <div class="project-pills">
                ${p.techStack.map(t => `<span class="project-pill">${t}</span>`).join('')}
              </div>
            </div>
            <div class="project-image-right">
              <img src="${p.image}" alt="${p.title}" loading="lazy">
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

  }); // end DOMContentLoaded

})();
