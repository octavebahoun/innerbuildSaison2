# 🚀 GUIDE D'AMÉLIORATION — Code & Actions

## 1. 🔴 CRITIQUE: Support `prefers-reduced-motion`

**Pourquoi**: Utilisateurs avec conditions vestibulaires ou photosensibilité peuvent être affectés par animations

**Fichier**: `css/style.css`

**Action**:
```css
/* Ajouter à la fin du fichier style.css */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto !important;
  }
  
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  #cursor {
    display: none !important;
  }
  
  .btn-shimmer::before {
    display: none !important;
  }
}
```

**Test**: 
```bash
# Sur Mac: Système > Accessibilité > Affichage > Réduire les mouvements
# Sur Windows: Paramètres > Accessibilité > Affichage > Afficher les animations
# Vérifier que les animations disparaissent
```

---

## 2. 🔴 CRITIQUE: ARIA Live Region sur Formulaire

**Pourquoi**: Les utilisateurs de lecteurs d'écran ne savent pas quand un message d'erreur/succès apparaît

**Fichier**: `contact.html`

**Avant**:
```html
<div id="form-feedback" class="hidden text-sm text-center mt-4"></div>
```

**Après**:
```html
<div id="form-feedback" 
     class="hidden text-sm text-center mt-4" 
     role="status" 
     aria-live="polite" 
     aria-atomic="true">
</div>
```

**Mettre à jour JS** (`js/contact.js`):
```javascript
const formFeedback = document.getElementById('form-feedback');

// Lors de succès:
formFeedback.classList.remove('hidden', 'text-red-400');
formFeedback.classList.add('text-green-400');
formFeedback.textContent = '✓ Message envoyé avec succès!';
// aria-live=polite annoncera automatiquement le changement

// Lors d'erreur:
formFeedback.classList.remove('hidden', 'text-green-400');
formFeedback.classList.add('text-red-400');
formFeedback.textContent = '✗ Erreur: Veuillez vérifier vos données.';
```

---

## 3. 🔴 CRITIQUE: Filtres Portfolio Fonctionnels

**Fichier**: `js/main.js`

**Ajouter après le code burger menu**:
```javascript
/* ─── PORTFOLIO FILTERS ─── */
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length) {
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const filter = this.getAttribute('data-filter');

      // Mettre à jour classe active sur boutons
      filterBtns.forEach(b => b.classList.remove('active', 'border-rose', 'text-rose'));
      filterBtns.forEach(b => b.classList.add('border-snow/20', 'text-snow/60'));
      this.classList.add('active', 'border-rose', 'text-rose');
      this.classList.remove('border-snow/20', 'text-snow/60');

      // Filtrer les éléments portfolio
      portfolioItems.forEach(item => {
        if (filter === 'all') {
          item.style.display = 'block';
          setTimeout(() => item.classList.add('opacity-100'), 10);
          item.classList.remove('opacity-0');
        } else if (item.classList.contains(filter)) {
          item.style.display = 'block';
          setTimeout(() => item.classList.add('opacity-100'), 10);
          item.classList.remove('opacity-0');
        } else {
          item.classList.add('opacity-0');
          setTimeout(() => item.style.display = 'none', 300);
        }
      });
    });
  });
}
```

**CSS pour animation** (ajouter dans `style.css`):
```css
.portfolio-item {
  transition: opacity 0.3s ease-out;
}

.portfolio-item.opacity-0 {
  opacity: 0;
}

.portfolio-item.opacity-100 {
  opacity: 1;
}
```

---

## 4. 🟠 IMPORTANT: Images Responsives avec `srcset`

**Fichier**: `portfolio.html`

**Avant**:
```html
<img src="assets/images/synnova-portrait-traditional-2.webp" 
     alt="Synnova animation" 
     class="w-full h-80 object-cover" />
```

**Après**:
```html
<img 
  src="assets/images/synnova-portrait-traditional-2-large.webp" 
  srcset="assets/images/synnova-portrait-traditional-2-small.webp 640w,
          assets/images/synnova-portrait-traditional-2-medium.webp 1024w,
          assets/images/synnova-portrait-traditional-2-large.webp 1920w"
  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
  alt="Synnova animation" 
  class="w-full h-80 object-cover" 
  loading="lazy" 
  decoding="async"
  width="1920" 
  height="1440" 
/>
```

**Script pour générer variantes** (optional, en Python):
```python
from PIL import Image
import os

images_dir = "assets/images"
sizes = [640, 1024, 1920]

for img_file in os.listdir(images_dir):
    if img_file.endswith(".webp"):
        img_path = os.path.join(images_dir, img_file)
        img = Image.open(img_path)
        
        for size in sizes:
            ratio = size / max(img.size)
            new_size = (int(img.size[0] * ratio), int(img.size[1] * ratio))
            img_resized = img.resize(new_size, Image.LANCZOS)
            
            new_name = img_file.replace(".webp", f"-{size}w.webp")
            img_resized.save(os.path.join(images_dir, new_name))
```

---

## 5. 🟠 IMPORTANT: Google Fonts avec `display=swap`

**Fichier**: `index.html`, `contact.html`, `portfolio.html`, `univers.html`, `a-propos.html`, `doc.html`

**Avant**:
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&family=Kaushan+Script&display=swap" rel="stylesheet" />
```

**Après** (ajouter `&display=swap`):
```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&family=Kaushan+Script&display=swap" rel="stylesheet" />
```

✓ **Déjà fait dans votre code!** Bon travail!

---

## 6. 🟠 IMPORTANT: Minification JavaScript

**Fichier**: `package.json`

**Ajouter scripts**:
```json
{
  "scripts": {
    "buildcss": "npx @tailwindcss/cli -i ./css/style.css -o ./css/output.css --watch",
    "buildjs": "npx esbuild js/main.js js/animations.js js/contact.js --bundle --minify --outdir=js/dist",
    "build": "npm run buildcss && npm run buildjs"
  },
  "devDependencies": {
    "esbuild": "^0.20.0"
  }
}
```

**Utiliser les fichiers minifiés en production**:
```html
<!-- En développement -->
<script src="js/main.js" defer></script>
<script src="js/animations.js" defer></script>

