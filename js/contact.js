'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('form-feedback');

  if (!form || !feedback) return;

  /* ─── VALIDATION & SUBMIT ─── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Récupérer les valeurs
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const sujet = document.getElementById('sujet').value;
    const message = document.getElementById('message').value.trim();

    // ──── VALIDATION ────
    // Vérifier que tous les champs sont remplis
    if (!prenom || !email || !sujet || !message) {
      showFeedback(
        '✗ Veuillez remplir tous les champs.',
        'error'
      );
      return;
    }

    // Valider format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showFeedback(
        '✗ L\'adresse email n\'est pas valide. Exemple: nom@example.com',
        'error'
      );
      return;
    }

    // Vérifier longueur minimum message
    if (message.length < 10) {
      showFeedback(
        '✗ Votre message doit contenir au moins 10 caractères.',
        'error'
      );
      return;
    }

    // ──── ENVOI ────
    try {
      // Désactiver le bouton pendant l'envoi
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      // Exemple: Envoyer à Formspree (remplacer par votre endpoint)
      const response = await fetch('https://formspree.io/f/mnjwwwkn', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          prenom: prenom,
          email: email,
          sujet: sujet,
          message: message,
          _captcha: false
        })
      });

      if (response.ok) {
        // Succès
        showFeedback(
          '✓ Message envoyé avec succès! Je vous répondrai très bientôt.',
          'success'
        );
        form.reset();
        
        // Réactiver le bouton après 3 secondes
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer le message';
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }, 3000);
      } else {
        throw new Error(`Erreur serveur: ${response.status}`);
      }
    } catch (error) {
      // Erreur d'envoi
      console.error('Erreur:', error);
      showFeedback(
        '✗ Erreur d\'envoi. Vérifiez votre connexion et réessayez.',
        'error'
      );

      // Réactiver le bouton
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer le message';
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });

  /* ─── AFFICHER FEEDBACK ─── */
  function showFeedback(message, type = 'info') {
    // Nettoyer les classes de couleur précédentes
    feedback.classList.remove('text-red-500', 'text-green-500', 'text-snow/70');
    
    // Ajouter les nouvelles classes selon le type
    if (type === 'error') {
      feedback.classList.add('text-red-500');
    } else if (type === 'success') {
      feedback.classList.add('text-green-500');
    } else {
      feedback.classList.add('text-snow/70');
    }

    // Afficher le message
    feedback.classList.remove('hidden');
    feedback.textContent = message;

    // aria-live="polite" annoncera automatiquement le changement au lecteur d'écran
    // aria-atomic="true" annoncera le contenu entier du div

    // Auto-masquer après 5 secondes si succès
    if (type === 'success') {
      setTimeout(() => {
        feedback.classList.add('hidden');
      }, 5000);
    }
  }

  /* ─── VALIDATION EN TEMPS RÉEL (optional) ─── */
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      const email = emailInput.value.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (email && !emailRegex.test(email)) {
        emailInput.classList.add('border-red-500', 'focus:border-red-500');
      } else {
        emailInput.classList.remove('border-red-500', 'focus:border-red-500');
      }
    });
  }
});
