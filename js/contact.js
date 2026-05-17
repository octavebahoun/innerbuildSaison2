'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('form-feedback');
  const sujetSelect = document.getElementById('sujet');
  const bookingFields = document.getElementById('booking-fields');

  if (!form || !feedback) return;

  /* ─── 1. INITIALISATION DE FLATPICKR ─── */
  if (typeof flatpickr !== 'undefined' && document.getElementById('date_event')) {
    flatpickr('#date_event', {
      dateFormat: "d/m/Y",
      minDate: "today",
      disableMobile: "true", // Permet d'avoir le calendrier custom ultra-premium sur mobile aussi
      locale: {
        firstDayOfWeek: 1,
        weekdays: {
          shorthand: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
          longhand: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
        },
        months: {
          shorthand: ["janv", "févr", "mars", "avril", "mai", "juin", "juil", "août", "sept", "oct", "nov", "déc"],
          longhand: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]
        }
      }
    });
  }

  /* ─── 2. DIVULGATION PROGRESSIVE DES CHAMPS DE RÉSERVATION ─── */
  if (sujetSelect && bookingFields) {
    sujetSelect.addEventListener('change', () => {
      if (sujetSelect.value === 'animation') {
        bookingFields.classList.remove('hidden');
        bookingFields.classList.add('block');
        // Rendre les champs de réservation obligatoires s'ils sont visibles
        document.getElementById('date_event').setAttribute('required', 'true');
        document.getElementById('lieu_event').setAttribute('required', 'true');
        document.getElementById('type_event').setAttribute('required', 'true');
      } else {
        bookingFields.classList.add('hidden');
        bookingFields.classList.remove('block');
        // Enlever l'obligation si masqué
        document.getElementById('date_event').removeAttribute('required');
        document.getElementById('lieu_event').removeAttribute('required');
        document.getElementById('type_event').removeAttribute('required');
      }
    });
  }

  // 3. Pré-remplissage du sujet depuis les paramètres URL (Ex: ?sujet=animation)
  const urlParams = new URLSearchParams(window.location.search);
  const sujetParam = urlParams.get('sujet');
  if (sujetParam && sujetSelect) {
    sujetSelect.value = sujetParam;
    // Déclencher artificiellement l'événement pour afficher les champs si nécessaire
    sujetSelect.dispatchEvent(new Event('change'));
  }

  /* ─── 4. VALIDATION INLINE EN TEMPS RÉEL (Ergonomie premium) ─── */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateInput(input, validationFn, errorMessage) {
    if (!input) return true;
    const errorId = input.id + '-error';
    let errorEl = document.getElementById(errorId);

    const isValid = validationFn(input.value.trim());

    if (!isValid) {
      input.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      input.classList.remove('border-snow/10', 'focus:border-rose', 'focus:ring-rose');
      
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.id = errorId;
        errorEl.className = 'text-xs text-red-500 mt-2 block';
        input.parentNode.appendChild(errorEl);
      }
      errorEl.textContent = errorMessage;
      return false;
    } else {
      input.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      input.classList.add('border-snow/10', 'focus:border-rose', 'focus:ring-rose');
      if (errorEl) {
        errorEl.remove();
      }
      return true;
    }
  }

  // Configuration des écouteurs de flou (blur)
  const fieldsConfig = {
    'prenom': {
      fn: (val) => val.length >= 2,
      msg: '✗ Veuillez saisir votre prénom & nom (min. 2 caractères).'
    },
    'email': {
      fn: (val) => emailRegex.test(val),
      msg: '✗ Veuillez saisir une adresse email valide.'
    },
    'sujet': {
      fn: (val) => val !== '',
      msg: '✗ Veuillez sélectionner le type de demande.'
    },
    'message': {
      fn: (val) => val.length >= 10,
      msg: '✗ Votre message doit faire au moins 10 caractères.'
    },
    'date_event': {
      fn: (val) => {
        if (sujetSelect.value !== 'animation') return true;
        return val !== '';
      },
      msg: '✗ Veuillez sélectionner la date de votre événement.'
    },
    'lieu_event': {
      fn: (val) => {
        if (sujetSelect.value !== 'animation') return true;
        return val.length >= 3;
      },
      msg: '✗ Veuillez préciser le lieu de l\'événement (min. 3 caractères).'
    },
    'type_event': {
      fn: (val) => {
        if (sujetSelect.value !== 'animation') return true;
        return val !== '';
      },
      msg: '✗ Veuillez sélectionner le format d\'événement.'
    }
  };

  // Brancher les validations sur l'événement blur de chaque champ
  Object.keys(fieldsConfig).forEach(fieldId => {
    const input = document.getElementById(fieldId);
    if (input) {
      input.addEventListener('blur', () => {
        validateInput(input, fieldsConfig[fieldId].fn, fieldsConfig[fieldId].msg);
      });
      // Effacer l'erreur en direct lors de la frappe
      input.addEventListener('input', () => {
        if (input.classList.contains('border-red-500')) {
          validateInput(input, fieldsConfig[fieldId].fn, fieldsConfig[fieldId].msg);
        }
      });
    }
  });


  /* ─── 5. SOUMISSION FINALE DU FORMULAIRE ─── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Lancer une validation globale de tous les champs
    let isFormValid = true;
    Object.keys(fieldsConfig).forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (input && (input.hasAttribute('required') || sujetSelect.value === 'animation' || ['prenom', 'email', 'sujet', 'message'].includes(fieldId))) {
        const isValid = validateInput(input, fieldsConfig[fieldId].fn, fieldsConfig[fieldId].msg);
        if (!isValid) isFormValid = false;
      }
    });

    if (!isFormValid) {
      showFeedback('✗ Le formulaire contient des erreurs. Veuillez les corriger.', 'error');
      return;
    }

    // Récupérer les valeurs finales pour l'envoi
    const dataToSend = {
      prenom: document.getElementById('prenom').value.trim(),
      email: document.getElementById('email').value.trim(),
      sujet: sujetSelect.value,
      message: document.getElementById('message').value.trim(),
      _captcha: false
    };

    // Rajouter les valeurs événementielles si sujet = animation
    if (sujetSelect.value === 'animation') {
      dataToSend.date_evenement = document.getElementById('date_event').value;
      dataToSend.lieu_evenement = document.getElementById('lieu_event').value;
      dataToSend.format_evenement = document.getElementById('type_event').value;
    }

    // Envoi Fetch Formspree
    try {
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
      submitBtn.classList.add('opacity-50', 'cursor-not-allowed');

      const response = await fetch('https://formspree.io/f/mnjwwwkn', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        showFeedback('✓ Demande envoyée avec succès! Je reviens vers vous rapidement.', 'success');
        form.reset();
        
        // Cacher à nouveau les champs événementiels
        if (bookingFields) {
          bookingFields.classList.add('hidden');
          bookingFields.classList.remove('block');
        }

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer le message';
          submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }, 3000);
      } else {
        throw new Error(`Serveur HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showFeedback('✗ Erreur de réseau ou serveur. Veuillez réessayer.', 'error');

      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Envoyer le message';
      submitBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
  });

  /* ─── 6. AFFICHER FEEDBACK GLOBAL EN BAS ─── */
  function showFeedback(message, type = 'info') {
    feedback.classList.remove('text-red-500', 'text-green-500', 'text-snow/70');
    
    if (type === 'error') {
      feedback.classList.add('text-red-500');
    } else if (type === 'success') {
      feedback.classList.add('text-green-500');
    } else {
      feedback.classList.add('text-snow/70');
    }

    feedback.classList.remove('hidden');
    feedback.textContent = message;

    if (type === 'success') {
      setTimeout(() => {
        feedback.classList.add('hidden');
      }, 6000);
    }
  }
});
