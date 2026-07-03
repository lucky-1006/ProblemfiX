import axios from 'axios';
import { SearchProvider, SearchResult } from '../interfaces/SearchProvider';

export class TavilySearchProvider implements SearchProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.TAVILY_API_KEY || '';
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!this.apiKey) {
      console.warn('TAVILY_API_KEY is not defined. Returning mock search results.');
      return this.getMockResults(query);
    }

    try {
      const response = await axios.post('https://api.tavily.com/search', {
        api_key: this.apiKey,
        query: query,
        search_depth: 'basic',
        max_results: 4
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data.results)) {
        return response.data.results.map((item: any) => ({
          title: item.title || 'Search Result',
          snippet: item.content || item.snippet || '',
          url: item.url || ''
        }));
      }

      throw new Error('Invalid response structure from Tavily');
    } catch (error: any) {
      console.error('Error querying Tavily:', error.response?.data || error.message);
      throw new Error(`Tavily search failed: ${error.response?.data?.detail || error.message}`);
    }
  }

  private getMockResults(query: string): SearchResult[] {
    console.log(`Generating mock search results for: "${query}"`);
    return [
      {
        title: `Top complaints in ${query}`,
        snippet: `Users are extremely frustrated with the manual efforts, high latency, and repetitive workflow when managing tasks in this industry. Existing solutions are too complex and expensive.`,
        url: 'https://reddit.com/r/startup/comments/complaints'
      },
      {
        title: `What is the biggest problem in ${query}?`,
        snippet: `The main pain points center around poor customer experience, inefficient queue routing, and a lack of automation for recurring questions. Support representatives waste 4 hours daily on repetitive tasks.`,
        url: 'https://news.ycombinator.com/item?id=3840192'
      },
      {
        title: `${query} tools review and comparison`,
        snippet: `Most software tools currently serving this niche feel outdated, lack modern AI assistance, and require significant manual setup. Businesses are looking for immediate, out-of-the-box automation.`,
        url: 'https://g2.com/categories/software-reviews'
      }
    ];
  }
}
