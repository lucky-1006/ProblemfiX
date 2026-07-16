import axios from 'axios';
import { AIProvider, AnalysisResponse, Problem, Opportunity, StartupIdea, Solution } from '../interfaces/AIProvider';
import { SearchResult } from '../interfaces/SearchProvider';
import { PipelineRunner } from './PipelineRunner';

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

    const llmCaller = async (systemPrompt: string, userPrompt: string): Promise<string> => {
      const combinedPrompt = `${systemPrompt}\n\nUser Input:\n${userPrompt}`;
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
          timeout: 180000
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    };

    return PipelineRunner.run(industry, searchResults, llmCaller);
  }

  getMockAnalysis(industry: string): AnalysisResponse {
    console.log(`Generating detailed mock analysis for industry: "${industry}"`);
    
    const problems: Problem[] = [
      {
        id: 'prob-1',
        problem: 'Manual Compliance Logging & Audit Trail Compilation',
        description: 'Root Cause: Operations teams spend 15+ hours weekly manually matching transactional emails to compliance guidelines because they lack real-time semantic logging databases.'
      },
      {
        id: 'prob-2',
        problem: 'Siloed Enterprise Document Search & Retrieval',
        description: 'Root Cause: Customer service staff spend 2+ hours daily hunting for pricing policies across disconnected storage portals because search systems rely on pure keyword match instead of semantic RAG indexing.'
      },
      {
        id: 'prob-3',
        problem: 'Inefficient Support Ticket Routing & SLA Breach Risks',
        description: 'Root Cause: High-value enterprise account bug reports get buried in general FIFO queues because legacy helpdesks route tickets purely by timestamp rather than live CRM contract values.'
      }
    ];

    const opportunities: Opportunity[] = [
      {
        id: 'opp-1',
        problemId: 'prob-1',
        problem: 'Manual Compliance Logging & Audit Trail Compilation',
        impactScore: 92,
        frequencyScore: 85,
        automationPotential: 90,
        opportunityScore: 89
      },
      {
        id: 'opp-2',
        problemId: 'prob-2',
        problem: 'Siloed Enterprise Document Search & Retrieval',
        impactScore: 80,
        frequencyScore: 95,
        automationPotential: 85,
        opportunityScore: 87
      },
      {
        id: 'opp-3',
        problemId: 'prob-3',
        problem: 'Inefficient Support Ticket Routing & SLA Breach Risks',
        impactScore: 88,
        frequencyScore: 82,
        automationPotential: 88,
        opportunityScore: 86
      }
    ];

    const startupIdeas: StartupIdea[] = [
      {
        id: 'idea-1',
        problemId: 'prob-1',
        name: 'AuditGuard AI',
        problemStatement: 'Hidden Problem: Regulated industries manually compile audit trails from customer messages. | Evidence: Extraction of manual checklists from compliance logs. | Root Cause: Disconnected CRM/compliance systems. | Behavior Observed: Operations staff double-checking spreadsheets. | Constraints: Migration risks and legacy databases.',
        valueProposition: 'Tagline: Compliance Audits on Autopilot for High-Reg Startups | Unique Insight: Relies on localized fine-tuned LLMs to identify regulatory violations in real time. | Why Existing Solutions Fail: Existing compliance systems require manual tag entries and cannot read unstructured conversational emails. | Business Model: B2B Enterprise SaaS | Market: $8.5B TAM | AI Role: Vision check classification and semantic parsing | Automation: Real-time webhook monitors | Moat: Localized indexing | Distribution: Certifiers and compliance partners | MVP: Anomalies detector | Risks: Undocumented legacy databases | Technical Complexity: High (Novelty Score: 96/100, Critic Score: 88/100, Investor Score: 89/100, Confidence Score: 92/100).',
        targetCustomers: 'Fintech, Healthtech, and Insurance carriers',
        revenueModel: 'B2B subscription based on volume (starts at $999/month)',
        mvpFeatures: [
          'Direct email/Slack API integrations',
          'Autonomous compliance tag classifier',
          'Exportable PDF compliance logs builder'
        ],
        landingPageHeadline: 'Compliance Audits on Autopilot for High-Reg Startups',
        techStack: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS'],
        apiSuggestions: ['Slack Webhooks', 'OpenAI API', 'SendGrid API'],
        databaseRecommendation: 'Supabase PostgreSQL with Vector capabilities',
        developmentRoadmap: [
          'Phase 1: Secure email parsing integration API endpoints',
          'Phase 2: Build fine-tuned LLM classifier engine',
          'Phase 3: Launch compliance PDF report compiler',
          'Phase 4: Establish enterprise compliance cert integrations'
        ],
        hiddenProblem: 'Unsynchronized compliance logging across legacy databases.',
        evidence: 'Extraction of manual checklists from compliance logs.',
        rootCause: 'Disconnected CRM and compliance systems.',
        behaviorAnalysis: 'Operations staff manually verifying transactions in spreadsheets.',
        whyCurrentSolutionsFail: 'Existing compliance systems require manual tag entries and cannot read unstructured conversational emails.',
        uniqueInsight: 'Relies on localized fine-tuned LLMs to identify regulatory violations in real time.',
        whyNobodySolvedIt: 'Migration risks and high legal integration barriers.',
        businessModel: 'B2B Enterprise SaaS',
        market: '$8.5B TAM',
        aiRole: 'Vision check classification and semantic parsing.',
        automationStrategy: 'Real-time webhook monitors.',
        moat: 'Localized indexing adapters.',
        distributionStrategy: 'Certifiers and compliance partners.',
        mvp: 'Anomalies detector.',
        risks: 'Undocumented legacy databases.',
        technicalComplexity: 'High',
        estimatedBuildTime: '6-8 weeks',
        opportunityScore: 89,
        noveltyScore: 96,
        criticScore: 88,
        investorScore: 89,
        confidenceScore: 92
      },
      {
        id: 'idea-2',
        problemId: 'prob-2',
        name: 'DocuSync Search',
        problemStatement: 'Hidden Problem: Employees spend 2 hours daily searching custom vendor documents and policies. | Evidence: Support logs highlight excessive file retrieval delays. | Root Cause: Keyword search is blind to the context of legal clauses. | Behavior Observed: Employees maintaining shadow document copies. | Constraints: Security permissions constraints.',
        valueProposition: 'Tagline: Instant Answers Across Your Custom Vendor Contracts | Unique Insight: Utilizes agentic RAG models to index pricing agreements and answer custom client terms instantly. | Why Existing Solutions Fail: Search engines search by keyword match only and miss the semantic meaning and context of vendor contracts. | Business Model: B2B Enterprise SaaS | Market: $6.2B TAM | AI Role: Semantic retrieval & clause validation | Automation: Automatic GDrive document sync | Moat: Fine-tuned legal models | Distribution: Direct sales to sales operations directors | MVP: Custom crawler and client chat | Risks: Data privacy policies | Technical Complexity: Medium (Novelty Score: 95/100, Critic Score: 85/100, Investor Score: 87/100, Confidence Score: 90/100).',
        targetCustomers: 'Medium enterprise support and sales operations teams',
        revenueModel: 'Per-seat subscription ($15/seat/month)',
        mvpFeatures: [
          'Google Workspace and SharePoint crawler connectors',
          'Semantic chat interface for document questions',
          'Data access privilege filters'
        ],
        landingPageHeadline: 'Instant Answers Across Your Custom Vendor Contracts',
        techStack: ['Next.js', 'Python', 'FastAPI', 'Vite'],
        apiSuggestions: ['Google Drive API', 'Pinecone API', 'OpenAI API'],
        databaseRecommendation: 'Pinecone vector database for document embeddings',
        developmentRoadmap: [
          'Phase 1: Build document sync pipeline and crawler',
          'Phase 2: Construct RAG search logic and web console',
          'Phase 3: Connect enterprise permissions directories',
          'Phase 4: Launch public beta and scale indexing throughput'
        ],
        hiddenProblem: 'Employees spend 2 hours daily searching custom vendor documents and policies.',
        evidence: 'Support logs highlight excessive file retrieval delays.',
        rootCause: 'Keyword search is blind to the context of legal clauses.',
        behaviorAnalysis: 'Employees maintaining shadow document copies.',
        whyCurrentSolutionsFail: 'Search engines search by keyword match only and miss the semantic meaning and context of vendor contracts.',
        uniqueInsight: 'Utilizes agentic RAG models to index pricing agreements and answer custom client terms instantly.',
        whyNobodySolvedIt: 'Security permissions constraints.',
        businessModel: 'B2B Enterprise SaaS',
        market: '$6.2B TAM',
        aiRole: 'Semantic retrieval & clause validation.',
        automationStrategy: 'Automatic GDrive document sync.',
        moat: 'Fine-tuned legal models.',
        distributionStrategy: 'Direct sales to sales operations directors.',
        mvp: 'Custom crawler and client chat.',
        risks: 'Data privacy policies.',
        technicalComplexity: 'Medium',
        estimatedBuildTime: '6-8 weeks',
        opportunityScore: 87,
        noveltyScore: 95,
        criticScore: 85,
        investorScore: 87,
        confidenceScore: 90
      },
      {
        id: 'idea-3',
        problemId: 'prob-3',
        name: 'ValueRoute AI',
        problemStatement: 'Hidden Problem: Urgent account customer support requests get buried in general queues. | Evidence: High churn rates from enterprise customers due to response delays. | Root Cause: General helpdesks decoupling ticket urgency from real CRM values. | Behavior Observed: Manual sorting of inbox folders. | Constraints: Integration friction with legacy helpdesks.',
        valueProposition: 'Tagline: Prioritize Tickets by Real-Time Contract Value | Unique Insight: Integrates direct CRM values to prioritize tickets dynamically, preventing SLA breaches. | Why Existing Solutions Fail: Legacy helpdesks only sort by FIFO or manual priority, ignoring dynamic account CRM metrics. | Business Model: B2B Enterprise SaaS | Market: $4.5B TAM | AI Role: Live ticket sentiment and intent routing | Automation: CRM webhook synchronizers | Moat: Multi-connector support | Distribution: Salesforce and Zendesk app stores | MVP: Live alerts routing | Risks: CRM API downtime | Technical Complexity: Medium (Novelty Score: 97/100, Critic Score: 87/100, Investor Score: 86/100, Confidence Score: 93/100).',
        targetCustomers: 'B2B enterprise SaaS startups and scaleups',
        revenueModel: 'Tiered subscription (starts at $299/month)',
        mvpFeatures: [
          'HubSpot and Salesforce webhook receivers',
          'Intelligent ticket prioritization dispatcher',
          'Real-time SLA alerting dashboard'
        ],
        landingPageHeadline: 'Prioritize Tickets by Real-Time Contract Value',
        techStack: ['React', 'NestJS', 'TypeScript', 'Tailwind CSS'],
        apiSuggestions: ['Salesforce API', 'Zendesk API', 'Slack Webhooks API'],
        databaseRecommendation: 'Redis for queuing and PostgreSQL for rule logs',
        developmentRoadmap: [
          'Phase 1: Create integrations with Salesforce and Zendesk APIs',
          'Phase 2: Develop real-time priority dispatcher algorithms',
          'Phase 3: Build frontend monitoring dashboard',
          'Phase 4: Deploy enterprise routing triggers'
        ],
        hiddenProblem: 'Urgent account customer support requests get buried in general queues.',
        evidence: 'High churn rates from enterprise customers due to response delays.',
        rootCause: 'General helpdesks decoupling ticket urgency from real CRM values.',
        behaviorAnalysis: 'Manual sorting of inbox folders.',
        whyCurrentSolutionsFail: 'Legacy helpdesks only sort by FIFO or manual priority, ignoring dynamic account CRM metrics.',
        uniqueInsight: 'Integrates direct CRM values to prioritize tickets dynamically, preventing SLA breaches.',
        whyNobodySolvedIt: 'Integration friction with legacy helpdesks.',
        businessModel: 'B2B Enterprise SaaS',
        market: '$4.5B TAM',
        aiRole: 'Live ticket sentiment and intent routing.',
        automationStrategy: 'CRM webhook synchronizers.',
        moat: 'Multi-connector support.',
        distributionStrategy: 'Salesforce and Zendesk app stores.',
        mvp: 'Live alerts routing.',
        risks: 'CRM API downtime.',
        technicalComplexity: 'Medium',
        estimatedBuildTime: '6-8 weeks',
        opportunityScore: 86,
        noveltyScore: 97,
        criticScore: 87,
        investorScore: 86,
        confidenceScore: 93
      }
    ];

    const solutions: Solution[] = [
      {
        id: 'sol-1',
        problemId: 'prob-1',
        currentProblem: 'Manual Compliance Logging & Audit Trail Compilation',
        recommendedSolution: 'Implement a semantic compliance monitor that processes communication webhooks and logs checklists.',
        implementationMethod: 'Utilize specialized compliance classifying models to flag non-compliant conversations and export audit logs.',
        suggestedTools: ['OpenAI API', 'Zapier Enterprise', 'AWS Lambda'],
        expectedBenefits: [
          'Reduces compliance audit compilation time by 90%',
          'Reduces risk of regulatory fines',
          'Ensures consistent team compliance tracking'
        ]
      },
      {
        id: 'sol-2',
        problemId: 'prob-2',
        currentProblem: 'Siloed Enterprise Document Search & Retrieval',
        recommendedSolution: 'Implement an enterprise search assistant using RAG indexing over cloud folders.',
        implementationMethod: 'Construct RAG indexing services via secure OAuth folder crawler scripts and a semantic chat UI.',
        suggestedTools: ['Pinecone', 'LangChain', 'LlamaIndex'],
        expectedBenefits: [
          'Reduces file search time by 80%',
          'Accelerates customer support reply times',
          'Facilitates rapid onboarding of new hires'
        ]
      },
      {
        id: 'sol-3',
        problemId: 'prob-3',
        currentProblem: 'Inefficient Support Ticket Routing & SLA Breach Risks',
        recommendedSolution: 'Connect helpdesk ticket receivers with active CRM client value endpoints.',
        implementationMethod: 'Read incoming tickets, query CRM contract parameters, and update the helpdesk priority tag.',
        suggestedTools: ['Salesforce API', 'Zendesk SDK', 'PagerDuty Webhooks'],
        expectedBenefits: [
          'Zero SLA breaches on high-value client accounts',
          'Ensures optimal support agent routing',
          'Improves B2B customer satisfaction'
        ]
      }
    ];

    return {
      problems,
      opportunities,
      startupIdeas,
      solutions
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
