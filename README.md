# Synnova TOCLOE — Portfolio & Personal Brand

Un site vitrine premium et interactif pour **Synnova Belvine Kybarance TOCLOE**, animatrice d'événements, communicatrice digitale, actrice et entrepreneuse sociale basée au Bénin.

🌍 **Live Demo:** [synnovatocloe.vercel.app](https://synnovatocloe.vercel.app/)

---

## 🎯 Fonctionnalités Clés

*   **Design Premium & Immersif** : Esthétique soignée avec une charte graphique élégante (Dark mode, accents Rose, Or, Indigo et Vert).
*   **Animations Fluides (GSAP & Anime.js)** : 
    *   Preloader personnalisé (animation SVG "Bloom" d'une rose à la première visite).
    *   Transitions de page douces (overlay cinématique).
    *   Apparition des éléments au scroll (`ScrollTrigger`).
    *   Filtrage du portfolio dynamique.
*   **Performance Exceptionnelle** : Code léger, JS minifié avec ESBuild, et CSS compilé avec Tailwind v4.
*   **Responsive Design & Mobile-First** : Adaptabilité parfaite sur tous les écrans (utilisation de `dvh` pour mobile, typographie fluide `clamp()`).
*   **Accessibilité (A11y)** : Conforme aux directives WCAG 2.2 (Focus visible, Contrastes, Mode *prefers-reduced-motion*, aria-labels, touch targets > 24px).
*   **SEO Optimisé** : Balises Open Graph & Twitter Cards, Canonical URLs, Sitemap, fichier Robots.txt et données structurées JSON-LD intégrés.

---

## 🛠 Stack Technique

*   **HTML5** Sémantique
*   **Tailwind CSS (v4.3.0)** - Utilitaire de design et gestion responsive.
*   **GSAP (GreenSock)** & **ScrollTrigger** - Animations interactives complexes et scroll synchronisé.
*   **Anime.js** - Animation des compteurs numériques (page d'accueil).
*   **ESBuild** - Bundler ultra-rapide pour minimiser et regrouper les scripts JS.
*   **Vercel** - Hébergement, avec règles strictes de cache et sécurité (`vercel.json`).

---

## 📁 Architecture du Projet

```text
.
├── accessibilite.html     # Déclaration d'accessibilité RGAA
├── a-propos.html          # Page biographie et parcours
├── contact.html           # Page de contact avec formulaire
├── index.html             # Page d'accueil avec preloader
├── portfolio.html         # Galerie filtrable des réalisations
├── univers.html           # Présentation des 4 piliers d'expertise (Scroll-snap)
├── 404.html               # Page d'erreur personnalisée
├── css/
│   ├── style.css          # Fichier CSS source (variables, keyframes, a11y)
│   └── output.css         # CSS compilé par Tailwind (ne pas modifier)
├── js/
│   ├── main.js            # Logique globale (Navigation, Preloader, Transitions)
│   ├── animations.js      # Scripts GSAP & Anime.js
│   ├── contact.js         # Validation du formulaire de contact
│   └── dist/              # Scripts compilés par ESBuild
├── assets/
│   ├── images/            # Photos webp optimisées
│   └── icons/             # Logos et SVG (dont le rose-loader.svg)
├── tailwind.config.js     # Configuration des couleurs et typographies
├── vercel.json            # Configuration Vercel (Cache, Headers de sécurité, Redirections)
├── package.json           # Dépendances (Tailwind, ESBuild) et scripts npm
├── sitemap.xml            # Sitemap SEO
└── robots.txt             # Directives pour les moteurs de recherche
```

---

## 🚀 Installation & Développement local

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine.

1. **Cloner le projet ou ouvrir le dossier :**
   ```bash
   git clone <votre-repo>
   cd synnova
   ```

2. **Installer les dépendances :**
   ```bash
   npm install
   ```

3. **Lancer le compilateur Tailwind (Mode Watch) :**
   ```bash
   npm run buildcss
   ```

4. **Compiler le JavaScript (ESBuild) :**
   ```bash
   npm run buildjs
   ```

5. **Développement (Serveur local) :**
   Vous pouvez utiliser l'extension Live Server (VS Code) ou tout autre serveur HTTP simple (`npx serve .`) pour visualiser le site.

---

## 🔒 Déploiement

Ce projet est configuré pour un déploiement continu sur **Vercel**.
Le fichier `vercel.json` gère :
*   Le routage vers les pages HTML propres.
*   Les entêtes de sécurité HTTP (HSTS, X-Content-Type-Options, etc.).
*   La stratégie de mise en cache ultra agressive pour les ressources statiques (`/assets`).

---

**Développé avec soin pour Synnova lors d'innerbuild saison 2.** 🌹
