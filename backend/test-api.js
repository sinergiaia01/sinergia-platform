const axios = require('axios');

async function testSubmit() {
    try {
        const response = await axios.post('https://api.sinergia.sbs/api/contact/submit', {
            name: "Antigravity Test Full",
            email: "test_full@sinergia.ai",
            phone: "+54 9 11 0000 0000",
            message: "Esta es una prueba de integración completa. Confirmar que llega el mensaje."
        });
        console.log('Status:', response.status);
        console.log('Data:', response.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testSubmit();
