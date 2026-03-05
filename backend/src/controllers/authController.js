const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    // En una app real, buscaríamos en la DB. Aquí usamos el .env para simplicidad.
    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (username === validUsername && password === validPassword) {
        const token = jwt.sign(
            { username: validUsername, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.json({
            success: true,
            token,
            message: 'Login exitoso'
        });
    }

    res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
    });
};

module.exports = { login };
