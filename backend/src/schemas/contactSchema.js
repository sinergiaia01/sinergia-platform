const { z } = require('zod');

const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email invalido'),
    phone: z.string().min(8, 'El telefono debe tener al menos 8 caracteres'),
    message: z.string().optional(),
    service_interest: z.enum(['landing_page', 'social_media_monthly', 'digital_launch']).optional(),
    source: z.string().max(80).optional(),
});

module.exports = { contactSchema };