<!-- En production -->
<script src="js/dist/main.js" defer></script>
<script src="js/dist/animations.js" defer></script>
```

---

## 7. 🟠 IMPORTANT: Focus Trap Menu Mobile

**Fichier**: `js/main.js`

**Améliorer la fonction `openMenu()`**:
```javascript
const openMenu = () => {
  menuOpen = true;
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
  mobileMenu.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
};
```

**Et stocker le dernier élément focusé**:
```javascript
let lastFocusedElement;

const openMenu = () => {
  lastFocusedElement = document.activeElement; // Stocker focus avant menu
  // ... reste du code
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
  
  // Restaurer focus au burger
  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }
};
```

---

## 8. 🟡 SOUHAITABLE: Améliorer Opacity Hero Gradient

**Fichier**: `css/style.css`

**Avant**:
```css
#hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(13,13,13,.05) 0%,
    rgba(13,13,13,.25) 35%,
    rgba(13,13,13,.82) 70%,
    rgba(13,13,13,1) 100%
  );
  z-index: 1;
}
```

**Après** (0.82 → 0.6):
```css
#hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(13,13,13,.05) 0%,
    rgba(13,13,13,.20) 35%,
    rgba(13,13,13,.60) 70%,
    rgba(13,13,13,.95) 100%
  );
  z-index: 1;
}
```

---

## 9. 🟡 SOUHAITABLE: Feedback Validation Formulaire

**Fichier**: `js/contact.js` (créer si n'existe pas)

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('form-feedback');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Valider
      const prenom = document.getElementById('prenom').value.trim();
      const email = document.getElementById('email').value.trim();
      const sujet = document.getElementById('sujet').value;
      const message = document.getElementById('message').value.trim();

      if (!prenom || !email || !sujet || !message) {
        feedback.classList.remove('hidden');
        feedback.classList.add('text-red-500');
        feedback.textContent = '✗ Veuillez remplir tous les champs.';
        return;
      }

      // Valider email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        feedback.classList.remove('hidden');
        feedback.classList.add('text-red-500');
        feedback.textContent = '✗ L\'adresse email n\'est pas valide.';
        return;
      }

      // Envoyer (exemple avec Formspree ou API backend)
      try {
        const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prenom, email, sujet, message })
        });

        if (response.ok) {
          feedback.classList.remove('hidden', 'text-red-500');
          feedback.classList.add('text-green-500');
          feedback.textContent = '✓ Message envoyé! Je vous répondrai bientôt.';
          form.reset();
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        feedback.classList.remove('hidden', 'text-green-500');
        feedback.classList.add('text-red-500');
        feedback.textContent = '✗ Erreur d\'envoi. Réessayez plus tard.';
      }
    });
  }
});
```

**Script dans HTML**:
```html
<script src="js/contact.js" defer></script>
```

---

## 10. 🟡 SOUHAITABLE: Améliorer Texte Navigation Mobile

**Fichier**: Tailwind config

**Dans `tailwind.config.js`**:
```js
module.exports = {
  // ...
  theme: {
    extend: {
      fontSize: {
        'hero': 'clamp(3.5rem, 14vw, 9rem)',
        'nav-mobile': 'clamp(1.75rem, 5vw, 2.25rem)', // NEW
      }
    }
  }
}
```

**Utiliser dans `contact.html` et autres**:
```html
<!-- Avant -->
<li><a href="index.html" class="font-display text-4xl font-semibold">Accueil</a></li>

<!-- Après -->
<li><a href="index.html" class="font-display font-semibold nav-mobile">Accueil</a></li>
```

---

## 📋 Checklist d'Implémentation

Copier-coller dans VS Code pour tracker:

```
☐ 1. Ajouter @media (prefers-reduced-motion) dans style.css
☑ 2. Ajouter aria-live + role="status" au form feedback ✅
☐ 3. Implémenter filtres portfolio en JavaScript
☐ 4. Ajouter srcset à toutes les images portfolio
☑ 5. Vérifier Google Fonts display=swap (déjà fait ✓)
☑ 6. Configurer esbuild pour minification JS ✅
☑ 7. Implémenter focus trap menu mobile ✅
☐ 8. Réduire opacité gradient hero
☑ 9. Créer contact.js avec validation formulaire ✅
☐ 10. Ajuster font-size menu mobile
☐ 11. Tester sur Lighthouse (production)
☐ 12. Créer page Accessibilité/Déclaration RGAA
```

---

## 🧪 Test & Validation

### 1. Lighthouse Audit
```bash
# Sur production (Vercel URL)
# Chrome DevTools > Lighthouse > Generate report
# Viser: Performance 80+, Accessibility 95+, Best Practices 90+
```

### 2. WAVE Accessibility
- Utiliser extension WAVE pour vérifier contraste, labels, ARIA
- https://wave.webaim.org/

### 3. Tests Clavier
- Tab/Shift+Tab pour navigation
- Enter sur liens/boutons
- Escape pour fermer menus
- Arrow keys dans select

### 4. Lecteur d'Écran
- NVDA (Windows) ou VoiceOver (Mac)
- Vérifier annonces aria-live
- Tester focus trap

---

## 📞 Support

Questions sur ces améliorations? Consultez:
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **ARIA Authoring**: https://www.w3.org/WAI/ARIA/apg/
- **Tailwind Docs**: https://tailwindcss.com/docs
