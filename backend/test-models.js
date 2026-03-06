const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-1.5-flash-latest', 'gemini-1.5-flash-001'];

    for (const m of models) {
        console.log(`Testing model: ${m}...`);
        try {
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("Hola");
            console.log(`✅ Model ${m} is working: ${result.response.text()}`);
            return;
        } catch (e) {
            console.log(`❌ Model ${m} failed: ${e.message}`);
        }
    }
}

listModels();
