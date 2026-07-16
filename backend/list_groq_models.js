const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Load .env
const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[key] = value.trim();
  }
});

async function listModels() {
  if (!env.GROQ_API_KEY) {
    console.log('GROQ_API_KEY is missing');
    return;
  }
  try {
    const res = await axios.get('https://api.groq.com/openai/v1/models', {
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`
      }
    });
    console.log('Available Groq Models:');
    res.data.data.forEach(m => {
      console.log(`- ${m.id} (owned_by: ${m.owned_by})`);
    });
  } catch (err) {
    console.log('Failed:', err.response?.data || err.message);
  }
}

listModels();
