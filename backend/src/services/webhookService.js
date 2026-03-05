const axios = require('axios');

const sendToN8n = async (data) => {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        console.warn("⚠️ N8N_WEBHOOK_URL no configurada. Saltando envío a webhook.");
        return false;
    }

    try {
        const response = await axios.post(webhookUrl, data);
        console.log('✅ Datos enviados a n8n con éxito:', response.status);
        return true;
    } catch (error) {
        console.error('❌ Error enviando a n8n:', error.message);
        return false;
    }
};

module.exports = { sendToN8n };
