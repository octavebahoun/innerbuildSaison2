(()=>{var y=(n,a)=>()=>(a||n((a={exports:{}}).exports,a),a.exports);var k=y(()=>{(function(){if(window.__synnovaChatbotInitialized)return;window.__synnovaChatbotInitialized=!0;let n=[],a=10;function b(){let o=document.createElement("div");o.id="synnova-chatbot-root",o.setAttribute("aria-label","Assistant Virtuel de Synnova"),o.innerHTML=`
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
              <h3 id="chatbot-header-title" class="font-display font-semibold text-snow text-xs tracking-wide">Lumi\xE8re</h3>
              <p class="text-[0.55rem] text-snow/40 flex items-center gap-1.5 font-body">
                <span class="w-1.5 h-1.5 rounded-full bg-green-eco animate-pulse inline-block"></span>
                Assistant de Synnova
              </p>
            </div>
          </div>
          <button id="chatbot-close" class="text-snow/40 hover:text-snow transition-colors p-1 cursor-pointer focus:outline-none" aria-label="Fermer la fen\xEAtre de chat">
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
              Bonjour ! Je suis Lumi\xE8re, l'assistant virtuel de Synnova TOCLOE. Comment puis-je vous aider aujourd'hui \xE0 en conna\xEEtre davantage sur sa carri\xE8re, ses univers d'animation ou ses initiatives \xE9co-responsables ?
            </div>
          </div>
        </div>

        <!-- Input Field Form -->
        <form id="chatbot-form" class="p-3 border-t border-snow/5 bg-snow/[0.01] flex items-center gap-2">
          <input type="text" 
                 id="chatbot-input" 
                 placeholder="\xC9crivez votre message..." 
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
    `,document.body.appendChild(o);let s=document.createElement("style");s.innerHTML=`
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
    `,document.head.appendChild(s)}function p(){let o=document.getElementById("chatbot-trigger"),s=document.getElementById("chatbot-window"),h=document.getElementById("chatbot-close"),g=document.getElementById("chatbot-form"),l=document.getElementById("chatbot-input"),i=document.getElementById("chatbot-messages");if(!o||!s||!h||!g||!l||!i)return;function c(e){e?(s.classList.remove("translate-y-4","opacity-0","pointer-events-none","scale-95"),s.classList.add("translate-y-0","opacity-100","pointer-events-auto","scale-100"),o.setAttribute("aria-expanded","true"),setTimeout(()=>l.focus(),150)):(s.classList.add("translate-y-4","opacity-0","pointer-events-none","scale-95"),s.classList.remove("translate-y-0","opacity-100","pointer-events-auto","scale-100"),o.setAttribute("aria-expanded","false"))}o.addEventListener("click",()=>{let e=o.getAttribute("aria-expanded")==="true";c(!e)}),h.addEventListener("click",e=>{e.stopPropagation(),c(!1)}),document.addEventListener("click",e=>{!s.contains(e.target)&&!o.contains(e.target)&&c(!1)}),g.addEventListener("submit",async e=>{e.preventDefault();let t=l.value.trim();if(!t)return;u("user",t),l.value="",n.push({role:"user",content:t}),n.length>a&&n.shift();let r=x();try{let d=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:n})});if(f(r),!d.ok)throw new Error("API request failed");let w=(await d.json()).reply||"D\xE9sol\xE9, je n'ai pas pu formuler de r\xE9ponse pour le moment.";u("bot",w),n.push({role:"assistant",content:w}),n.length>a&&n.shift()}catch(d){console.error("Error fetching chat response:",d),f(r),u("bot","D\xE9sol\xE9, je rencontre une petite difficult\xE9 technique de connexion. Veuillez r\xE9essayer ou contacter Synnova via sa bo\xEEte email officielle.")}});function u(e,t){let r=document.createElement("div");r.classList.add("flex","items-start","gap-2.5","gsap-reveal"),e==="user"?(r.classList.add("justify-end"),r.innerHTML=`
          <div class="max-w-[78%] rounded-2xl px-3.5 py-2.5 bg-rose text-snow text-xs leading-relaxed font-light shadow-lg">
            ${v(t)}
          </div>
        `):r.innerHTML=`
          <div class="w-6 h-6 rounded-full border border-rose/20 overflow-hidden bg-dark shrink-0">
            <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
          </div>
          <div class="max-w-[78%] rounded-2xl px-3.5 py-2.5 bg-snow/[0.02] border border-snow/5 text-xs text-snow/85 leading-relaxed">
            ${v(t).replace(/\n/g,"<br />")}
          </div>
        `,i.appendChild(r),m()}function x(){let e="typing-"+Date.now(),t=document.createElement("div");return t.id=e,t.classList.add("flex","items-start","gap-2.5"),t.innerHTML=`
        <div class="w-6 h-6 rounded-full border border-rose/20 overflow-hidden bg-dark shrink-0">
          <img src="assets/images/synnova-portrait-light.webp" alt="" aria-hidden="true" class="w-full h-full object-cover" />
        </div>
        <div class="max-w-[78%] rounded-2xl px-4 py-3 bg-snow/[0.02] border border-snow/5 text-xs text-snow/50 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0.15s"></span>
          <span class="w-1.5 h-1.5 rounded-full bg-snow/35 animate-bounce" style="animation-delay: 0.3s"></span>
        </div>
      `,i.appendChild(t),m(),e}function f(e){let t=document.getElementById(e);t&&t.remove()}function m(){i.scrollTop=i.scrollHeight}function v(e){return e.replace(/[&<>'"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"})[t]||t)}}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{b(),p()}):(b(),p())})()});k();})();
