const axios = require('axios');
require('dotenv').config();

async function testRest() {
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${key}`;

    console.log("Testing REST API v1...");
    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: "Hola" }] }]
        });
        console.log("✅ REST v1 working!");
        console.log(JSON.stringify(response.data, null, 2));
    } catch (e) {
        console.log(`❌ REST v1 failed: ${e.response ? JSON.stringify(e.response.data) : e.message}`);

        console.log("Testing REST API v1beta...");
        const urlBeta = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
        try {
            const responseBeta = await axios.post(urlBeta, {
                contents: [{ parts: [{ text: "Hola" }] }]
            });
            console.log("✅ REST v1beta working!");
        } catch (e2) {
            console.log(`❌ REST v1beta failed: ${e2.response ? JSON.stringify(e2.response.data) : e2.message}`);
        }
    }
}

testRest();
