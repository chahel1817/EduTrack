import dotenv from 'dotenv';
import fetch from 'node-fetch';

// Load environment variables
dotenv.config({ path: './.env' });

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

async function testAPI() {
    console.log('🔍 Testing OpenRouter API...');

    if (!process.env.OPENROUTER_API_KEY) {
        console.error('❌ OPENROUTER_API_KEY not found in .env');
        return;
    }

    console.log('✅ API key found');

    try {
        const response = await fetch(OPENROUTER_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:5173",
                "X-Title": "EduTrack",
            },
            body: JSON.stringify({
                model: "openai/gpt-3.5-turbo",

                messages: [
                    { role: "user", content: "Say 'Hello World' in JSON format: {\"message\": \"Hello World\"}" },
                ],
                temperature: 0.1,
                max_tokens: 100,
            }),
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            console.error('❌ API request failed');
            const errorText = await response.text();
            console.error('Error:', errorText);
            return;
        }

        const data = await response.json();
        console.log('📦 Response data:', JSON.stringify(data, null, 2));

        const content = data?.choices?.[0]?.message?.content;
        console.log('📝 Content:', content);

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testAPI();
