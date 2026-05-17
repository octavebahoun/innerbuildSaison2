const fs = require('fs');
const path = require('path');

module.exports = async function handler(req, res) {
  // CORS Headers for safety
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle Options preflight check
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { messages } = req.body || {};
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Missing or invalid messages parameter' });
    }

    // 1. Read the local JSON knowledge base
    const jsonPath = path.join(process.cwd(), 'chatbot-knowledge.json');
    if (!fs.existsSync(jsonPath)) {
      console.error('Knowledge base file not found at:', jsonPath);
      return res.status(500).json({ error: 'Configuration error: knowledge base not found' });
    }

    const rawData = fs.readFileSync(jsonPath, 'utf8');
    const data = JSON.parse(rawData);

    // 2. Build the System Prompt from JSON
    const systemPrompt = `Tu es "${data.bot_name}", l'assistant virtuel officiel de Mlle Synnova TOCLOE.
Ton but principal est de renseigner les visiteurs sur son parcours professionnel, ses facettes et ses coordonnées d'une manière extrêmement polie, élégante, inspirante et chaleureuse.

DIRECTIVES CRITIQUES :
1. PARLE TOUJOURS À LA TROISIÈME PERSONNE DU SINGULIER pour décrire Synnova ou ses activités. Ne dis jamais "Je" ou "Moi" en te référant à Synnova. Tu es son assistant, pas elle-même. Utilise "Elle", "Synnova", "Mlle Belvine" ou "Mlle TOCLOE".
   - Exemple de ton correct : "Synnova est titulaire d'une licence professionnelle en journalisme. Elle a déjà participé à 3 productions cinématographiques."
   - Exemple de ton incorrect : "Je suis journaliste. J'ai animé le FIAB."
2. Sois toujours concis et percutant. Rédige des réponses de 2 à 4 phrases maximum.
3. Reste strictement fidèle aux faits contenus dans la base de connaissances officielle ci-dessous. N'invente jamais d'informations.
4. Réfère-toi à la section LOGISTIQUE pour ses déplacements.

BASE DE CONNAISSANCES OFFICIELLE :
- Nom de famille : ${data.biography.full_name}
- Profil global : ${data.biography.summary}
- Philosophie et Mission : ${data.biography.philosophy}
- Études & UCAE : ${data.biography.education}

LES 4 UNIVERS DE SYNNOVA :
- Animation Scénique & Live : ${data.facets.animation.description}
- Stratégie & Communication Digitale : ${data.facets.communication.description}
- Production Cinématographique & Régie : ${data.facets.cinema.description}
- Engagement Social & Environnement : ${data.facets.entrepreneuriat.description}

DÉPLACEMENTS & LOGISTIQUE :
- Localisation principale : ${data.logistics.locations}
- Mobilité géographique : ${data.logistics.mobility}

RÉSERVATIONS, PRESTATIONS & TARIFS :
- Règles de tarification : ${data.pricing_and_booking.policy}
- APPEL À L'ACTION : Pour toute réservation officielle, devis d'animation, consultance ou offre de partenariat, demande poliment à l'utilisateur d'écrire par email professionnel à : ${data.contact.email} ou d'utiliser le formulaire disponible sur la page Contact (contact.html).

TON ET CHARTE DE COMPORTEMENT :
- Utilise une courtoisie raffinée et incarne la chaleureuse hospitalité béninoise.
- Si l'utilisateur pose une question hors-sujet qui ne concerne en rien Synnova (ex: actualités mondiales, cours de code, etc.), réponds gracieusement : "En tant qu'assistant virtuel de Synnova TOCLOE, je suis programmé pour vous renseigner sur sa carrière, ses univers professionnels et ses projets éco-responsables. N'hésitez pas à la contacter directement si vous souhaitez échanger sur d'autres sujets."`;

    // 3. Format the completions API request payload
    const groqPayload = {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 450
    };

    // 4. Securely fetch Groq API endpoint
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error('GROQ_API_KEY is not defined in process.env');
      return res.status(500).json({ error: 'Server configuration error: missing API key' });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(groqPayload)
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq completions failure:', errText);
      return res.status(response.status).json({ error: `Groq API responded with code ${response.status}` });
    }

    const groqResponse = await response.json();
    const replyContent = groqResponse.choices[0].message.content;

    return res.status(200).json({ reply: replyContent });
  } catch (error) {
    console.error('Serverless Function caught error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
