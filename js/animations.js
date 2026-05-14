/* ═══════════════════════════════════════════════
   animations.js — Synnova Tocloe
   GSAP hero · ScrollTrigger reveals · Anime.js counters
═══════════════════════════════════════════════ */

'use strict';

window.addEventListener('load', () => {

  /* Sécurité : vérifier que GSAP est chargé */
  if (typeof gsap === 'undefined') return;

  /* ─── Enregistrement plugin ─── */
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }


  /* ════════════════════════════════════
     HERO — Animation d'entrée (GSAP)
  ════════════════════════════════════ */

  // Parallax léger sur l'image hero
  const heroImg = document.getElementById('hero-img');
  if (heroImg) {
    gsap.to(heroImg, {
      yPercent: 18,
      ease: 'none',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Séquence d'entrée — éléments du hero
  const heroElements = document.querySelectorAll('#hero .gsap-reveal');
  if (heroElements.length) {
    gsap.timeline({ delay: 0.25 })
      .to(heroElements[0], { opacity: 1, y: 0, duration: .8, ease: 'power3.out' }, 0)
      .fromTo(heroElements[0], { y: 20 }, { y: 0, duration: .8, ease: 'power3.out' }, 0)

      .to(heroElements[1], { opacity: 1, duration: .9, ease: 'power3.out' }, 0.15)
      .fromTo(heroElements[1], { y: 30 }, { y: 0, duration: .9, ease: 'power3.out' }, 0.15)

      .to(heroElements[2], { opacity: 1, duration: .7, ease: 'power3.out' }, 0.3)
      .fromTo(heroElements[2], { y: 20 }, { y: 0, duration: .7, ease: 'power3.out' }, 0.3)

      .to(heroElements[3], { opacity: 1, duration: .7, ease: 'power3.out' }, 0.4)
      .fromTo(heroElements[3], { y: 16 }, { y: 0, duration: .7, ease: 'power3.out' }, 0.4)

      .to(heroElements[4], { opacity: 1, duration: .6, ease: 'power2.out' }, 0.55)
      .fromTo(heroElements[4], { y: 14 }, { y: 0, duration: .6, ease: 'power2.out' }, 0.55);
  }


  /* ════════════════════════════════════
     SCROLL REVEALS — toutes sections
     (éléments avec .gsap-reveal hors hero)
  ════════════════════════════════════ */

  const reveals = document.querySelectorAll(
    'section:not(#hero) .gsap-reveal'
  );

  reveals.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: .85,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  });


  /* ════════════════════════════════════
     CARDS FACETTES — stagger
  ════════════════════════════════════ */
  const cards = document.querySelectorAll('.card-facette.gsap-reveal');
  if (cards.length) {
    gsap.fromTo(cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: .7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: cards[0],
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }


  /* ════════════════════════════════════
     GALERIE — stagger reveal
  ════════════════════════════════════ */
  const galerieItems = document.querySelectorAll('.galerie-item.gsap-reveal');
  if (galerieItems.length) {
    gsap.fromTo(galerieItems,
      { opacity: 0, scale: 0.96 },
      {
        opacity: 1,
        scale: 1,
        duration: .75,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: galerieItems[0],
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    );
  }


  /* ════════════════════════════════════
     COMPTEURS — Anime.js
  ════════════════════════════════════ */
  if (typeof anime === 'undefined') return;

  const counters = document.querySelectorAll('.counter[data-target]');

  counters.forEach((counter) => {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    let triggered = false;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !triggered) {
          triggered = true;
          observer.disconnect();

          const obj = { val: 0 };
          anime({
            targets: obj,
            val: target,
            duration: 1800,
            easing: 'easeOutExpo',
            update: () => {
              counter.textContent = Math.round(obj.val);
            },
            complete: () => {
              counter.textContent = target;
              counter.classList.add('stat-glow');
            },
          });
        }
      });
    }, { threshold: 0.6 });

    observer.observe(counter);
  });


  /* ════════════════════════════════════
     CITATION — animation mot par mot (Anime.js)
  ════════════════════════════════════ */
  const quoteEl = document.querySelector('#section-quote blockquote p');
  if (quoteEl && typeof anime !== 'undefined') {
    const text  = quoteEl.textContent;
    const words = text.trim().split(' ');

    // Remplacer le texte par des spans
    quoteEl.innerHTML = words
      .map(w => `<span class="inline-block opacity-0 translate-y-2">${w}&nbsp;</span>`)
      .join('');

    const wordSpans = quoteEl.querySelectorAll('span');

    ScrollTrigger.create({
      trigger: quoteEl,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        anime({
          targets: wordSpans,
          opacity: [0, 1],
          translateY: [8, 0],
          duration: 600,
          delay: anime.stagger(55),
          easing: 'easeOutCubic',
        });
      },
    });
  }

});


