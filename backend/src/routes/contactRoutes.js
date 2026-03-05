const express = require('express');
const router = express.Router();
const { submitContact, listLeads } = require('../controllers/contactController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/contact - Recibir nuevo contacto (Público)
router.post('/', submitContact);

// GET /api/contact - Listar todos los contactos (Protegido - Admin)
router.get('/', authMiddleware, listLeads);

module.exports = router;
