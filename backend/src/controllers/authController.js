const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const login = async (req, res) => {
    const { username, password } = req.body;

    // En una app real, buscaríamos en la DB. Aquí usamos el .env para simplicidad.
    const validUsername = process.env.ADMIN_USERNAME;
    const storedPassword = process.env.ADMIN_PASSWORD;

    // Verificamos si es el usuario correcto
    if (username !== validUsername) {
        return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Comprobamos la contraseña usando bcrypt (o fallback a texto plano si aún no se ha hasheado)
    let isMatch = false;
    if (storedPassword.startsWith('$2b$')) {
        isMatch = await bcrypt.compare(password, storedPassword);
    } else {
        // Fallback temporal para no romper el acceso actual
        isMatch = (password === storedPassword);
        if (isMatch) console.warn('⚠️ ADVERTENCIA: Se usó autenticación en texto plano. Por favor hashea la contraseña en el .env');
    }

    if (isMatch) {
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
