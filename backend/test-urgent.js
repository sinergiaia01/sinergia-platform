const axios = require('axios');

async function testUrgentLead() {
    try {
        console.log('--- Enviando petición URGENTE ---');
        const response = await axios.post('https://api.sinergia.sbs/api/contact', {
            name: "Empresa Grande S.A.",
            email: "ceo@empresa.com",
            phone: "+54 11 9999 8888",
            message: "ATENCIÓN: Necesitamos automatizar toda nuestra línea de producción RPA de forma URGENTE. Presupuesto ilimitado."
        });
        console.log('✅ Petición enviada!');
        console.log('Respuesta del Servidor:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ Error en la prueba:', error.response ? error.response.data : error.message);
    }
}

testUrgentLead();
