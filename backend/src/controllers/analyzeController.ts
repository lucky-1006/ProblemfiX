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
    let aiProvider: AIProvider;

    if (aiProviderType === 'groq') {
      aiProvider = new GroqProvider();
    } else if (aiProviderType === 'gemini') {
      aiProvider = new GeminiProvider();
    } else {
      aiProvider = new OpenAIProvider();
    }

    console.log(`[Backend] Invoking AI Provider: "${aiProviderType}" (model: ${model || 'default'})`);
    const analysis = await aiProvider.analyze(industry.trim(), searchResults, model);

    return res.json(analysis);
  } catch (error: any) {
    console.error('[Backend] Controller Error:', error);
    return res.status(500).json({
      error: 'Analysis Failed',
      message: error.message || 'An unexpected error occurred during analysis.'
    });
  }
};
