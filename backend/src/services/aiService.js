const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const serviceLabels = {
    landing_page: 'Landing Page Comercial',
    social_media_monthly: 'Presencia Digital Mensual',
    digital_launch: 'Lanzamiento Digital'
};

const inferPriority = (score) => {
    if (score >= 75) {
        return 'HIGH';
    }
    if (score >= 45) {
        return 'MEDIUM';
    }
    return 'LOW';
};

const buildHeuristicLeadAnalysis = (contactData) => {
    const serviceInterest = contactData.service_interest || 'landing_page';
    const message = String(contactData.message || '').trim();
    const normalizedMessage = message.toLowerCase();
    const factors = [];
    let score = 25;

    if (contactData.email) {
        score += 10;
        factors.push('email disponible');
    }

    if (contactData.phone) {
        score += 10;
        factors.push('telefono disponible');
    }

    if (message.length >= 30) {
        score += 10;
        factors.push('mensaje con contexto');
    }

    if (message.length >= 80) {
        score += 5;
    }

    const serviceWeight = {
        landing_page: 10,
        social_media_monthly: 8,
        digital_launch: 15,
    };

    if (serviceWeight[serviceInterest]) {
        score += serviceWeight[serviceInterest];
        factors.push(`interes en ${serviceLabels[serviceInterest]}`);
    }

    const commercialSignals = [
        'propuesta',
        'presupuesto',
        'clientes',
        'vender',
        'landing',
        'web',
        'redes',
        'lanzamiento',
        'consulta',
        'urgente'
    ];

    const matchedSignals = commercialSignals.filter((signal) => normalizedMessage.includes(signal));
    score += Math.min(matchedSignals.length * 5, 20);

    if (matchedSignals.length) {
        factors.push(`senales comerciales: ${matchedSignals.join(', ')}`);
    }

    score = Math.max(0, Math.min(100, score));
    const priority = inferPriority(score);

    let suggestedAction = 'pedir un poco mas de contexto antes de cotizar.';
    if (priority === 'HIGH') {
        suggestedAction = 'responder con propuesta inicial o agendar discovery corto.';
    } else if (priority === 'MEDIUM') {
        suggestedAction = 'responder con discovery breve y confirmar alcance.';
    }

    return {
        score,
        priority,
        analysis: factors.length
            ? `Lead calificado por heuristica inicial: ${factors.join('; ')}.`
            : 'Lead calificado por heuristica inicial con poca informacion.',
        suggestedAction
    };
};

const analyzeLead = async (contactData) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY no configurada. Saltando analisis de IA.');
            return buildHeuristicLeadAnalysis(contactData);
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const serviceInterest = serviceLabels[contactData.service_interest] || 'Sin definir';

        const prompt = `
      Actua como un analista comercial para SINERGIA, un servicio orientado a paginas web y presencia digital.
      Analiza el siguiente lead y calificalo segun su claridad comercial y probabilidad de avance.

      Datos del lead:
      Nombre: ${contactData.name}
      Email: ${contactData.email}
      Telefono: ${contactData.phone}
      Servicio de interes: ${serviceInterest}
      Mensaje: ${contactData.message || 'Sin mensaje'}

      Responde unicamente en formato JSON con esta estructura:
      {
        "score": 1-100,
        "priority": "HIGH|MEDIUM|LOW",
        "analysis": "una frase breve",
        "suggestedAction": "primer paso comercial recomendado"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            return JSON.parse(text.replace(/```json|```/g, ''));
        } catch (error) {
            console.error('Error parseando respuesta de IA:', text);
            return {
                score: 50,
                priority: 'MEDIUM',
                analysis: 'Error al procesar el analisis detallado',
                suggestedAction: 'Revisar manualmente el lead'
            };
        }
    } catch (error) {
        console.error('Error en servicio de IA:', error);
        return {
            score: 0,
            priority: 'LOW',
            analysis: 'Error tecnico en el analisis',
            suggestedAction: 'Revisar manualmente'
        };
    }
};

module.exports = { analyzeLead };
