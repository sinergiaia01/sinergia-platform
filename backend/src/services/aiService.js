const axios = require("axios");

const analyzeLead = async (contactData) => {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) {
            console.warn("⚠️ OPENROUTER_API_KEY no configurada. Saltando análisis de IA.");
            return { score: 0, priority: "MEDIUM", analysis: "API Key no configurada" };
        }

        console.log(`🤖 Iniciando análisis con Qwen (OpenRouter) para: ${contactData.email}...`);

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

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "qwen/qwen-2.5-72b-instruct",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://sinergia.sbs",
                    "X-Title": "Sinergia Platform",
                    "Content-Type": "application/json"
                }
            }
        );

        const text = response.data.choices[0].message.content;

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error("Error parseando respuesta de IA:", text);
            return {
                score: 50,
                priority: "MEDIUM",
                analysis: "Error al procesar análisis detallado",
                suggestedAction: "Revisar manualmente"
            };
        }
    } catch (error) {
        console.error("❌ Error en servicio de IA (OpenRouter):", error.message);
        if (error.response) {
            console.error("Detalles Error:", error.response.status, error.response.data);
        }
        return {
            score: 0,
            priority: "LOW",
            analysis: "Error de conexión con la IA",
            suggestedAction: "Verificar API Key de OpenRouter"
        };
    }
};

module.exports = { analyzeLead };
