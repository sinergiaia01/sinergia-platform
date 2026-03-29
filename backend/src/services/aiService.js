const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const serviceLabels = {
    landing_page: 'Landing Page Comercial',
    social_media_monthly: 'Presencia Digital Mensual',
    digital_launch: 'Lanzamiento Digital'
};

const analyzeLead = async (contactData) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY no configurada. Saltando analisis de IA.');
            return { score: 'N/A', priority: 'MEDIUM', analysis: 'API Key no configurada' };
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
