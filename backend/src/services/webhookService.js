const axios = require('axios');

const sendToN8n = async (data) => {
    // Redirigido directo a Telegram para evitar n8n
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '8460989469:AAHxrfPtwG4Hi3ry4FWvRGsk8bDhybtNoEs';
    const chatId = process.env.TELEGRAM_CHAT_ID || '8074437146';

    // Detectar prioridad
    const isHigh = data.ai_priority === 'HIGH' || data.ai_priority === 'ALTA';
    const emoji = isHigh ? '🚨 *URGENTE: PRIORIDAD ALTA*' : '📩 *Nuevo Lead Recibido*';

    const message = `${emoji}

👤 *Nombre:* ${data.name || 'Desconocido'}
📧 *Email:* ${data.email || 'Sin Email'}
💬 *Mensaje:* ${data.message || 'Sin Mensaje'}

--- 🤖 ANÁLISIS QWEN ---
${data.ai_analysis || 'Análisis no disponible.'}`;

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    try {
        const response = await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });
        console.log('✅ Mensaje enviado directo a Telegram con éxito:', response.status);
        return true;
    } catch (error) {
        console.error('❌ Error enviando directo a Telegram:', error.response ? error.response.data : error.message);
        return false;
    }
};

module.exports = { sendToN8n };
