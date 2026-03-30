const axios = require('axios');

const productLabels = {
    landing_page: 'Landing Page Comercial',
    social_media_monthly: 'Presencia Digital Mensual',
    digital_launch: 'Lanzamiento Digital'
};

const mapLeadPriorityToBartolinaPriority = (leadPriority) => {
    if (leadPriority === 'HIGH') {
        return 'high';
    }
    if (leadPriority === 'LOW') {
        return 'low';
    }
    return 'normal';
};

const buildSinergiaPayload = (contactData, leadAnalysis = null) => {
    const productType = contactData.service_interest || 'landing_page';
    const productLabel = productLabels[productType] || 'Servicio Sinergia';
    const clientName = (contactData.name || '').trim();
    const descriptionParts = [
        `Lead recibido desde la landing de Sinergia para ${productLabel}.`,
        `Contacto: ${contactData.name} | ${contactData.email} | ${contactData.phone}.`,
    ];

    if (contactData.message) {
        descriptionParts.push(`Mensaje: ${contactData.message.trim()}`);
    }

    if (leadAnalysis?.analysis) {
        descriptionParts.push(`Calificacion inicial: ${leadAnalysis.analysis}`);
    }

    return {
        title: `${productLabel} - ${clientName}`,
        description: descriptionParts.join(' '),
        channel: 'landing_web',
        operator: process.env.BARTOLINA_LANDING_OPERATOR || 'sinergia_web',
        segment_hint: 'b2b',
        requested_agent: 'sinergia_ops',
        priority: mapLeadPriorityToBartolinaPriority(leadAnalysis?.priority),
        client_name: clientName,
        sector: null,
        contact_name: contactData.name,
        contact_email: contactData.email,
        contact_phone: contactData.phone,
        source: contactData.source || 'landing_sinergia_web',
        budget_range: null,
        product_type: productType,
        context: {
            source: 'sinergia_landing_form',
            landing_channel: 'sinergia.sbs',
            service_interest: productType,
            lead_score: leadAnalysis?.score ?? null,
            lead_priority: leadAnalysis?.priority ?? null,
            lead_analysis: leadAnalysis?.analysis ?? null,
            suggested_action: leadAnalysis?.suggestedAction ?? null,
            lead_origin: contactData.source || 'landing_sinergia_web'
        }
    };
};

const syncLeadToBartolina = async (contactData, leadAnalysis = null) => {
    const webhookUrl = process.env.SINERGIA_OPS_WEBHOOK_URL
        || 'https://n8n.partidosomosjujuy.cloud/webhook/sinergia-ops-intake';

    if (!webhookUrl) {
        return { synced: false, reason: 'not_configured' };
    }

    try {
        const payload = buildSinergiaPayload(contactData, leadAnalysis);
        const response = await axios.post(webhookUrl, payload, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 15000
        });

        return {
            synced: true,
            taskId: response.data?.task?.id || null,
            opportunityCode: response.data?.opportunity_code || null,
            via: 'n8n_webhook'
        };
    } catch (error) {
        console.error('Error sincronizando lead con Sinergia Ops via n8n:', error.message);
        return {
            synced: false,
            reason: 'request_failed',
            error: error.message
        };
    }
};

module.exports = { syncLeadToBartolina };
