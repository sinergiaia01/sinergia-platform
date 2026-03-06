const { contactSchema } = require('../schemas/contactSchema');
const { analyzeLead } = require('../services/aiService');
const { sendToN8n } = require('../services/webhookService');
const { saveLead, getLeads } = require('../services/databaseService');

const submitContact = async (req, res) => {
    try {
        // 1. Validar los datos recibidos
        const validatedData = contactSchema.parse(req.body);

        // 2. IA Lead Scoring
        const leadAnalysis = await analyzeLead(validatedData);

        // 3. Guardar en Supabase (Persistencia)
        await saveLead(validatedData, leadAnalysis);

        // 4. Notificación a n8n
        const fullPayload = {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone,
            message: validatedData.message || "",
            // Nueva estructura (aplanada)
            ai_score: leadAnalysis.score,
            ai_priority: leadAnalysis.priority,
            ai_analysis: leadAnalysis.analysis,
            ai_action: leadAnalysis.suggestedAction,
            // Estructura antigua (por si n8n no se actualizó)
            analysis: leadAnalysis,
            receivedAt: new Date().toISOString()
        };

        console.log('--- Payload enviada a n8n ---');
        console.log(JSON.stringify(fullPayload, null, 2));

        await sendToN8n(fullPayload);

        console.log('Nuevo Lead Procesado Correctamente:', validatedData.email);

        // 5. Respuesta de éxito
        res.status(201).json({
            success: true,
            message: 'Contacto recibido correctamente',
            leadAnalysis
        });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                success: false,
                errors: error.errors.map(err => ({
                    field: err.path[0],
                    message: err.message
                }))
            });
        }

        console.error('Error en el servidor:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

const listLeads = async (req, res) => {
    try {
        const leads = await getLeads();
        res.json({ success: true, leads });
    } catch (error) {
        console.error('Error listando leads:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo leads' });
    }
};

module.exports = { submitContact, listLeads };
