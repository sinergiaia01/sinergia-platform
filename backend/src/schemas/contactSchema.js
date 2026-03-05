const { z } = require('zod');

const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(8, 'El teléfono debe tener al menos 8 caracteres'),
    message: z.string().optional(),
});

module.exports = { contactSchema };
