import { Request, Response } from 'express';
import { TavilySearchProvider } from '../services/TavilySearchProvider';
import { SerperSearchProvider } from '../services/SerperSearchProvider';
import { OpenAIProvider } from '../services/OpenAIProvider';
import { GroqProvider } from '../services/GroqProvider';
import { GeminiProvider } from '../services/GeminiProvider';
import { SearchProvider, SearchResult } from '../interfaces/SearchProvider';
import { AIProvider } from '../interfaces/AIProvider';

export const analyzeIndustry = async (req: Request, res: Response) => {
  try {
    const { industry, provider, model } = req.body;

    if (!industry || typeof industry !== 'string' || !industry.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Industry search term is required and must be a non-empty string.'
      });
    }

    const searchProviderType = (process.env.SEARCH_PROVIDER || 'tavily').toLowerCase().trim();
    let searchProvider: SearchProvider;

    if (searchProviderType === 'serper') {
      searchProvider = new SerperSearchProvider();
    } else {
      searchProvider = new TavilySearchProvider();
    }

    // Run search for pain points and inefficiencies
    const searchQuery = `${industry.trim()} complaints pain points frustrations inefficiencies repetitive work`;
    console.log(`[Backend] Searching using: "${searchProviderType}" with query: "${searchQuery}"`);
    
    let searchResults: SearchResult[] = [];
    try {
      searchResults = await searchProvider.search(searchQuery);
    } catch (searchError: any) {
      console.error('[Backend] Search execution failed:', searchError.message);
      // Fail-safe is already handled within providers, but just in case:
      searchResults = [];
    }

    // Select AI Provider
    const aiProviderType = (provider || 'openai').toLowerCase().trim();

    const providersToTry: { name: string; getProvider: () => AIProvider }[] = [];
    
    // First, try the user selected provider
    if (aiProviderType === 'groq') {
      providersToTry.push({ name: 'groq', getProvider: () => new GroqProvider() });
    } else if (aiProviderType === 'gemini') {
      providersToTry.push({ name: 'gemini', getProvider: () => new GeminiProvider() });
    } else {
      providersToTry.push({ name: 'openai', getProvider: () => new OpenAIProvider() });
    }

    // Then, append other configured providers as fallbacks
    if (aiProviderType !== 'gemini' && process.env.GEMINI_API_KEY) {
      providersToTry.push({ name: 'gemini', getProvider: () => new GeminiProvider() });
    }
    if (aiProviderType !== 'openai' && process.env.OPENAI_API_KEY) {
      providersToTry.push({ name: 'openai', getProvider: () => new OpenAIProvider() });
    }
    if (aiProviderType !== 'groq' && process.env.GROQ_API_KEY) {
      providersToTry.push({ name: 'groq', getProvider: () => new GroqProvider() });
    }

    let lastError: any = null;

    for (const prov of providersToTry) {
      try {
        const modelToUse = prov.name === aiProviderType ? model : undefined;
        console.log(`[Backend] Invoking AI Provider: "${prov.name}" (model: ${modelToUse || 'default'})`);
        const providerInstance = prov.getProvider();
        const analysis = await providerInstance.analyze(industry.trim(), searchResults, modelToUse);
        if (analysis) {
          return res.json(analysis);
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`[Backend] AI Provider "${prov.name}" failed: ${err.message}`);
      }
    }

    // If all real API calls failed, gracefully fall back to Simulation Mode (mock analysis)
    console.warn(`[Backend] All real AI providers failed or were not configured. Falling back to Simulation Mode.`);
    const fallbackProvider = providersToTry[0].getProvider();
    const mockAnalysis = fallbackProvider.getMockAnalysis(industry.trim());
    return res.json(mockAnalysis);
  } catch (error: any) {
    console.error('[Backend] Controller Error:', error);
    return res.status(500).json({
      error: 'Analysis Failed',
      message: error.message || 'An unexpected error occurred during analysis.'
    });
  }
};
