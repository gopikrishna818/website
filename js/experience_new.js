/**
 * Gopikrishna Chegoni - Experience Page Scripts
 * Configures the academic radar chart and manages GSAP scroll reveal timelines.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. ACADEMIC STRENGTHS RADAR CHART REMOVED ──

  // ── 2. GSAP INTERACTIVE SCROLL TIMELINES (Upgrades 2, 3) ──
  if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
    }
    
    // Sequence Map connector lines & nodes in Project Impact Map on scroll
    gsap.set('.map-node', { opacity: 0, scale: 0.95 });
    gsap.set('.map-connector', { opacity: 0, scaleX: 0, transformOrigin: 'left center' });

    const mapTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '.impact-map-section',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });

    mapTimeline
      .to('.map-node:nth-child(1)', { opacity: 1, scale: 1, duration: 0.4 })
      .to('.map-connector:nth-child(2)', { opacity: 1, scaleX: 1, duration: 0.3 })
      .to('.map-node:nth-child(3)', { opacity: 1, scale: 1, duration: 0.4 })
      .to('.map-connector:nth-child(4)', { opacity: 1, scaleX: 1, duration: 0.3 })
      .to('.map-node.node-success', { opacity: 1, scale: 1, duration: 0.5 });

    // Stagger progress timeline nodes in trajectory
    gsap.set('.timeline-node', { opacity: 0, y: 20 });
    gsap.to('.timeline-node', {
      opacity: 1,
      y: 0,
      stagger: 0.15,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.skills-acquired-timeline',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
});
