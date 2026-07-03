const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load .env
const envPath = path.join(__dirname, '.env');
console.log('Reading .env from:', envPath);
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

async function testTavily() {
  console.log('\n--- Testing Tavily API ---');
  if (!env.TAVILY_API_KEY) {
    console.log('Tavily API key is missing');
    return;
  }
  try {
    const res = await axios.post('https://api.tavily.com/search', {
      api_key: env.TAVILY_API_KEY,
      query: 'customer support complaints',
      search_depth: 'basic',
      max_results: 1
    }, { timeout: 10000 });
    console.log('Tavily Success! Results count:', res.data?.results?.length);
  } catch (err) {
    console.log('Tavily Failed:', err.response?.data || err.message);
  }
}

async function testSerper() {
  console.log('\n--- Testing Serper API ---');
  if (!env.SERPER_API_KEY) {
    console.log('Serper API key is missing');
    return;
  }
  try {
    const res = await axios.post('https://google.serper.dev/search', {
      q: 'customer support complaints',
      num: 1
    }, {
      headers: {
        'X-API-KEY': env.SERPER_API_KEY,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log('Serper Success! Organic results count:', res.data?.organic?.length);
  } catch (err) {
    console.log('Serper Failed:', err.response?.data || err.message);
  }
}

async function testOpenAI() {
  console.log('\n--- Testing OpenAI API ---');
  if (!env.OPENAI_API_KEY) {
    console.log('OpenAI API key is missing');
    return;
  }
  try {
    const res = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say test' }],
      max_tokens: 5
    }, {
      headers: {
        'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log('OpenAI Success! Response:', res.data?.choices?.[0]?.message?.content);
  } catch (err) {
    console.log('OpenAI Failed:', err.response?.data || err.message);
  }
}

async function testGroq() {
  console.log('\n--- Testing Groq API ---');
  if (!env.GROQ_API_KEY) {
    console.log('Groq API key is missing');
    return;
  }
  try {
    const res = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: 'Say test' }],
      max_tokens: 5
    }, {
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    console.log('Groq Success! Response:', res.data?.choices?.[0]?.message?.content);
  } catch (err) {
    console.log('Groq Failed:', err.response?.data || err.message);
  }
}

async function testGemini() {
  console.log('\n--- Testing Gemini API ---');
  if (!env.GEMINI_API_KEY) {
    console.log('Gemini API key is missing');
    return;
  }
  try {
    const res = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: 'Say test' }] }],
        generationConfig: { maxOutputTokens: 5 }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      }
    );
    console.log('Gemini Success! Response:', res.data?.candidates?.[0]?.content?.parts?.[0]?.text);
  } catch (err) {
    console.log('Gemini Failed:', err.response?.data || err.message);
  }
}

(async () => {
  await testTavily();
  await testSerper();
  await testOpenAI();
  await testGroq();
  await testGemini();
})();
