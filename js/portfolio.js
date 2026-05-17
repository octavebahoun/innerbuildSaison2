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
    if (loop) {
      loop.kill();
      loop = null;
    }

    // Kill any active tweens on the items to prevent conflicts
    gsap.killTweensOf(items);
    
    // Reset positions and clear transform properties on ALL items so they flow naturally in CSS Grid first
    gsap.set(items, { x: 0, xPercent: 0, scale: 1, opacity: 1, clearProps: "all" });

    const gridEl = document.querySelector('#portfolio-grid');
    const wrapper = document.querySelector('.portfolio-carousel-wrapper');
    const visibleItems = items.filter(item => getComputedStyle(item).display !== 'none');

    // UX : Si nous avons peu d'éléments (moins de 5), la boucle infinie semble vide.
    // Nous passons en grille statique responsive centrée pour une esthétique éditoriale impeccable.
    if (visibleItems.length < 5) {
      if (gridEl) gridEl.classList.add('is-static');
      if (wrapper) {
        wrapper.classList.remove('cursor-grab');
        wrapper.style.cursor = 'default';
      }
      return; // Fin précoce, pas de défilement infini requis
    } else {
      if (gridEl) gridEl.classList.remove('is-static');
      if (wrapper) {
        wrapper.classList.add('cursor-grab');
        wrapper.style.cursor = '';
      }
    }

    if (prefersReducedMotion) return; // Ne pas activer de défilement si mouvement réduit activé
    if (visibleItems.length < 3) return;

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
      if (grid && grid.classList.contains('is-static')) return; // Disable drag on static layout
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
      if (grid && grid.classList.contains('is-static')) return; // Disable drag on static layout
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

  // ── PREMIUM LIGHTBOX FUNCTIONALITY ──
  let lightboxEl = null;
  let activeIndex = 0;
  let visibleItems = [];

  function createLightbox() {
    if (lightboxEl) return;

    lightboxEl = document.createElement('div');
    lightboxEl.id = 'premium-lightbox';
    // Deep dark backdrop blur with high-end glassmorphism
    lightboxEl.className = 'fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-dark/95 backdrop-blur-2xl opacity-0 pointer-events-none transition-all duration-300';
    lightboxEl.innerHTML = `
      <!-- Close Button (Glassmorphic) -->
      <button class="lightbox-close absolute top-6 right-6 w-12 h-12 rounded-full border border-snow/10 bg-dark/60 text-snow flex items-center justify-center hover:bg-rose hover:text-snow hover:border-rose/50 hover:scale-105 transition-all duration-300 cursor-pointer z-50 focus:outline-none" aria-label="Fermer la galerie">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <!-- Prev Button (Glassmorphic) -->
      <button class="lightbox-prev absolute left-6 w-12 h-12 rounded-full border border-snow/10 bg-dark/40 text-snow flex items-center justify-center hover:bg-rose hover:border-rose/50 hover:scale-105 transition-all duration-300 cursor-pointer z-50 focus:outline-none" aria-label="Image précédente">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- Next Button (Glassmorphic) -->
      <button class="lightbox-next absolute right-6 w-12 h-12 rounded-full border border-snow/10 bg-dark/40 text-snow flex items-center justify-center hover:bg-rose hover:border-rose/50 hover:scale-105 transition-all duration-300 cursor-pointer z-50 focus:outline-none" aria-label="Image suivante">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- Image Wrapper with Signature Offset Frames -->
      <div class="lightbox-content-container relative max-w-[90vw] max-h-[70vh] md:max-w-[70vw] md:max-h-[75vh] flex flex-col items-center justify-center p-2 group">
        <!-- Offset glowing frames mirroring our Hero section -->
        <div class="absolute inset-0 rounded-[2rem] border border-rose/30 translate-x-3.5 translate-y-3.5 rotate-[1.5deg] pointer-events-none transition-transform duration-700" aria-hidden="true"></div>
        <div class="absolute inset-0 rounded-[2rem] border border-gold/30 -translate-x-3.5 -translate-y-3.5 -rotate-[1.5deg] pointer-events-none transition-transform duration-700" aria-hidden="true"></div>
        <div class="absolute -inset-2 bg-gradient-to-r from-rose/15 to-gold/15 rounded-[2rem] blur-xl opacity-40 pointer-events-none" aria-hidden="true"></div>

        <!-- Mask container -->
        <div class="relative overflow-hidden rounded-[2rem] border border-snow/10 bg-dark shadow-2xl z-10 flex items-center justify-center max-w-full max-h-full">
          <img src="" alt="" class="lightbox-img max-w-full max-h-[60vh] md:max-h-[68vh] object-contain transition-transform duration-500" />
        </div>
      </div>

      <!-- Caption (Category & Title) -->
      <div class="lightbox-caption text-center mt-8 z-10 px-6 max-w-xl">
        <span class="lightbox-badge inline-block px-3 py-1 rounded-full text-[0.55rem] tracking-widest uppercase mb-3"></span>
        <h3 class="lightbox-title font-display text-xl md:text-2xl font-bold text-snow"></h3>
      </div>
    `;

    document.body.appendChild(lightboxEl);

    // Click events
    lightboxEl.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightboxEl.querySelector('.lightbox-prev').addEventListener('click', prevImage);
    lightboxEl.querySelector('.lightbox-next').addEventListener('click', nextImage);
    
    lightboxEl.addEventListener('click', (e) => {
      if (e.target === lightboxEl) closeLightbox();
    });

    // Keydown keyboard navigation
    document.addEventListener('keydown', handleKeyDown);

    // Swipe touch support
    let touchStartX = 0;
    let touchEndX = 0;
    lightboxEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    lightboxEl.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      if (touchEndX < touchStartX - 50) {
        nextImage();
      } else if (touchEndX > touchStartX + 50) {
        prevImage();
      }
    }
  }

  function handleKeyDown(e) {
    if (!lightboxEl || lightboxEl.classList.contains('pointer-events-none')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  }

  function openLightbox(index) {
    createLightbox();
    
    // Find visible items based on currently selected filter
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    visibleItems = items.filter(item => activeFilter === 'all' || item.classList.contains(activeFilter));
    
    activeIndex = index;
    updateLightboxContent();

    lightboxEl.classList.remove('pointer-events-none');
    
    // Stop ongoing animations
    gsap.killTweensOf(lightboxEl);
    gsap.killTweensOf('.lightbox-content-container');
    gsap.killTweensOf('.lightbox-caption');

    // Smooth entry GSAP transitions
    gsap.fromTo(lightboxEl, 
      { opacity: 0 }, 
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    gsap.fromTo('.lightbox-content-container', 
      { scale: 0.93, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.5, delay: 0.05, ease: 'back.out(1.2)' }
    );

    gsap.fromTo('.lightbox-caption',
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, delay: 0.15, ease: 'power3.out' }
    );
  }

  function closeLightbox() {
    if (!lightboxEl || lightboxEl.classList.contains('pointer-events-none')) return;
    
    lightboxEl.classList.add('pointer-events-none');
    
    gsap.killTweensOf(lightboxEl);
    gsap.killTweensOf('.lightbox-content-container');
    gsap.killTweensOf('.lightbox-caption');

    gsap.to('.lightbox-content-container', {
      scale: 0.95,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });

    gsap.to('.lightbox-caption', {
      y: 10,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in'
    });

    gsap.to(lightboxEl, {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in'
    });
  }

  function updateLightboxContent() {
    if (visibleItems.length === 0) return;
    
    // Cyclical bounds check
    if (activeIndex < 0) activeIndex = visibleItems.length - 1;
    if (activeIndex >= visibleItems.length) activeIndex = 0;

    const currentItem = visibleItems[activeIndex];
    const imgEl = currentItem.querySelector('.portfolio-img');
    const titleEl = currentItem.querySelector('h3');
    const badgeEl = currentItem.querySelector('span');

    const lightboxImg = lightboxEl.querySelector('.lightbox-img');
    const lightboxTitle = lightboxEl.querySelector('.lightbox-title');
    const lightboxBadge = lightboxEl.querySelector('.lightbox-badge');

    // Animate image crossfade beautifully
    gsap.to(lightboxImg, {
      opacity: 0,
      scale: 0.98,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        lightboxImg.src = imgEl.src;
        lightboxImg.alt = imgEl.alt;
        lightboxTitle.textContent = titleEl ? titleEl.textContent : '';
        
        if (badgeEl) {
          lightboxBadge.textContent = badgeEl.textContent;
          lightboxBadge.style.display = 'inline-block';
          
          const category = currentItem.getAttribute('data-category');
          lightboxBadge.className = 'lightbox-badge inline-block px-3 py-1 rounded-full text-[0.55rem] tracking-widest uppercase mb-2';
          
          if (category === 'evenements') {
            lightboxBadge.classList.add('bg-rose/20', 'border', 'border-rose/30', 'text-rose');
          } else if (category === 'cinema') {
            lightboxBadge.classList.add('bg-indigo/20', 'border', 'border-indigo/30', 'text-indigo-light');
          } else if (category === 'eco') {
            lightboxBadge.classList.add('bg-green-eco-light/20', 'border', 'border-green-eco-light/30', 'text-green-eco-light');
          } else {
            lightboxBadge.classList.add('bg-gold/20', 'border', 'border-gold/30', 'text-gold');
          }
        } else {
          lightboxBadge.style.display = 'none';
        }

        gsap.fromTo(lightboxImg, 
          { opacity: 0, scale: 0.98 },
          { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
        );
      }
    });
  }

  function nextImage() {
    activeIndex++;
    updateLightboxContent();
  }

  function prevImage() {
    activeIndex--;
    updateLightboxContent();
  }

  // ── HOVER CURSOR SCALING & CLICK HANDLER ──
  items.forEach((item) => {
    // Add magnetic hover class to scale up custom cursor
    item.addEventListener('mouseenter', () => {
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.classList.add('hovering');
    });
    
    item.addEventListener('mouseleave', () => {
      const cursor = document.getElementById('cursor');
      if (cursor) cursor.classList.remove('hovering');
    });

    // Open lightbox only on complete static click (ignore drags)
    item.addEventListener('click', () => {
      if (isDragging) return;

      const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
      const visibleGroup = items.filter(el => activeFilter === 'all' || el.classList.contains(activeFilter));
      const groupIndex = visibleGroup.indexOf(item);
      
      if (groupIndex !== -1) {
        openLightbox(groupIndex);
      }
    });
  });

  // Init au chargement
  window.addEventListener('load', setupMarquee);
  if (document.readyState === 'complete') setupMarquee();
  
  window.addEventListener('resize', () => {
    setupMarquee();
  });
});
