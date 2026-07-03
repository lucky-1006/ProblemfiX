import axios from 'axios';
import { SearchProvider, SearchResult } from '../interfaces/SearchProvider';

export class SerperSearchProvider implements SearchProvider {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.SERPER_API_KEY || '';
  }

  async search(query: string): Promise<SearchResult[]> {
    if (!this.apiKey) {
      console.warn('SERPER_API_KEY is not defined. Returning mock search results.');
      return this.getMockResults(query);
    }

    try {
      const response = await axios.post('https://google.serper.dev/search', {
        q: query,
        num: 4
      }, {
        headers: {
          'X-API-KEY': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      if (response.data && Array.isArray(response.data.organic)) {
        return response.data.organic.map((item: any) => ({
          title: item.title || 'Search Result',
          snippet: item.snippet || '',
          url: item.link || ''
        }));
      }

      throw new Error('Invalid response structure from Serper');
    } catch (error: any) {
      console.error('Error querying Serper:', error.response?.data || error.message);
      throw new Error(`Serper search failed: ${error.response?.data?.message || error.message}`);
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
