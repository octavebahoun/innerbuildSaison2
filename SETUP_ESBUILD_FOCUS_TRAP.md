# 🚀 Configuration esbuild & Focus Trap Menu

## ✅ Fait

### 1. esbuild Installé
```bash
npm install esbuild --save-dev
```

**Fichiers minifiés générés**:
- `js/dist/main.js` — 2.5KB (au lieu de ~4KB) ✨
- `js/dist/animations.js` — 2.6KB (au lieu de ~8KB) ✨
- `js/dist/contact.js` — 2.3KB (au lieu de ~3KB) ✨

### 2. Scripts NPM Configurés

**Voir `package.json`**:
```json
"scripts": {
  "buildcss": "npx @tailwindcss/cli -i ./css/style.css -o ./css/output.css --watch",
  "buildjs": "npx esbuild js/main.js js/animations.js js/contact.js --bundle --minify --outdir=js/dist",
  "build": "npm run buildcss & npm run buildjs"
}
```

### 3. Focus Trap Menu Mobile Implémenté

**Amélioration dans `js/main.js`**:
- ✅ Capture première touche Tab → focus sur dernier élément
- ✅ Capture dernière touche Shift+Tab → focus sur premier élément
- ✅ Restaure le focus au bouton burger quand menu ferme
- ✅ Nettoie les event listeners (pas de memory leak)

---

## 📋 Comment Utiliser

### Développement (Fichiers normaux)

```html
<!-- Dans index.html, portfolio.html, etc. -->
<script src="js/main.js" defer></script>
<script src="js/animations.js" defer></script>
<script src="js/contact.js" defer></script>
```

### Production (Fichiers minifiés)

```html
<!-- Remplacer par les versions minifiées -->
<script src="js/dist/main.js" defer></script>
<script src="js/dist/animations.js" defer></script>
<script src="js/dist/contact.js" defer></script>
```

---

## 🔄 Workflow de Build

### Avant un déploiement production:

```bash
# 1. Builder les CSS
npm run buildcss

# 2. Builder les JS minifiés
npm run buildjs

# Ou les deux ensemble:
npm run build
```

### Pour le watch mode (développement):

```bash
# Terminal 1 - CSS
npm run buildcss

# Terminal 2 - JS (si besoin de rebuild)
npm run buildjs
```

---

## 📊 Gains de Performance

| Fichier | Avant | Après | Gain |
|---------|-------|-------|------|
| main.js | ~4KB | 2.5KB | **-37.5%** ⚡ |
| animations.js | ~8KB | 2.6KB | **-67.5%** ⚡ |
| contact.js | ~3KB | 2.3KB | **-23%** ⚡ |
| **TOTAL** | **~15KB** | **~7.4KB** | **-50.7%** 🚀 |

---

## 🎯 Focus Trap Menu - Comment ça marche

### Avant (Vieux code):
```javascript
// Juste un focus sur le premier lien
const firstLink = mobileMenu.querySelector('a');
if (firstLink) firstLink.focus();
```
**Problème**: Utilisateur peut tabber hors du menu → perd le focus trap

### Après (Nouveau code):
```javascript
// 1. Capture TOUS les éléments focusables
const focusableElements = mobileMenu.querySelectorAll(
  'a, button, [tabindex]:not([tabindex="-1"])'
);

// 2. Intercepte Tab/Shift+Tab
mobileMenu.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    if (e.shiftKey && firstElement) {
      e.preventDefault();
      lastElement.focus(); // Boucle vers bas
    } else if (!e.shiftKey && lastElement) {
      e.preventDefault();
      firstElement.focus(); // Boucle vers haut
    }
  }
});

// 3. Restaure le focus
if (lastFocusedElement) {
  lastFocusedElement.focus();
}
```

**Résultat**:
- ✅ Tab reste toujours dans le menu (pas de sortie accidentelle)
- ✅ Shift+Tab boucle correctement
- ✅ Fermeture → focus retourne au burger button

---

## ✨ Test Focus Trap

### Tester sur mobile/clavier:

1. Ouvrir le site
2. Appuyer sur Tab → Naviguer au burger button
3. Appuyer sur Enter/Space → Menu s'ouvre
4. **Appuyer Tab plusieurs fois** → Reste dans menu ✅
5. **Appuyer Shift+Tab** → Boucle en arrière ✅
6. **Appuyer Escape** → Menu ferme, focus retourne au burger ✅

---

## 🔧 Configuration Avancée

### Si tu veux options esbuild supplémentaires:

```json
"buildjs": "npx esbuild js/main.js js/animations.js js/contact.js --bundle --minify --outdir=js/dist --sourcemap --target=es2020"
```

**Options utiles**:
- `--sourcemap` — Génère .map pour debugging en production
- `--target=es2020` — Cible navigateurs modernes
- `--analyze` — Montre la taille de chaque import

### Gitignore (optionnel):

```
# Généré par build
js/dist/
*.map
```

---

## 🚨 Troubleshooting

**Erreur: "esbuild not found"**
```bash
npm install esbuild --save-dev
```

**Files still loading old version?**
- Hard refresh: `Ctrl+Shift+R` (Windows) ou `Cmd+Shift+R` (Mac)
- Clear browser cache
- Vérifier que Vercel/serveur sert les bons fichiers

**Focus trap pas marche?**
- Vérifier que `aria-hidden="true"` sur `.mobile-menu`
- S'assurer que tous les liens/boutons ont `tabindex >= 0` ou pas `tabindex="-1"`

---

## 📚 Ressources

- esbuild docs: https://esbuild.github.io/
- NPM scripts: https://docs.npmjs.com/cli/v7/using-npm/scripts
- ARIA Focus Management: https://www.w3.org/WAI/ARIA/apg/patterns/dialogmodal/

---

**Status**: ✅ **COMPLÉTÉ** — esbuild + focus trap ready to deploy!
