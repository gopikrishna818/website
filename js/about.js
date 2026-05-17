/**
 * Gopikrishna Chegoni - About Page Scripts
 * Separates typewriter effect, interactive Systems CLI, and GSAP page transitions.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── GSAP CINEMATIC STAGGER REVEAL ──
  if (typeof gsap !== 'undefined') {
    // Register scroll trigger
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Set initial states for clean entrance
    gsap.set('.editorial-hero', { opacity: 0, y: 40 });
    gsap.set('.editorial-philosophy', { opacity: 0, y: 30 });
    gsap.set('.scroll-indicator-down', { opacity: 0, y: 15 });
    
    // Set initial state for cards to avoid visual flash, then animate them
    gsap.set('.card', { opacity: 0, y: 30 });

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.editorial-hero', { opacity: 1, y: 0, duration: 0.8, delay: 0.15 })
      .to('.editorial-philosophy', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
      .to('.scroll-indicator-down', { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

    // Reveal cards dynamically on scroll
    gsap.utils.toArray('.card').forEach((card) => {
      gsap.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      });
    });
  } else {
    // Fallback if GSAP is unavailable
    document.querySelectorAll('.card').forEach(card => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    });
  }

  // ── PROFILE BIO TERMINAL TYPEWRITER ──
  const target = document.querySelector('.bio-type-target');
  if (target) {
    const bioText = "name: Gopikrishna Chegoni\\nrole: Production AI Engineer\\nstatus: Building Multi-Agent RAG";
    let idx = 0;
    function typeBio() {
      if (idx < bioText.length) {
        const char = bioText.charAt(idx);
        if (char === '\\' && bioText.charAt(idx + 1) === 'n') {
          target.innerHTML += '<br>&gt; ';
          idx += 2;
        } else {
          target.innerHTML += char;
          idx++;
        }
        setTimeout(typeBio, 45 + Math.random() * 25);
      }
    }
    setTimeout(typeBio, 800);
  }
});

// ── INTERACTIVE SYSTEMS CLI TERMINAL ──
function focusAboutTerminal() {
  const input = document.getElementById('terminalCliInput');
  if (input) input.focus();
}

function handleCliSubmit(e) {
  if (e.key !== 'Enter') return;
  
  const input = document.getElementById('terminalCliInput');
  const logs = document.getElementById('aboutTerminalLogs');
  if (!input || !logs) return;
  
  const cmdRaw = input.value.trim();
  input.value = '';
  
  // Append typed command line to logs
  const promptLine = document.createElement('div');
  promptLine.style.fontFamily = "'JetBrains Mono', monospace";
  promptLine.style.fontSize = "14px";
  promptLine.style.marginBottom = "4px";
  promptLine.innerHTML = `<span style="color: var(--accent); font-weight: 800; margin-right: 8px;">bash$</span> <span>${escapeHtml(cmdRaw)}</span>`;
  logs.appendChild(promptLine);
  
  const cmd = cmdRaw.toLowerCase();
  const outputLine = document.createElement('div');
  outputLine.style.fontFamily = "'JetBrains Mono', monospace";
  outputLine.style.fontSize = "13px";
  outputLine.style.marginBottom = "16px";
  outputLine.style.color = "rgba(255,255,255,0.85)";
  
  if (cmd === 'help') {
    outputLine.innerHTML = `
      <div style="color: rgba(255,255,255,0.4); margin-bottom: 6px;">Available System Actions:</div>
      <div style="margin-left: 12px; margin-bottom: 4px;"><span style="color: #22c55e; font-weight: 800; display: inline-block; width: 120px;">skills</span>- Print core machine learning & engineering capabilities</div>
      <div style="margin-left: 12px; margin-bottom: 4px;"><span style="color: #22c55e; font-weight: 800; display: inline-block; width: 120px;">projects</span>- Print featured production system metrics</div>
      <div style="margin-left: 12px; margin-bottom: 4px;"><span style="color: #22c55e; font-weight: 800; display: inline-block; width: 120px;">contact</span>- Output secure channels & mail addresses</div>
      <div style="margin-left: 12px; margin-bottom: 4px;"><span style="color: #22c55e; font-weight: 800; display: inline-block; width: 120px;">availability</span>- Check hiring timelines & relocation preference</div>
      <div style="margin-left: 12px; margin-bottom: 4px;"><span style="color: #22c55e; font-weight: 800; display: inline-block; width: 120px;">clear</span>- Flush terminal log history</div>
    `;
  } else if (cmd === 'skills') {
    outputLine.innerHTML = `
      <div style="color: #00bcd4; font-weight: 800; margin-bottom: 6px;">↳ Technical Capabilities:</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• <strong style="color: #fff;">AI/ML:</strong> PyTorch, Scikit-learn, CNNs, Transformers, LLM fine-tuning</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• <strong style="color: #fff;">Document AI:</strong> DocTR, PaddleOCR, Layout Analysis, Custom Parser Rules</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• <strong style="color: #fff;">Automation:</strong> n8n orchestration, Supabase CRM integrations, Retell AI voice agents</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• <strong style="color: #fff;">Backend & Tools:</strong> Python, FastAPI, Docker, Nginx, PostgreSQL, Git</div>
    `;
  } else if (cmd === 'projects') {
    outputLine.innerHTML = `
      <div style="color: #00bcd4; font-weight: 800; margin-bottom: 6px;">↳ Active Production Systems:</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">1. <strong style="color: #fff;">SmartDoc Parser OCR:</strong> Replaced manual entry with 98.2% accuracy ensembling. (80% time-saving)</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">2. <strong style="color: #fff;">AI Outreach Engine:</strong> Automated outbound sequences ensembling n8n and Retell AI voice agents. (70% reduction)</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">3. <strong style="color: #fff;">Enterprise Multi-Agent RAG:</strong> Constructed guardrailed agent hierarchies mapping chroma vector stores.</div>
    `;
  } else if (cmd === 'contact') {
    outputLine.innerHTML = `
      <div style="color: #00bcd4; font-weight: 800; margin-bottom: 6px;">↳ Secure Channels:</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• Email:    <a href="mailto:chegoni.gk@gmail.com" style="color: var(--accent); text-decoration: none;">chegoni.gk@gmail.com</a></div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• LinkedIn: <a href="https://www.linkedin.com/in/gopikrishnachegoni/" target="_blank" style="color: var(--accent); text-decoration: none;">linkedin.com/in/gopikrishnachegoni/</a></div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• GitHub:   <a href="https://github.com/gopikrishna818" target="_blank" style="color: var(--accent); text-decoration: none;">github.com/gopikrishna818</a></div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• Tel:      <span style="color: #fff;">+91 81848 35291</span></div>
    `;
  } else if (cmd === 'availability') {
    outputLine.innerHTML = `
      <div style="color: #22c55e; font-weight: 800; margin-bottom: 6px;">↳ Hiring status: Available</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• Notice Period: Immediate / Under 2 weeks</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• Target Roles:  Production AI Engineer, AI/ML Specialist, LLM System Developer</div>
      <div style="margin-left: 12px; margin-bottom: 4px;">• Location:      Hyderabad, India (Open to Remote / Relocation)</div>
    `;
  } else if (cmd === 'clear') {
    logs.innerHTML = '';
    return;
  } else if (cmd === '') {
    return;
  } else {
    outputLine.innerHTML = `<span style="color: #ff5f56;">Command not found: ${escapeHtml(cmdRaw)}</span>. Type <span style="color: var(--accent); font-weight: bold;">help</span> to view active system commands.`;
  }
  
  logs.appendChild(outputLine);
  
  // Auto-scroll terminal body
  const termBody = document.getElementById('aboutTerminalBody');
  if (termBody) {
    termBody.scrollTop = termBody.scrollHeight;
  }
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
