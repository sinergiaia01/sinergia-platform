require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 5000;

// Configuración de Rate Limit (Protección contra fuerza bruta y DoS)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Límite de 100 peticiones por ventana
    message: { success: false, message: 'Demasiadas peticiones, intenta más tarde.' }
});

// Middleware de Seguridad
app.use(helmet()); // Añade cabeceras de seguridad
app.use(limiter); // Aplica rate limit a todas las rutas
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://sinergia.sbs', 'https://www.sinergia.sbs']
        : '*',
    methods: ['GET', 'POST']
}));
app.use(express.json());


// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'SINERGIA Backend is running' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor de SINERGIA corriendo en el puerto ${PORT}`);
});
