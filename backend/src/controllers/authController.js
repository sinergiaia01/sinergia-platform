const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getUserByUsername } = require('../services/databaseService');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Intentar buscar en Supabase (Migración completada)
        let user = await getUserByUsername(username);
        let validPassword = false;

        if (user) {
            validPassword = await bcrypt.compare(password, user.password_hash);
        } else {
            // 2. Fallback a variables de entorno para no bloquear al usuario durante la migración
            console.log('ℹ️ Usuario no encontrado en DB, intentando con variables de entorno...');
            const envUsername = process.env.ADMIN_USERNAME;
            const envStoredPassword = process.env.ADMIN_PASSWORD;

            if (username === envUsername) {
                if (envStoredPassword.startsWith('$2b$')) {
                    validPassword = await bcrypt.compare(password, envStoredPassword);
                } else {
                    validPassword = (password === envStoredPassword);
                }
            }
        }

        if (validPassword) {
            const token = jwt.sign(
                {
                    username: user ? user.username : process.env.ADMIN_USERNAME,
                    role: user ? user.role : 'admin'
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            return res.json({
                success: true,
                token,
                message: 'Login exitoso'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Credenciales inválidas'
        });

    } catch (error) {
        console.error('Error en proceso de login:', error);
        res.status(500).json({ success: false, message: 'Error interno del servidor' });
    }
};

module.exports = { login };

