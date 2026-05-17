(function () {
  // Prevent double loading
  if (window.__synnovaChatbotInitialized) return;
  window.__synnovaChatbotInitialized = true;

  // Conversational history state in local memory
  const chatHistory = [];
  const MAX_HISTORY = 10; // Maintain context of last 10 messages

  // ── 1. Create and Inject Chat Widget Styles and DOM elements ──
  function injectChatbot() {
    // Inject custom widget structures
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'synnova-chatbot-root';
    widgetContainer.setAttribute('aria-label', 'Assistant Virtuel de Synnova');
    widgetContainer.innerHTML = `
      <!-- Trigger Button -->
      <button id="chatbot-trigger" 
              class="fixed bottom-6 right-6 z-[999] w-14 h-14 rounded-full bg-dark/80 backdrop-blur-md border border-rose/30 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:border-gold/50 shadow-[0_4px_20px_rgba(194,24,91,0.2)] focus:outline-none focus:ring-2 focus:ring-rose"
              aria-expanded="false" 
              aria-controls="chatbot-window"
              aria-label="Ouvrir l'assistant virtuel">
        <!-- Floating pulse effect -->
        <span class="absolute inset-0 rounded-full border border-rose/40 animate-ping opacity-25" aria-hidden="true"></span>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="text-snow">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      <!-- Conversation Window -->
      <div id="chatbot-window" 
           class="fixed bottom-24 right-6 w-[350px] max-w-[calc(100vw-32px)] h-[480px] z-[999] rounded-2xl bg-dark/85 backdrop-blur-xl border border-snow/10 shadow-2xl flex flex-col overflow-hidden translate-y-4 opacity-0 pointer-events-none scale-95 transition-all duration-300 origin-bottom-right"
           role="dialog" 
           aria-modal="false" 
           aria-labelledby="chatbot-header-title">
        
        <!-- Header -->
        <header class="px-5 py-4 border-b border-snow/5 flex items-center justify-between bg-snow/[0.015]">
          <div class="flex items-center gap-3">
            <div class="relative w-8 h-8 rounded-full border border-rose/30 overflow-hidden bg-dark">
              <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 id="chatbot-header-title" class="font-display font-semibold text-snow text-xs tracking-wide">Lumière</h3>
              <p class="text-[0.55rem] text-snow/40 flex items-center gap-1.5 font-body">
                <span class="w-1.5 h-1.5 rounded-full bg-green-eco animate-pulse inline-block"></span>
                Assistant de Synnova
              </p>
            </div>
          </div>
          <button id="chatbot-close" class="text-snow/40 hover:text-snow transition-colors p-1 cursor-pointer focus:outline-none" aria-label="Fermer la fenêtre de chat">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </header>

        <!-- Message Body -->
        <div id="chatbot-messages" class="flex-1 p-4 overflow-y-auto space-y-4 font-body scrollbar-thin">
          <!-- Initial Welcome Message -->
          <div class="flex items-start gap-2.5">
            <div class="w-6 h-6 rounded-full border border-rose/20 overflow-hidden bg-dark shrink-0">
              <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
            </div>
            <div class="max-w-[78%] rounded-2xl px-3.5 py-2.5 bg-snow/[0.02] border border-snow/5 text-xs text-snow/80 leading-relaxed">
              Bonjour ! Je suis Lumière, l'assistant virtuel de Synnova TOCLOE. Comment puis-je vous aider aujourd'hui à en connaître davantage sur sa carrière, ses univers d'animation ou ses initiatives éco-responsables ?
            </div>
          </div>
        </div>

        <!-- Input Field Form -->
        <form id="chatbot-form" class="p-3 border-t border-snow/5 bg-snow/[0.01] flex items-center gap-2">
          <input type="text" 
                 id="chatbot-input" 
                 placeholder="Écrivez votre message..." 
                 autocomplete="off"
                 class="flex-1 bg-snow/[0.02] border border-snow/10 rounded-full px-4 py-2 text-xs text-snow placeholder-snow/30 focus:outline-none focus:border-rose/50 transition-colors"
                 aria-label="Votre message" />
          <button type="submit" 
                  id="chatbot-send"
                  class="w-8 h-8 rounded-full bg-rose text-snow flex items-center justify-center hover:scale-105 hover:bg-rose/90 transition-all cursor-pointer focus:outline-none"
                  aria-label="Envoyer le message">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>

      </div>
    `;

    document.body.appendChild(widgetContainer);

    // Apply basic Custom Scrollbar variables to chatbot message frame
    const style = document.createElement('style');
    style.innerHTML = `
      .scrollbar-thin::-webkit-scrollbar {
        width: 3px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: rgba(250, 250, 250, 0.1);
        border-radius: 9px;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: var(--rose, #C2185B);
      }
    `;
    document.head.appendChild(style);
  }

  // ── 2. Initialize DOM Elements and Event Listeners ──
  function initChatbotLogic() {
    const trigger = document.getElementById('chatbot-trigger');
    const win = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const messagesContainer = document.getElementById('chatbot-messages');

    if (!trigger || !win || !closeBtn || !form || !input || !messagesContainer) return;

    // Toggle Chatbox
    function toggleChat(isOpen) {
      if (isOpen) {
        win.classList.remove('translate-y-4', 'opacity-0', 'pointer-events-none', 'scale-95');
        win.classList.add('translate-y-0', 'opacity-100', 'pointer-events-auto', 'scale-100');
        trigger.setAttribute('aria-expanded', 'true');
        setTimeout(() => input.focus(), 150);
      } else {
        win.classList.add('translate-y-4', 'opacity-0', 'pointer-events-none', 'scale-95');
        win.classList.remove('translate-y-0', 'opacity-100', 'pointer-events-auto', 'scale-100');
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      toggleChat(!isExpanded);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleChat(false);
    });

    // Close window if clicked outside
    document.addEventListener('click', (e) => {
      if (!win.contains(e.target) && !trigger.contains(e.target)) {
        toggleChat(false);
      }
    });

    // Handle submit message
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const messageText = input.value.trim();
      if (!messageText) return;

      // Add user message bubble
      appendMessageBubble('user', messageText);
      input.value = '';

      // Append user message to historical array
      chatHistory.push({ role: 'user', content: messageText });
      if (chatHistory.length > MAX_HISTORY) {
        chatHistory.shift();
      }

      // Add Typing Indicator bubble
      const typingId = showTypingIndicator();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ messages: chatHistory })
        });

        removeTypingIndicator(typingId);

        if (!response.ok) {
          throw new Error('API request failed');
        }

        const data = await response.json();
        const replyText = data.reply || "Désolé, je n'ai pas pu formuler de réponse pour le moment.";

        // Append bot reply
        appendMessageBubble('bot', replyText);

        // Store bot reply in memory
        chatHistory.push({ role: 'assistant', content: replyText });
        if (chatHistory.length > MAX_HISTORY) {
          chatHistory.shift();
        }

      } catch (error) {
        console.error('Error fetching chat response:', error);
        removeTypingIndicator(typingId);
        appendMessageBubble('bot', "Désolé, je rencontre une petite difficulté technique de connexion. Veuillez réessayer ou contacter Synnova via sa boîte email officielle.");
      }
    });

    // Helper: append message bubble
    function appendMessageBubble(sender, text) {
      const bubble = document.createElement('div');
      bubble.classList.add('flex', 'items-start', 'gap-2.5', 'gsap-reveal');
      
      if (sender === 'user') {
        bubble.classList.add('justify-end');
        bubble.innerHTML = `
          <div class="max-w-[78%] rounded-2xl px-3.5 py-2.5 bg-rose text-snow text-xs leading-relaxed font-light shadow-lg">
            ${escapeHTML(text)}
          </div>
        `;
      } else {
        bubble.innerHTML = `
          <div class="w-6 h-6 rounded-full border border-rose/20 overflow-hidden bg-dark shrink-0">
            <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
          </div>
          <div class="max-w-[78%] rounded-2xl px-3.5 py-2.5 bg-snow/[0.02] border border-snow/5 text-xs text-snow/85 leading-relaxed">
            ${escapeHTML(text).replace(/\n/g, '<br />')}
          </div>
        `;
      }

      messagesContainer.appendChild(bubble);
      scrollToBottom();
    }

    // Helper: Typing Indicator
    function showTypingIndicator() {
      const id = 'typing-' + Date.now();
      const bubble = document.createElement('div');
      bubble.id = id;
      bubble.classList.add('flex', 'items-start', 'gap-2.5');
      bubble.innerHTML = `
        <div class="w-6 h-6 rounded-full border border-rose/20 overflow-hidden bg-dark shrink-0">
          <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
        </div>
        <div class="max-w-[78%] rounded-2xl px-4 py-3 bg-snow/[0.02] border border-snow/5 text-xs text-snow/50 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0.15s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0.3s"></span>
        </div>
      `;
      messagesContainer.appendChild(bubble);
      scrollToBottom();
      return id;
    }

    function removeTypingIndicator(id) {
      const indicator = document.getElementById(id);
      if (indicator) {
        indicator.remove();
      }
    }

    // Helper: auto scroll
    function scrollToBottom() {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Helper: sanitize input
    function escapeHTML(str) {
      return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
      );
    }
  }

  // ── 3. Run injector on load ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      injectChatbot();
      initChatbotLogic();
    });
  } else {
    injectChatbot();
    initChatbotLogic();
  }

})();
