/* ═══════════════════════════════════════════════
   main.js — Synnova TOCLOE
   Navbar · Burger menu · Custom cursor
═══════════════════════════════════════════════ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ─── NAVBAR — scroll behaviour ─── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 60) {
        navbar.classList.add('scrolled', 'bg-dark/90', 'backdrop-blur-xl', 'py-3', 'border-b', 'border-rose/20');
        navbar.classList.remove('py-5');
      } else {
        navbar.classList.remove('scrolled', 'bg-dark/90', 'backdrop-blur-xl', 'py-3', 'border-b', 'border-rose/20');
        navbar.classList.add('py-5');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }


  /* ─── BURGER — mobile menu ─── */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobile-menu');
  const burgerLines = burger ? burger.querySelectorAll('.burger-line') : [];
  let menuOpen = false;
  let lastFocusedElement = null;

  const openMenu = () => {
    menuOpen = true;
    lastFocusedElement = document.activeElement; // Stocker le focus avant menu
    mobileMenu.classList.add('open');
    mobileMenu.classList.remove('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Fermer le menu de navigation');
    document.body.classList.add('overflow-hidden');

    // Animate burger → X
    if (burgerLines.length === 3) {
      burgerLines[0].style.transform = 'translateY(6.5px) rotate(45deg)';
      burgerLines[1].style.opacity = '0';
      burgerLines[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      burgerLines[2].style.width = '24px';
    }

    // ✨ Focus trap — gérer la navigation clavier
    const focusableElements = mobileMenu.querySelectorAll(
      'a, button, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) firstElement.focus();

    // Empêcher Tab de sortir du menu
    const trapFocus = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    mobileMenu.addEventListener('keydown', trapFocus);
    mobileMenu._trapFocusHandler = trapFocus; // Sauvegarder pour cleanup
  };

  const closeMenu = () => {
    menuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu de navigation');
    document.body.classList.remove('overflow-hidden');

    // Reset burger
    if (burgerLines.length === 3) {
      burgerLines[0].style.transform = '';
      burgerLines[1].style.opacity = '1';
      burgerLines[2].style.transform = '';
      burgerLines[2].style.width = '16px';
    }

    // Nettoyer le focus trap
    if (mobileMenu._trapFocusHandler) {
      mobileMenu.removeEventListener('keydown', mobileMenu._trapFocusHandler);
      delete mobileMenu._trapFocusHandler;
    }

    // Restaurer le focus au burger
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  if (burger) {
    burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
  }

  // Fermer sur Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // Fermer en cliquant sur un lien du menu
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }


  /* ─── CUSTOM CURSOR (desktop only) ─── */
  const cursor = document.getElementById('cursor');
  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    // Position initiale centrée avec GSAP pour éviter le décalage
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    // Utilisation de gsap.quickTo pour une performance maximale et une inertie premium
    const xTo = gsap.quickTo(cursor, "x", { duration: 0.22, ease: "power3.out" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.22, ease: "power3.out" });

    document.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });

    // Hover effect sur éléments interactifs
    const interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

  /* ─── MAGNETIC BUTTONS ─── */
  const magneticButtons = document.querySelectorAll('.btn-shimmer, .btn-magnetic');
  if (magneticButtons.length && window.matchMedia('(pointer: fine)').matches) {
    magneticButtons.forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left;
        const y = e.clientY - position.top;

        const centerX = position.width / 2;
        const centerY = position.height / 2;

        const deltaX = x - centerX;
        const deltaY = y - centerY;

        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: deltaX * 0.35,
            y: deltaY * 0.35,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });

      btn.addEventListener('mouseleave', () => {
        if (typeof gsap !== 'undefined') {
          gsap.to(btn, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: 'elastic.out(1, 0.3)'
          });
        }
      });
    });
  }

  /* ─── PAGE TRANSITIONS & PRELOADER ─── */
  const preloader = document.getElementById('preloader');
  const overlay = document.getElementById('page-transition-overlay');

  if (typeof gsap !== 'undefined') {
    // 1. Gestion du Preloader (Première visite sur l'accueil)
    if (preloader) {
      if (!sessionStorage.getItem('synnova-loaded')) {
        const tl = gsap.timeline();
        // L'animation CSS 'bloom' dure 2s, on attend un peu avant le fade-out
        tl.to(preloader, {
          opacity: 0,
          duration: 1.2,
          delay: 2.5,
          ease: 'power2.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            sessionStorage.setItem('synnova-loaded', 'true');
          }
        });
      } else {
        preloader.style.display = 'none';
      }
    }

    // 2. Gestion de l'Overlay de Navigation
    if (overlay) {
      // Fade out à l'arrivée
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.4,
        onComplete: () => { overlay.style.display = 'none'; }
      });

      document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          const href = link.getAttribute('href');
          if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.getAttribute('target') === '_blank') return;

          e.preventDefault();
          overlay.style.display = 'block';
          gsap.fromTo(overlay, { opacity: 0 }, {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.inOut',
            onComplete: () => {
              window.location.href = href;
            }
          });
        });
      });
    }
  }

  /* ═══════════════════════════════════════════════════════
   HERO CAROUSEL — Auto-play crossfade + dots
════════════════════════════════════════════════════════ */

  (function initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const hero = document.getElementById('hero');

    if (!slides.length || !dots.length) return;

    let current = 0;
    let timer = null;
    const INTERVAL = 10000;

    function goTo(idx) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');

      current = (idx + slides.length) % slides.length;

      slides[current].classList.add('active');
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }

    function next() { goTo(current + 1); }

    function start() { timer = setInterval(next, INTERVAL); }
    function stop() { clearInterval(timer); }

    /* Pause au survol */
    if (hero) {
      hero.addEventListener('mouseenter', stop);
      hero.addEventListener('mouseleave', start);
    }

    /* Clic sur les dots */
    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stop();
        goTo(i);
        start();
      });
    });

    /* Swipe tactile (mobile) */
    let touchStartX = 0;
    if (hero) {
      hero.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
      }, { passive: true });

      hero.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 50) {
          stop();
          goTo(dx < 0 ? current + 1 : current - 1);
          start();
        }
      }, { passive: true });
    }

    start();
  })();

  /* ─── FAQ ACCORDION ─── */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');
    
    if (trigger && content) {
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');
        
        // Close other FAQ items
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            const otherIcon = otherItem.querySelector('.faq-icon');
            if (otherContent) otherContent.style.maxHeight = null;
            if (otherIcon) {
              otherIcon.style.transform = 'rotate(0deg)';
              otherIcon.classList.remove('text-rose');
              otherIcon.classList.add('text-snow/40');
            }
            const otherTrigger = otherItem.querySelector('.faq-trigger');
            if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          }
        });
        
        // Toggle current FAQ item
        if (isOpen) {
          item.classList.remove('active');
          content.style.maxHeight = null;
          trigger.setAttribute('aria-expanded', 'false');
          if (icon) {
            icon.style.transform = 'rotate(0deg)';
            icon.classList.remove('text-rose');
            icon.classList.add('text-snow/40');
          }
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
          trigger.setAttribute('aria-expanded', 'true');
          if (icon) {
            icon.style.transform = 'rotate(180deg)';
            icon.classList.remove('text-snow/40');
            icon.classList.add('text-rose');
          }
        }
      });
    }
  });
});
