const axios = require('axios');

async function testApi() {
    try {
        console.log('--- Enviando petición de prueba ---');
        const response = await axios.post('https://api.sinergia.sbs/api/contact', {
            name: "Test New Key",
            email: "keytest@sinergia.ai",
            phone: "1122334455",
            message: "Probando la nueva clave de Gemini"
        });
        console.log('✅ Éxito!');
        console.log('Status:', response.status);
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Error');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Data:', error.response.data);
        } else {
            console.log('Message:', error.message);
        }
    }
}

testApi();
