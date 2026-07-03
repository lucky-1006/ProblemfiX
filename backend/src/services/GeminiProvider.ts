import axios from 'axios';
import { AIProvider, AnalysisResponse } from '../interfaces/AIProvider';
import { SearchResult } from '../interfaces/SearchProvider';

export class GeminiProvider implements AIProvider {
  private apiKey: string;
  private defaultModel: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || '';
    this.defaultModel = 'gemini-3.5-flash';
  }

  async analyze(industry: string, searchResults: SearchResult[], modelId?: string): Promise<AnalysisResponse> {
    if (!this.apiKey) {
      console.warn('GEMINI_API_KEY is not defined. Returning high-quality mock analysis.');
      return this.getMockAnalysis(industry);
    }

    let model = this.defaultModel;
    if (modelId) {
      if (modelId.includes('gemini-2.5-flash')) {
        model = 'gemini-3.5-flash';
      } else {
        model = modelId;
      }
    }
    console.log(`Analyzing industry "${industry}" using Gemini model "${model}"...`);

    const systemPrompt = `You are a world-class AI Architect, Product Designer, and Venture Capitalist.
Your goal is to discover startup opportunities from real-world complaints and problems.

    Analyze the provided web search results regarding the industry/niche: "${industry}".
    Identify exactly 2 distinct, recurring problems, complaints, or inefficiencies in this domain. Keep all descriptions, statements, roadmaps, and explanations concise (under 2 sentences per field) so that the JSON response does not hit token limits and get truncated.

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
   - MVP Features (array of exactly 3 features)
   - Feature 6 Blueprint fields:
     * Landing Page Headline (a catchy, premium Vercel-style headline)
     * Tech Stack (recommended frontend/backend frameworks/libraries)
     * API Suggestions (third-party APIs to integrate)
     * Database Recommendation (recommend what this startup would use, e.g., PostgreSQL, Supabase, Pinecone)
     * Development Roadmap (4 phases of development)
4. A Practical Solution, including:
   - Recommended Solution
   - Implementation Method
   - Suggested Tools (array of exactly 3 existing developer tools or platforms)
   - Expected Benefits (array of exactly 3 benefits)

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

    const userPrompt = `
Search Results:
${searchResults.map((r, idx) => `[Result ${idx + 1}]
Title: ${r.title}
Snippet: ${r.snippet.substring(0, 120)}...
---`).join('\n')}

Analyze these results and generate the JSON payload matching the requested structure. Make it highly detailed and premium.
`;

    const combinedPrompt = `${systemPrompt}\n\nUser Input:\n${userPrompt}`;

    let content = '';
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{ text: combinedPrompt }]
          }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
            maxOutputTokens: 4000
          }
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 90000
        }
      );

      content = response.data.candidates[0].content.parts[0].text;
      return this.cleanAndParseJson(content);
    } catch (error: any) {
      console.error('Error querying Gemini API:', error.response?.data || error.message);
      if (content) {
        console.error('Raw Gemini Response Content that failed to parse:');
        console.error(content);
      }
      const errMsg = error.response?.data?.error?.message || error.message;
      throw new Error(`Gemini API failed: ${errMsg}`);
    }
  }

  private getMockAnalysis(industry: string): AnalysisResponse {
    console.log(`Generating detailed mock analysis for industry: "${industry}"`);
    const normalized = industry.toLowerCase().trim();

    if (normalized.includes('support') || normalized.includes('customer')) {
      return {
        problems: [
          {
            id: 'prob-1',
            problem: 'Support agents repeatedly answer identical questions',
            description: 'Customer service agents waste up to 40% of their workday answering redundant, basic queries about shipping status, return policies, and passwords. This causes high fatigue and keeps them from resolving complex support issues.'
          },
          {
            id: 'prob-2',
            problem: 'Inefficient support ticket triage and prioritization',
            description: 'Incoming support tickets are manually triaged or routed using basic keyword rules. High-value customer complaints or urgent accounts get buried, leading to SLA breaches, customer churn, and long resolution times.'
          },
          {
            id: 'prob-3',
            problem: 'Slow customer response times during peak hours',
            description: 'Due to sudden spikes in ticket volume, response times balloon from minutes to hours. Hiring seasonal agents is expensive, hard to scale, and results in inconsistent support quality.'
          }
        ],
        opportunities: [
          {
            id: 'opp-1',
            problemId: 'prob-1',
            problem: 'Support agents repeatedly answer identical questions',
            impactScore: 81,
            frequencyScore: 92,
            automationPotential: 89,
            opportunityScore: 87
          },
          {
            id: 'opp-2',
            problemId: 'prob-2',
            problem: 'Inefficient support ticket triage and prioritization',
            impactScore: 83,
            frequencyScore: 76,
            automationPotential: 81,
            opportunityScore: 80
          },
          {
            id: 'opp-3',
            problemId: 'prob-3',
            problem: 'Slow customer response times during peak hours',
            impactScore: 89,
            frequencyScore: 83,
            automationPotential: 84,
            opportunityScore: 85
          }
        ],
        startupIdeas: [
          {
            id: 'idea-1',
            problemId: 'prob-1',
            name: 'FAQ Copilot (Gemini)',
            problemStatement: 'Support teams repeatedly answer identical questions, leading to agent burnout and high labor costs.',
            targetCustomers: 'E-commerce Brands and mid-market SaaS companies.',
            valueProposition: 'Automate 75% of incoming repetitive support tickets with agent-guided AI drafts that maintain brand voice.',
            revenueModel: 'Subscription SaaS ($49 - $299/month + volume fee)',
            mvpFeatures: [
              'Chrome extension that drafts replies in Zendesk/Intercom',
              'Auto-ingest documentation & historical chat logs',
              'Feedback loop for agents to edit drafts and train the AI model'
            ],
            landingPageHeadline: 'Tame Your Support Queue with AI Drafts That Sound Human',
            techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Vite', 'Tailwind CSS'],
            apiSuggestions: ['Zendesk API', 'OpenAI API', 'Tavily Search API'],
            databaseRecommendation: 'Supabase (PostgreSQL) for relational data and Vector store for chat embeds',
            developmentRoadmap: [
              'Phase 1: Build the Chrome extension UI and draft backend',
              'Phase 2: Integrate knowledge ingestion and vector search',
              'Phase 3: Connect to major helpdesks (Zendesk/Intercom)',
              'Phase 4: Launch public beta and scale automated drafting analytics'
            ]
          },
          {
            id: 'idea-2',
            problemId: 'prob-2',
            name: 'TriageFlow AI',
            problemStatement: 'Inefficient ticket sorting results in slow response times for VIP clients and critical bugs.',
            targetCustomers: 'Enterprise Customer Success & Operations Teams.',
            valueProposition: 'Intelligent ticket routing based on customer value, sentiment, and category, achieving 99% SLA compliance.',
            revenueModel: 'B2B Contract-based pricing starting at $1,000/month',
            mvpFeatures: [
              'Real-time sentiment analyzer for incoming emails',
              'Automated priority tagging and agent matching engine',
              'Dashboard showing SLA warnings and queue bottlenecks'
            ],
            landingPageHeadline: 'Route Tickets to the Right Agents, Instantly',
            techStack: ['Next.js', 'FastAPI', 'Python', 'Tailwind CSS'],
            apiSuggestions: ['HubSpot CRM API', 'Slack Webhooks API'],
            databaseRecommendation: 'PostgreSQL for ticket logs, Redis for real-time queue states',
            developmentRoadmap: [
              'Phase 1: Develop sentiment analysis engine and category classifier',
              'Phase 2: Establish Zendesk webhook receiver and automated dispatcher',
              'Phase 3: Create analytics dashboard and custom routing rules UI',
              'Phase 4: Launch enterprise trial and optimize matching algorithms'
            ]
          },
          {
            id: 'idea-3',
            problemId: 'prob-3',
            name: 'OverFlow Agent',
            problemStatement: 'Peak hour ticket surges lead to long response times and customer frustration.',
            targetCustomers: 'Fast-growing startups and retail companies.',
            valueProposition: 'Autonomous AI agents that spin up during spikes to resolve 60% of tier-1 support requests instantly.',
            revenueModel: 'Pay-per-resolved-ticket ($0.50 per resolution)',
            mvpFeatures: [
              'Instant chat widget for websites',
              'Self-service workflows (cancellations, order tracking, updates)',
              'Seamless handoff to human agents when sentiment degrades'
            ],
            landingPageHeadline: 'Scale Your Support Team to Infinity During Surges',
            techStack: ['React', 'NestJS', 'TypeScript', 'WebSockets'],
            apiSuggestions: ['Stripe API (for refunds)', 'Shopify API (for order tracking)'],
            databaseRecommendation: 'MongoDB for unstructured chat transcripts, PostgreSQL for accounts',
            developmentRoadmap: [
              'Phase 1: Design interactive chat widget and basic conversation trees',
              'Phase 2: Integrate Shopify and Stripe APIs for action-oriented fulfillment',
              'Phase 3: Implement human-in-the-loop transition framework',
              'Phase 4: Publish SDK and support custom integrations'
            ]
          }
        ],
        solutions: [
          {
            id: 'sol-1',
            problemId: 'prob-1',
            currentProblem: 'Support agents repeatedly answer identical questions.',
            recommendedSolution: 'Build an automated AI draft assistant that hooks into Zendesk and pre-writes responses based on the knowledge base.',
            implementationMethod: 'Implement a semantic search pipeline across company docs using vector databases, paired with custom prompting.',
            suggestedTools: ['Pinecone', 'LangChain', 'OpenAI Assistants API'],
            expectedBenefits: [
              'Reduces ticket resolution times by 55%',
              'Improves agent onboarding speeds',
              'Maintains consistent tone across responses'
            ]
          },
          {
            id: 'sol-2',
            problemId: 'prob-2',
            currentProblem: 'Inefficient support ticket triage and prioritization.',
            recommendedSolution: 'Integrate real-time ticket categorization and prioritization powered by text classification LLMs.',
            implementationMethod: 'Analyze incoming email/chat contents via webhooks and automatically apply prioritization categories.',
            suggestedTools: ['Hugging Face', 'AWS Lambda', 'SendGrid Webhooks'],
            expectedBenefits: [
              'Zero SLA breaches on high-priority tickets',
              'Reduces customer escalations by 30%',
              'Saves managers 5 hours/week in ticket sorting'
            ]
          },
          {
            id: 'sol-3',
            problemId: 'prob-3',
            currentProblem: 'Slow customer response times during peak hours.',
            recommendedSolution: 'Deploy autonomous AI agents capable of querying databases and APIs to solve customer requests.',
            implementationMethod: 'Construct state-based agents using function calling to look up order details and perform actions.',
            suggestedTools: ['Vercel AI SDK', 'Shopify Admin API', 'Stripe SDK'],
            expectedBenefits: [
              'Instant response times 24/7',
              'Reduces overall support costs by 40%',
              'Increases Customer Satisfaction Score (CSAT) by 15%'
            ]
          }
        ]
      };
    }

    return {
      problems: [
        {
          id: 'prob-1',
          problem: `Manual workflows and administrative overhead in ${industry}`,
          description: `Professionals in ${industry} spend excessive hours daily on manual data entry, report compilation, and coordination. This reduces time spent on high-value tasks.`
        },
        {
          id: 'prob-2',
          problem: `Inefficient data sharing and siloed information inside ${industry}`,
          description: `Teams struggle to collaborate due to scattered files, outdated spreadsheets, and legacy systems that do not talk to each other, leading to errors and delays.`
        },
        {
          id: 'prob-3',
          problem: `Lack of predictive insights and slow decision-making in ${industry}`,
          description: `Organizations make reactive decisions because analyzing current trends requires manual calculations that take days. They lack real-time predictive analytics.`
        }
      ],
      opportunities: [
        {
          id: 'opp-1',
          problemId: 'prob-1',
          problem: `Manual workflows and administrative overhead in ${industry}`,
          impactScore: 86,
          frequencyScore: 89,
          automationPotential: 81,
          opportunityScore: 85
        },
        {
          id: 'opp-2',
          problemId: 'prob-2',
          problem: `Inefficient data sharing and siloed information inside ${industry}`,
          impactScore: 77,
          frequencyScore: 86,
          automationPotential: 73,
          opportunityScore: 78
        },
        {
          id: 'opp-3',
          problemId: 'prob-3',
          problem: `Lack of predictive insights and slow decision-making in ${industry}`,
          impactScore: 89,
          frequencyScore: 74,
          automationPotential: 86,
          opportunityScore: 83
        }
      ],
      startupIdeas: [
        {
          id: 'idea-1',
          problemId: 'prob-1',
          name: `${industry.replace(/\s+/g, '')}Flow (Gemini)`,
          problemStatement: `Manual administrative workflows consume up to 3 hours per day of staff time.`,
          targetCustomers: `Small and medium businesses operating in ${industry}.`,
          valueProposition: `Automate manual reporting and data flows, saving 15 hours per employee per week.`,
          revenueModel: `Usage-based SaaS starting at $99/month`,
          mvpFeatures: [
            'Drag-and-drop document parser',
            'Automated dashboard compiler',
            'Email notifications and summaries'
          ],
          landingPageHeadline: `Automate Your ${industry} Workflows in One Click`,
          techStack: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
          apiSuggestions: ['OpenAI Document Parser API', 'Zapier API'],
          databaseRecommendation: 'PostgreSQL for structured logs and configurations',
          developmentRoadmap: [
            'Phase 1: Launch basic file parser engine',
            'Phase 2: Integrate template library and automation triggers',
            'Phase 3: Connect third-party SaaS integrations',
            'Phase 4: Scale enterprise workflow builder'
          ]
        },
        {
          id: 'idea-2',
          problemId: 'prob-2',
          name: `SiloBuster AI`,
          problemStatement: 'Siloed data leads to communications breakdowns and error-prone delivery.',
          targetCustomers: 'Mid-to-large scale companies.',
          valueProposition: 'A semantic search layer that index all company drives and answers queries instantly.',
          revenueModel: 'Per-seat subscription ($15/seat/month)',
          mvpFeatures: [
            'Google Drive & Slack connector',
            'AI search engine query box',
            'Daily updates digests'
          ],
          landingPageHeadline: 'Find Anything Across Your Company in 5 Seconds',
          techStack: ['Next.js', 'Python', 'FastAPI'],
          apiSuggestions: ['Slack API', 'Google Workspace API'],
          databaseRecommendation: 'Pinecone for vector index, MongoDB for search history logs',
          developmentRoadmap: [
            'Phase 1: Establish drive file syncing and indexing services',
            'Phase 2: Create semantic search backend and React interface',
            'Phase 3: Support Slack chat history imports',
            'Phase 4: Launch fine-tuned security permissions configuration'
          ]
        },
        {
          id: 'idea-3',
          problemId: 'prob-3',
          name: `RadarPredict`,
          problemStatement: 'Organizations make reactive business decisions due to outdated insights.',
          targetCustomers: 'Strategy and operations directors.',
          valueProposition: 'AI-driven forecasting dashboard that scans market trends and predicts demand shifts.',
          revenueModel: 'Annual subscription licensing',
          mvpFeatures: [
            'Real-time data stream connectors',
            'AI forecasting graphs',
            'Alert thresholds notification system'
          ],
          landingPageHeadline: 'Predict Trends Before They Impact Your Bottom Line',
          techStack: ['React', 'FastAPI', 'Python', 'Tailwind CSS'],
          apiSuggestions: ['Alpha Vantage API', 'Google Trends API'],
          databaseRecommendation: 'TimescaleDB (PostgreSQL) for time-series charts data',
          developmentRoadmap: [
            'Phase 1: Build data aggregation pipelines and models',
            'Phase 2: Create interactive dashboard UI with Vite and Recharts',
            'Phase 3: Develop automated PDF report generation and alerts',
            'Phase 4: Launch premium enterprise customization service'
          ]
        }
      ],
      solutions: [
        {
          id: 'sol-1',
          problemId: 'prob-1',
          currentProblem: `Manual workflows and administrative overhead in ${industry}.`,
          recommendedSolution: `Implement an AI-powered agent to auto-ingest daily data and populate reports.`,
          implementationMethod: 'Utilize vision LLMs to parse screenshots or documents and structure the data.',
          suggestedTools: ['Claude 3.5 Sonnet', 'Tesseract OCR', 'n8n'],
          expectedBenefits: [
            'Reduces human data-entry error rates to < 1%',
            'Saves 10 hours per week per analyst',
            'Accelerates report finalization time'
          ]
        },
        {
          id: 'sol-2',
          problemId: 'prob-2',
          currentProblem: `Inefficient data sharing and siloed information inside ${industry}.`,
          recommendedSolution: 'Build an internal semantic search index that crawls documents and answers questions.',
          implementationMethod: 'Setup scheduled webhooks to sync document modifications and update embeddings.',
          suggestedTools: ['Pinecone', 'LlamaIndex', 'Github Actions'],
          expectedBenefits: [
            'Cuts research time for files by 70%',
            'Improves internal onboarding of new hires',
            'Eliminates duplicate documentation efforts'
          ]
        },
        {
          id: 'sol-3',
          problemId: 'prob-3',
          currentProblem: `Lack of predictive insights and slow decision-making in ${industry}.`,
          recommendedSolution: 'Create an automated predictive model that generates weekly strategy briefs.',
          implementationMethod: 'Hook external market RSS feeds and stock trackers to a summarizing LLM.',
          suggestedTools: ['OpenAI GPT-4o', 'LangChain', 'Python Pandas'],
          expectedBenefits: [
            'Enables proactive planning for market changes',
            'Reduces time spent compiling slides by 80%',
            'Enables strategic alignment across remote teams'
          ]
        }
      ]
    };
  }

  private cleanAndParseJson(jsonText: string): any {
    let cleaned = jsonText.trim();

    // 1. Remove markdown code blocks if present
    if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    }

    // 2. Find JSON boundaries
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }

    // 3. Replace literal newlines inside double-quoted strings
    let inString = false;
    let escape = false;
    let result = '';

    for (let i = 0; i < cleaned.length; i++) {
      const char = cleaned[i];

      if (escape) {
        result += char;
        escape = false;
        continue;
      }

      if (char === '\\') {
        result += char;
        escape = true;
        continue;
      }

      if (char === '"') {
        inString = !inString;
        result += char;
        continue;
      }

      if (inString && (char === '\n' || char === '\r')) {
        if (char === '\n') {
          result += '\\n';
        }
        continue;
      }

      result += char;
    }

    return JSON.parse(result);
  }
}
