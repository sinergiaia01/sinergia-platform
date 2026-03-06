const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const analyzeLead = async (contactData) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ GEMINI_API_KEY no configurada. Saltando análisis de IA.");
            return { score: "N/A", priority: "MEDIUM", analysis: "API Key no configurada" };
        }

        console.log(`🤖 Iniciando análisis con IA para: ${contactData.email}...`);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
      Actúa como un experto en ventas B2B para una empresa de IA y Automatización llamada SINERGIA.
      Analiza el siguiente prospecto (lead) y califícalo.
      
      Datos del prospecto:
      Nombre: ${contactData.name}
      Email: ${contactData.email}
      Mensaje: ${contactData.message}

      Responde ÚNICAMENTE en formato JSON con la siguiente estructura:
      {
        "score": (un número del 1 al 100),
        "priority": ("HIGH", "MEDIUM", "LOW"),
        "analysis": "(una breve explicación de 1 frase sobre por qué esta calificación)",
        "suggestedAction": "(qué debería hacer el vendedor primero)"
      }
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Intentar parsear el JSON de la respuesta
        try {
            return JSON.parse(text.replace(/```json|```/g, ""));
        } catch (e) {
            console.error("Error parseando respuesta de IA:", text);
            return { score: 50, priority: "MEDIUM", analysis: "Error al procesar análisis detallado", suggestedAction: "Revisar manualmente" };
        }
    } catch (error) {
        console.error("❌ Error en servicio de IA:", error.message);
        if (error.response) console.error("Detalles:", error.response.status, error.response.statusText);
        return { score: 0, priority: "LOW", analysis: "Error de conexión con la IA", suggestedAction: "Verificar API Key" };
    }
};

module.exports = { analyzeLead };
