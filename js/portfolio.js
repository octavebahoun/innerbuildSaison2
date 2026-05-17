'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const grid = document.querySelector('#portfolio-grid');
  const items = gsap.utils.toArray('.portfolio-item');
  const filterBtns = document.querySelectorAll('.filter-btn');
  let loop;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Fonction Marquee Infini (Adaptée Multi-Row)
  function setupMarquee() {
    if (loop) loop.kill();
    if (prefersReducedMotion) return; // Ne pas activer de défilement si mouvement réduit activé
    
    const visibleItems = items.filter(item => getComputedStyle(item).display !== 'none');
    if (visibleItems.length < 3) return;

    // Reset positions avant de recalculer
    gsap.set(visibleItems, { x: 0, xPercent: 0 });

    loop = horizontalLoop(visibleItems, {
      repeat: -1,
      speed: 0.8,
      paddingRight: 48,
      paused: false
    });
  }

  // Helper horizontalLoop (standard GSAP avec patch pour multi-row)
  function horizontalLoop(items, config) {
    items = gsap.utils.toArray(items);
    config = config || {};
    let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: {ease: "none"},
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    pixelsPerSecond = (config.speed || 1) * 100,
    totalWidth, item, i;
    
    gsap.set(items, {
      xPercent: (i, target) => {
        let w = widths[i] = parseFloat(gsap.getProperty(target, "width", "px"));
        xPercents[i] = gsap.utils.snap(0.01, parseFloat(gsap.getProperty(target, "x", "px")) / w * 100);
        return xPercents[i];
      }
    });
    gsap.set(items, {x: 0});

    // PATCH MULTI-ROW : On cherche la fin réelle de la grille (max offsetLeft + width)
    const maxX = Math.max(...items.map(el => el.offsetLeft + el.offsetWidth));
    totalWidth = maxX - startX + (parseFloat(config.paddingRight) || 0);

    for (i = 0; i < length; i++) {
      item = items[i];
      let curX = xPercents[i] / 100 * widths[i];
      let distanceToStart = item.offsetLeft - startX;
      let distanceToLoop = distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
      
      tl.to(item, {xPercent: gsap.utils.snap(0.01, (curX - distanceToLoop) / widths[i] * 100), duration: distanceToLoop / pixelsPerSecond}, 0)
        .fromTo(item, {xPercent: gsap.utils.snap(0.01, (curX - distanceToLoop + totalWidth) / widths[i] * 100)}, {xPercent: xPercents[i], duration: (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond, immediateRender: false}, distanceToLoop / pixelsPerSecond)
        .add("label" + i, distanceToStart / pixelsPerSecond);
      times[i] = distanceToStart / pixelsPerSecond;
    }
    tl.progress(1, true).progress(0, true);
    return tl;
  }

  // 2. Logique de Filtrage
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      // UI Active
      filterBtns.forEach(b => b.classList.remove('active', 'border-rose'));
      btn.classList.add('active');

      // Arrêt du loop pendant la transition
      if (loop) loop.pause();

      const itemsToHide = items.filter(item => filter !== 'all' && !item.classList.contains(filter));
      const itemsToShow = items.filter(item => filter === 'all' || item.classList.contains(filter));

      const tl = gsap.timeline({
        onComplete: () => {
          setupMarquee(); // Relance avec les nouveaux éléments
        }
      });

      if (itemsToHide.length) {
        tl.to(itemsToHide, {
          opacity: 0, scale: 0.8, duration: 0.4, stagger: 0.05,
          display: 'none', ease: 'power2.in'
        });
      }

      tl.fromTo(itemsToShow, 
        { opacity: 0, scale: 0.9, display: 'none' },
        {
          opacity: 1, scale: 1, duration: 0.5, stagger: 0.05,
          display: 'block', ease: 'power3.out', clearProps: "transform"
        }, "-=0.2"
      );
    });
  });

  // 3. Interactions Hover (Désactivées si drag actif)
  if (grid) {
    grid.addEventListener('mouseenter', () => {
      if (!isDragging && loop) loop.pause();
    });
    grid.addEventListener('mouseleave', () => {
      if (!isDragging && loop) loop.play();
    });
  }

  // 4. Glissement / Dragging tactile et souris (Résolution de la friction UX)
  const wrapper = document.querySelector('.portfolio-carousel-wrapper');
  let isDragging = false;
  let startX, currentX;
  let dragVelocity = 0;
  let lastTime, lastX;

  if (wrapper) {
    wrapper.addEventListener('mousedown', (e) => {
      if (prefersReducedMotion) return;
      isDragging = true;
      wrapper.classList.remove('cursor-grab');
      wrapper.classList.add('cursor-grabbing');
      startX = e.clientX;
      lastX = e.clientX;
      lastTime = performance.now();
      dragVelocity = 0;
      if (loop) loop.pause();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      if (dt > 0) {
        dragVelocity = dx / dt; // pixels par milliseconde
      }

      // Déplacer manuellement la progress de la timeline
      if (loop) {
        const progression = loop.totalTime() - (dx * 0.005);
        loop.totalTime(progression);
      }
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      wrapper.classList.remove('cursor-grabbing');
      wrapper.classList.add('cursor-grab');

      // Inertie de décélération douce après le lancer
      if (Math.abs(dragVelocity) > 0.1 && loop) {
        const inertia = { speed: dragVelocity * 8 };
        gsap.to(inertia, {
          speed: 0,
          duration: 0.8,
          ease: 'power3.out',
          onUpdate: () => {
            loop.totalTime(loop.totalTime() - inertia.speed * 0.015);
          },
          onComplete: () => {
            loop.play();
          }
        });
      } else {
        if (loop) loop.play();
      }
    });

    // Événements tactiles (mobile)
    wrapper.addEventListener('touchstart', (e) => {
      if (prefersReducedMotion) return;
      isDragging = true;
      startX = e.touches[0].clientX;
      lastX = e.touches[0].clientX;
      lastTime = performance.now();
      dragVelocity = 0;
      if (loop) loop.pause();
    }, { passive: true });

    wrapper.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      const dx = e.touches[0].clientX - lastX;
      lastX = e.touches[0].clientX;
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      if (dt > 0) {
        dragVelocity = dx / dt;
      }

      if (loop) {
        const progression = loop.totalTime() - (dx * 0.005);
        loop.totalTime(progression);
      }
    }, { passive: true });

    wrapper.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(dragVelocity) > 0.1 && loop) {
        const inertia = { speed: dragVelocity * 8 };
        gsap.to(inertia, {
          speed: 0,
          duration: 0.8,
          ease: 'power3.out',
          onUpdate: () => {
            loop.totalTime(loop.totalTime() - inertia.speed * 0.015);
          },
          onComplete: () => {
            loop.play();
          }
        });
      } else {
        if (loop) loop.play();
      }
    });
  }

  // Parallaxe de survol (désactivé si mouvement réduit)
  if (!prefersReducedMotion) {
    items.forEach(item => {
      const img = item.querySelector('.portfolio-img');
      if (img) {
        item.addEventListener('mousemove', (e) => {
          const rect = item.getBoundingClientRect();
          const xPos = (e.clientX - rect.left) / rect.width - 0.5;
          const yPos = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(img, { x: xPos * 20, y: yPos * 20, duration: 0.6, ease: 'power2.out' });
        });
        item.addEventListener('mouseleave', () => {
          gsap.to(img, { x: 0, y: 0, duration: 1, ease: 'power2.out' });
        });
      }
    });
  }

  // Init au chargement
  window.addEventListener('load', setupMarquee);
  if (document.readyState === 'complete') setupMarquee();
  
  window.addEventListener('resize', () => {
    setupMarquee();
  });
});
