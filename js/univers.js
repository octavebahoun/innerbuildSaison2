'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Accessibilité : désactiver les transitions de couleurs si prefers-reduced-motion est activé
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const sections = document.querySelectorAll('section[id]');
  const body = document.body;
  body.classList.add('univers-page');

  // Configuration des couleurs par section
  const colors = {
    'hero-univers': { bg: '#0A0A0A', accent: '#C2185B' },
    'animation': { bg: '#120207', accent: '#C2185B' },    // Rose profond
    'communication': { bg: '#0F0901', accent: '#F9A825' }, // Or profond
    'cinema': { bg: '#020314', accent: '#3F51B5' },       // Indigo profond
    'entrepreneuriat': { bg: '#010D02', accent: '#2E7D32' } // Vert profond
  };

  // Bullet navigation interactive
  const bullets = document.querySelectorAll('.univers-bullet');
  bullets.forEach(bullet => {
    bullet.addEventListener('click', () => {
      const targetId = bullet.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        // 💡 Astuce UX premium : Désactiver temporairement le snap-scroll natif pour éviter
        // que le navigateur n'annule ou n'interrompe l'animation de défilement vers la cible.
        document.documentElement.classList.remove('snap-y');

        targetSection.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });

        // Réactiver le snap-scroll une fois la transition douce terminée
        setTimeout(() => {
          document.documentElement.classList.add('snap-y');
        }, 850);
      }
    });
  });

  function updateActiveBullet(activeId) {
    bullets.forEach(bullet => {
      if (bullet.getAttribute('data-target') === activeId) {
        bullet.classList.add('active');
      } else {
        bullet.classList.remove('active');
      }
    });
  }

  function updateColors(config) {
    if (prefersReducedMotion) {
      document.documentElement.style.setProperty('--page-bg', config.bg);
      document.documentElement.style.setProperty('--page-accent', config.accent);
    } else {
      gsap.to(':root', {
        '--page-bg': config.bg,
        '--page-accent': config.accent,
        duration: 0.8,
        ease: 'power2.out'
      });
    }
  }

  // 🎯 IntersectionObserver (100% fiable avec le Snap Scroll et le tactile)
  // Décide quel point est actif et met à jour la couleur d'accentuation en temps réel.
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -30% 0px', // Analyse la partie centrale (30% du haut et du bas ignorés)
    threshold: 0.2 // Déclenche dès que 20% d'une section est dans cette zone centrale
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        const config = colors[id];
        if (config) {
          updateColors(config);
          updateActiveBullet(id);
        }
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  // Animations du contenu et du glow au scroll (existantes)
  sections.forEach((section) => {
    const id = section.id;

    const content = section.querySelector('.max-w-6xl, .max-w-3xl');
    if (content) {
      if (prefersReducedMotion) {
        gsap.set(content, { opacity: 1, y: 0, scale: 1 });
      } else {
        gsap.fromTo(content,
          { opacity: 0, y: 60, scale: 0.98 },
          {
            opacity: 1, y: 0, scale: 1, duration: 1.4, ease: 'power4.out',
            scrollTrigger: {
              trigger: section,
              start: id === 'hero-univers' ? 'top 100%' : 'top 60%',
              toggleActions: 'play none none none'
            }
          }
        );
      }
    }

    const glow = section.querySelector('.absolute.blur-[150px], .absolute.blur-[120px]');
    if (glow) {
      if (prefersReducedMotion) {
        gsap.set(glow, { opacity: 1, scale: 1 });
      } else {
        gsap.fromTo(glow,
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1, scale: 1, duration: 2, ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 50%',
              toggleActions: 'play reverse play reverse'
            }
          }
        );
      }
    }

  });
});
