/* ═══════════════════════════════════════════════
   main.js — Synnova Tocloe
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
  const burger      = document.getElementById('burger');
  const mobileMenu  = document.getElementById('mobile-menu');
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
      burgerLines[1].style.opacity   = '0';
      burgerLines[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      burgerLines[2].style.width     = '24px';
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
      burgerLines[1].style.opacity   = '1';
      burgerLines[2].style.transform = '';
      burgerLines[2].style.width     = '16px';
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
    document.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    }, { passive: true });

    // Hover effect sur éléments interactifs
    const interactives = document.querySelectorAll('a, button, [role="button"]');
    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });
  }

});
