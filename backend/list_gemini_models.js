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
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1beta/models?key=${env.GEMINI_API_KEY}`);
    console.log('Available Gemini Models in v1beta:');
    res.data.models.forEach(m => {
      console.log(`- ${m.name} (displayName: ${m.displayName})`);
    });
  } catch (err) {
    console.log('Failed v1beta:', err.response?.data || err.message);
  }
  
  try {
    const res = await axios.get(`https://generativelanguage.googleapis.com/v1/models?key=${env.GEMINI_API_KEY}`);
    console.log('\nAvailable Gemini Models in v1:');
    res.data.models.forEach(m => {
      console.log(`- ${m.name} (displayName: ${m.displayName})`);
    });
  } catch (err) {
    console.log('Failed v1:', err.response?.data || err.message);
  }
}

listModels();
