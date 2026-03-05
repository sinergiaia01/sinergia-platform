require('dotenv').config();
const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contactRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
