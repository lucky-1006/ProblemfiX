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

const systemPrompt = `You are a world-class AI Architect, Product Designer, and Venture Capitalist.
Your goal is to discover startup opportunities from real-world complaints and problems.

Analyze the provided web search results regarding the industry/niche: "Marketing".
Identify exactly 3 distinct, recurring problems, complaints, or inefficiencies in this domain. Keep all descriptions, statements, roadmaps, and explanations concise (under 2 sentences per field) so that the JSON response does not hit token limits and get truncated.

For each problem, you MUST generate:
1. A clear Problem definition and detailed Description.
2. Ratings (0 to 100) for:
   - Impact Score (how severe/costly the problem is)
   - Frequency Score (how often it occurs)
   - AI Automation Potential (how easily AI can solve it)
   - Opportunity Score (average or weighted score of the above three)
3. A Startup Idea to address the problem, including:
   - Startup Name
   - Problem Statement
   - Target Customers
   - Value Proposition
   - Revenue Model (e.g., Subscription SaaS, Usage-based)
   - MVP Features (array of features)
   - Feature 6 Blueprint fields:
     * Landing Page Headline (a catchy, premium Vercel-style headline)
     * Tech Stack (recommended frontend/backend frameworks/libraries)
     * API Suggestions (third-party APIs to integrate)
     * Database Recommendation (recommend what this startup would use, e.g., PostgreSQL, Supabase, Pinecone)
     * Development Roadmap (4 phases of development)
4. A Practical Solution, including:
   - Recommended Solution
   - Implementation Method
   - Suggested Tools (existing developer tools or platforms)
   - Expected Benefits (array of benefits)

You MUST respond strictly with a single JSON object. Do not include markdown wraps or backticks in the response. The JSON structure must match this format:
{
  "problems": [
    {
      "id": "string (unique id, e.g., prob-1)",
      "problem": "string (concise summary of problem)",
      "description": "string (detailed description of the paint point)"
    }
  ],
  "opportunities": [
    {
      "id": "string (unique id, e.g., opp-1)",
      "problemId": "string (matches the problem.id)",
      "problem": "string (concise problem name)",
      "impactScore": number (0-100),
      "frequencyScore": number (0-100),
      "automationPotential": number (0-100),
      "opportunityScore": number (0-100)
    }
  ],
  "startupIdeas": [
    {
      "id": "string (unique id, e.g., idea-1)",
      "problemId": "string (matches the problem.id)",
      "name": "string (creative startup name)",
      "problemStatement": "string",
      "targetCustomers": "string",
      "valueProposition": "string",
      "revenueModel": "string",
      "mvpFeatures": ["string"],
      "landingPageHeadline": "string",
      "techStack": ["string"],
      "apiSuggestions": ["string"],
      "databaseRecommendation": "string",
      "developmentRoadmap": ["string"]
    }
  ],
  "solutions": [
    {
      "id": "string (unique id, e.g., sol-1)",
      "problemId": "string (matches the problem.id)",
      "currentProblem": "string",
      "recommendedSolution": "string",
      "implementationMethod": "string",
      "suggestedTools": ["string"],
      "expectedBenefits": ["string"]
    }
  ]
}`;

async function run() {
  console.log('1. Running Tavily search...');
  let searchResults = [];
  try {
    const res = await axios.post('https://api.tavily.com/search', {
      api_key: env.TAVILY_API_KEY,
      query: 'Marketing complaints pain points frustrations inefficiencies repetitive work',
      search_depth: 'basic',
      max_results: 8
    }, { timeout: 10000 });
    searchResults = res.data.results.map((item) => ({
      title: item.title || 'Search Result',
      snippet: item.content || item.snippet || '',
      url: item.url || ''
    }));
    console.log(`Tavily Success! Found ${searchResults.length} results.`);
  } catch (err) {
    console.log('Tavily search failed:', err.message);
    return;
  }

  const userPrompt = `
Search Results:
${searchResults.map((r, idx) => `[Result ${idx + 1}]
Title: ${r.title}
Source: ${r.url}
Snippet: ${r.snippet}
---`).join('\n')}

Analyze these results and generate the JSON payload matching the requested structure. Make it highly detailed and premium.
`;

  const combinedPrompt = `${systemPrompt}\n\nUser Input:\n${userPrompt}`;

  console.log('2. Calling Gemini API...');
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: combinedPrompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: 4000
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 45000
      }
    );

    console.log('API Status:', response.status);
    const candidate = response.data.candidates?.[0];
    console.log('Finish Reason:', candidate?.finishReason);
    console.log('Safety Ratings:', JSON.stringify(candidate?.safetyRatings, null, 2));
    
    const text = candidate?.content?.parts?.[0]?.text;
    console.log('Text Length:', text?.length);
    console.log('Text Ending:');
    console.log(text ? text.substring(text.length - 300) : 'NO TEXT');
  } catch (err) {
    console.log('Gemini Failed:', err.response?.data || err.message);
  }
}

run();
