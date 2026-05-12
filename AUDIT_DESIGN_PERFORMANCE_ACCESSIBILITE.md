# 📋 AUDIT COMPLET — Design, Performance & Accessibilité
## Site Synnova Tocloe
**Date**: 12 mai 2026  
**URL**: https://synnovatocloe.vercel.app/

---

## 🎨 AUDIT DESIGN

### ✅ POINTS POSITIFS

#### Identité Visuelle
- **Palette cohérente**: Rose (#C2185B), Gold (#F9A825), Indigo, Snow, Dark — forte identité visuelle
- **Typography sophistiquée**: 3 familles de police bien définies (Cormorant Garamond pour le prestige, Outfit pour le corps, Kaushan Script pour la signature)
- **Hiérarchie claire**: Utilisation intelligente de la taille, poids et couleur
- **Contraste élevé**: Texte clair sur fond sombre, excellent pour la lisibilité

#### Layout & Composition
- **Responsive design solide**: Navigation adaptée mobile/desktop, grille flexible
- **Espacement cohérent**: Utilisation de padding/margin régulière
- **Grille bien pensée**: Sections bien délimitées avec max-width, alignement centré

#### Éléments Visuels
- **Grain overlay subtil**: Texture légère (opacity 0.4) qui n'agace pas
- **Dégradés et accents**: Ligne dorée/rose sous le hero, gradient sous-jacent
- **Cursor personnalisé**: Détail raffiné desktop-only (rose puis gold au survol)
- **Animations fluides**: GSAP avec ScrollTrigger, parallax léger

#### Branding
- **Logo mémorable**: "Syn[nova]" avec color accent
- **Cohérence entre pages**: Design unifié sur index, portfolio, contact, à-propos
- **Open Graph & SEO**: Images OG correctes pour les partages

### ⚠️ PROBLÈMES & AMÉLIORATIONS NÉCESSAIRES

#### Design Visuel
1. **Manque de variété visuelle dans les sections**
   - Trop de contenu textuel sans éléments visuels intermédiaires
   - Les sections "à propos", "univers" pourraient avoir plus de graphiques/illustrations
   - **Action**: Ajouter des icônes SVG personnalisées, illustrations, éléments visuels

2. **Formulaire contact peu stylisé**
   - Champs avec underline seulement, très minimaliste
   - Pas de feedback visuel fort pour les états (focus, error, success)
   - **Action**: Ajouter des animations aux focus, messages d'erreur visuels

3. **Portfolio/Galerie**
   - Les overlay au survol sont bons mais manquent d'interactivité
   - Les filtres "Tout voir / Événements / Cinéma / Éco-Social" ne semblent pas fonctionnels (CSS-only?)
   - **Action**: Implémenter les filtres en JavaScript, ajouter des transitions

4. **Gradient et overlays**
   - Le dégradé hero `rgba(13,13,13,...)` à 82% est peut-être trop agressif
   - Rend l'image moins visible — considérer 0.5-0.6 au lieu de 0.82
   - **Action**: Réduire l'opacité du gradient pour plus de visibilité

5. **Espacement mobile**
   - Sur mobile (< 768px), certaines sections pourraient avoir plus de padding vertical
   - Les typographies h1 avec `clamp()` peuvent être légèrement trop petites sur très petit écran
   - **Action**: Vérifier sur iPhone 12 mini / SE

6. **Menu mobile**
   - Le menu est belle mais le texte est très grand (font-display text-4xl)
   - Sur petit écran, les liens peuvent déborder verticalement
   - **Action**: Ajouter scroll ou réduire taille font sur très petits écrans

#### Consistance & Patterns
7. **Boutons inconsistants**
   - Certains boutons sont `.btn-shimmer` (avec animation shimmer)
   - D'autres sont simples links
   - Les états de bouton (disabled, hover) ne sont pas uniformisés
   - **Action**: Créer une classe `.btn` réutilisable avec variantes

8. **Cards & modules**
   - Pas d'ombre (shadow) sur les cartes
   - Peut rendre le contraste avec le fond noir insuffisant
   - **Action**: Ajouter des subtiles drop-shadow sur cartes interactives

---

## ⚡ AUDIT PERFORMANCE

### ✅ POINTS POSITIFS

#### Optimisation Assets
- **Images en WebP**: Excellent choix format (synnova-*.webp)
- **Lazy loading**: `loading="lazy"` sur images portfolio
- **Dimensioning correct**: Attributs `width/height` sur images
- **Favicon SVG**: Léger et scalable

#### CSS & Framework
- **Tailwind CSS**: Framework performant, output.css généré via CLI
- **CSS moderne**: Pas de framework lourd (Bootstrap, Material Design)
- **No redundant styles**: Tailwind élimine CSS inutilisé

#### JavaScript
- **Libs minifiées**: GSAP, ScrollTrigger, Anime via CDN
- **Déferred scripts**: `<script defer>` sur tous les JS
- **Pas d'inline scripts lourds**: Code bien organisé

#### Structure
- **Single-page pattern**: Navigation entre fichiers HTML (pas de SPA overhead)
- **No external APIs**: Pas d'appels backend/API sur chaque page
- **Preconnect DNS**: `<link rel="preconnect">` pour Google Fonts, gstatic

### ⚠️ PROBLÈMES & AMÉLIORATIONS NÉCESSAIRES

#### Images
1. **Taille images portfolio**
   - 15+ images WebP chargées (même les non-visibles au scroll)
   - Les résolutions ne sont pas optimales pour mobile
   - **Action**: Implémenter `srcset` pour responsive images
   ```html
   <img 
     src="assets/images/photo.webp"
     srcset="assets/images/photo-small.webp 640w, 
             assets/images/photo-medium.webp 1024w,
             assets/images/photo-large.webp 1920w"
     sizes="(max-width: 768px) 100vw, 50vw"
     alt="Description"
   />
   ```

2. **Google Fonts loading**
   - 3 polices Google (Cormorant, Outfit, Kaushan) — 3 requêtes de police
   - Pas de `font-display: swap` explicite (peut causer FOIT)
   - **Action**: Ajouter `display=swap` au lien Google Fonts
   ```html
   <link href="...?family=...&display=swap" rel="stylesheet" />
   ```

3. **Grain overlay SVG**
   - Généré dynamiquement via `background-image: url("data:image/svg+xml,...")`
   - Peut être lourd si mal compressé
   - **Action**: Vérifier que le SVG est bien compressé; considérer WebP placeholder

4. **GSAP & ScrollTrigger**
   - 3 libs via CDN: gsap.min.js (121KB), ScrollTrigger (98KB), anime.js (17KB)
   - ScrollTrigger est performance-intense pour scroll events
   - **Action**: Vérifier les perfs réelles via Lighthouse; considérer tree-shaking

5. **Pas de cache headers**
   - Vercel gère le cache par défaut, mais pas d'indication claire des max-age
   - **Action**: Vérifier les Cache-Control headers en production

#### JavaScript
6. **Custom cursor JavaScript**
   - Boucle `mousemove` passive (bon!), mais active sur tous les éléments `a, button, [role="button"]`
   - Sur page avec beaucoup d'éléments, peut ralentir
   - **Action**: Implémenter event delegation plutôt que boucle

7. **Pas de minification custom JS**
   - `main.js`, `contact.js`, `animations.js` ne semblent pas minifiés
   - **Action**: Ajouter étape build minification (esbuild, terser, webpack)

#### HTML/CSS
8. **Pas d'attribution media queries performantes**
   - Certaines classes CSS importantes sont toujours chargées
   - **Action**: Utiliser `@layer` Tailwind pour meilleure organization

9. **Form validation**
   - Formulaire contact utilise `novalidate` + JavaScript custom
   - Pas de validation côté serveur apparente
   - **Action**: Ajouter backend validation + rate limiting

#### Metrics
10. **Core Web Vitals potentiels issues**
    - **LCP (Largest Contentful Paint)**: Image hero — bon si bien optimisée
    - **FID (First Input Delay)**: Custom cursor peut ajouter du lag
    - **CLS (Cumulative Layout Shift)**: À vérifier au chargement fonts
    - **Action**: Lancer Lighthouse audit sur production

---

## ♿ AUDIT ACCESSIBILITÉ

### ✅ POINTS POSITIFS

#### Structure & Sémantique
- **Skip link présent**: Lien "Aller au contenu principal" avec `.sr-only`
- **Heading hierarchy**: H1, H2, H3 bien utilisés
- **Landmarks**: `<header>`, `<main>`, `<footer>` correctement utilisés
- **Semantic HTML**: `<nav>`, `<section>`, `<article>` appropriés
- **Roles explicites**: `role="banner"`, `role="contentinfo"`, `role="list"`, `role="dialog"`

#### Navigation
- **Focus visible**: Links et buttons ont des états focus
- **Keyboard navigation**: Burger menu accessible via clavier (Escape ferme)
- **Navigation principale**: Structure claire avec `aria-label`
- **Page currentness**: `aria-current="page"` sur le lien actif

#### Images
- **Alt text pertinent**: Images portfolio ont des descriptions `alt="Synnova animation"`
- **Icônes sociales**: `alt="Facebook"`, etc. sur liens
- **Decorative images**: `aria-hidden="true"` sur éléments non-essentiels (curseur, grain)

#### Forms
- **Labels associés**: `<label for="id">` liée à `<input id="id">`
- **Required indicators**: `required` attribute sur inputs
- **Placeholder**: Utilisé mais pas comme seul label (bon!)
- **Select accessible**: Options lisibles

#### Colors & Contrast
- **Contraste fort**: Texte blanc sur noir = WCAG AAA (18.5:1)
- **Pas de color-only encoding**: Les boutons actifs ont aussi `.text-rose`

#### Animations
- **Pas de animations autoplaying**: Animations sur scroll/interaction
- **Smooth scroll**: `scroll-smooth` sans `prefers-reduced-motion`

### ⚠️ PROBLÈMES & AMÉLIORATIONS NÉCESSAIRES

#### Sémantique & Structure
1. **Menu mobile `.dialog` mais pas `aria-modal="true"`**
   - Le menu a `aria-modal="true"` (bon!) mais initiallement `aria-hidden="true"`
   - Pas de focus trap implémenté (le premier lien est focusé, mais après fermeture, focus retourne où?)
   - **Action**: Implémenter gestion focus properly
   ```javascript
   // Au ouverture: focus trap vers premier lien
   // À la fermeture: focus retour au burger button
   ```

2. **Heading hierarchy**
   - Page contact: H1 "Contactez-moi", puis H3 "Mes Coordonnées", H3 "Suivez mon quotidien"
   - Pas de H2 intermédiaire — peut être confus pour screen readers
   - **Action**: Ajouter H2 ou restructurer

3. **Form sans `<fieldset>` groupant**
   - Les champs name + email auraient pu être dans `<fieldset>` group
   - **Action**: Considérer `<fieldset>` pour meilleure sémantique

#### Images & Media
4. **Images sans `decoding="async"`** ✓ (Actually, elles ont `decoding="async"` — bon!)
   - Mais pas de `importance="low"` sur images non-critical

5. **Pas de `width/height` attributes sur toutes images**
   - Certaines images n'ont pas les dimensions — peut causer layout shift
   - **Action**: Ajouter `width/height` à toutes les images

#### Navigation
6. **Mobile menu close: pas de indication visuelle suffisante**
   - Le menu ferme mais pas de toast/notification pour utilisateurs AT
   - **Action**: Ajouter `role="status"` feedback après action

7. **Liens sociaux dans mobile menu**
   - Pas d'`aria-label` sur liens sociales (juste `alt` sur img)
   - Lien sans texte visible = problème AT
   - **Action**: Ajouter `aria-label="Suivez-moi sur TikTok"` ou screen reader text

#### Forms
8. **Select dropdown customization**
   - Le select a `appearance-none` (bon pour custom styling)
   - Mais le focus outline custom n'est pas visible sur tous les navigateurs
   - **Action**: Ajouter focus ring visible:
   ```css
   select:focus {
     outline: 2px solid #C2185B;
     outline-offset: 2px;
   }
   ```

9. **Form validation feedback**
   - `<div id="form-feedback">` existe mais est `.hidden` par défaut
   - Pas de ARIA live region (`aria-live="polite"`) pour feedback messages
   - **Action**: Ajouter `aria-live="polite" aria-atomic="true"`
   ```html
   <div id="form-feedback" class="hidden" aria-live="polite" aria-atomic="true"></div>
   ```

10. **Formulaire pas de support type="email" validation**
    - `type="email"` est bien, mais pas de pattern ou validation custom visible
    - **Action**: Ajouter feedback clair pour invalid emails

#### Animations & Motion
11. **No `prefers-reduced-motion`**
    - Site utilise beaucoup GSAP animations
    - Utilisateurs avec préférence `prefers-reduced-motion: reduce` verront anims complètes
    - **Action**: Ajouter support:
    ```css
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
    ```

#### Color & Contrast
12. **Hover states sur boutons**
    - `.text-snow/70` est 70% opacity — peut être insufficient contrast pour malvoyants
    - **Action**: Tester contraste avec WCAG AA (minimum 4.5:1 pour texte normal)

13. **Rose light (#F8BBD0) sur dark (#0D0D0D)**
    - Contraste insuffisant pour texte
    - **Action**: Utiliser rose light seulement pour éléments non-texte

#### Responsive
14. **Text trop petit sur mobile**
    - `.text-[0.7rem]` pour nav links = 11.2px — peut être difficile à lire
    - **Action**: Utiliser `text-xs` (12px) minimum pour lisibilité

15. **Pas de `lang` attribute sur HTML tag**
    - ✓ Actually, il y a `<html lang="fr">` — parfait!

#### Accessibility Declaration
16. **Pas de statement d'accessibilité**
    - Ajouter page "Accessibilité" ou section dans mentions légales
    - **Action**: Créer `accessibilite.html` avec déclaration RGAA

---

## 📊 RÉSUMÉ DES PRIORITÉS

### 🔴 CRITIQUE (À faire immédiatement)
1. **Ajouter `prefers-reduced-motion` support** — WCAG 2.1 A
2. **Ajouter `aria-live` au formulaire feedback** — Pour utilisateurs AT
3. **Focus visible sur tous les éléments interactifs** — Clavier utilisateurs
4. **Implémenter filtres portfolio en JavaScript** — Utilisabilité

### 🟠 IMPORTANT (Sprint suivant)
5. **Optimiser images avec `srcset`** — Performance mobile
6. **Ajouter feedback validation formulaire** — UX
7. **Implémenter focus trap menu mobile** — Accessibilité clavier
8. **Minifier JS custom** — Performance
9. **Ajouter illustrations/graphiques** — Design

### 🟡 SOUHAITABLE (Améliorations)
10. **Améliorer grad opacity hero** — Visibilité image
11. **Standardiser styles boutons** — Consistance design
12. **Ajouter shadows sur cartes** — Depth visuel
13. **Créer page accessibilité** — Conformité RGAA

---

## 🎯 RECOMMANDATIONS PRINCIPALES

### Design
✓ **Très bon**: Identité visuelle, typography, responsive
→ **À améliorer**: Variété visuelle, styles forme, feedback
→ **Priorité**: Filtres portfolio, menus font-size mobile

### Performance
✓ **Très bon**: Assets optimisés, Tailwind, déferred scripts
→ **À améliorer**: Images srcset, form validation, JS minification
→ **Priorité**: Vérifier Core Web Vitals en production

### Accessibilité
✓ **Très bon**: Sémantique, keyboard nav, alt text, contrast
→ **À améliorer**: prefers-reduced-motion, aria-live, focus trap
→ **Priorité**: Ajouter support motion + aria-live

---

## 🔧 Checklist d'Action

- [ ] Ajouter `@media (prefers-reduced-motion: reduce)` dans CSS
- [ ] Ajouter `aria-live="polite"` au form feedback
- [ ] Implémenter filtres portfolio fonctionnels (JavaScript)
- [ ] Vérifier et ajouter focus rings visibles
- [ ] Créer srcset pour images portfolio
- [ ] Minifier main.js, animations.js, contact.js
- [ ] Ajouter drop shadows aux cartes
- [ ] Tester sur écrans < 375px (iPhone SE, Galaxy Z Fold)
- [ ] Vérifier contraste text-snow/70 (navigation)
- [ ] Implémenter focus trap menu mobile
- [ ] Créer page "Accessibilité"
- [ ] Lancer Lighthouse audit en production

---

**Note**: Ce site a une excellente base! Les améliorations sont surtout des refinements dans les trois domaines, pas des problèmes critiques.
