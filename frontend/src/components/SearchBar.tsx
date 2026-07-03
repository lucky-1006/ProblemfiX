import React, { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { AIProviderSelector, AIModelOption } from "./AIProviderSelector";

interface SearchBarProps {
  onSearch: (query: string, model: AIModelOption) => void;
  isLoading: boolean;
  selectedModel: AIModelOption;
  onModelChange: (model: AIModelOption) => void;
  initialValue?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isLoading,
  selectedModel,
  onModelChange,
  initialValue = "",
}) => {
  const [query, setQuery] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim(), selectedModel);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto animate-slide-up"
    >
      <div className="relative flex flex-col md:flex-row items-stretch md:items-center space-y-2 md:space-y-0 md:space-x-2 p-1.5 rounded-2xl border border-border bg-card/40 backdrop-blur-md focus-within:border-primary/50 focus-within:shadow-glow-primary transition-all duration-300">
        {/* Search Icon & Input */}
        <div className="flex-1 flex items-center px-3 py-2 md:py-0">
          <Search className="w-5 h-5 text-text-muted mr-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search industry or niche (e.g., Healthcare, Marketing, Cybersecurity)..."
            className="w-full bg-transparent border-none outline-none text-text-primary placeholder:text-text-muted text-sm"
            disabled={isLoading}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between px-3 md:px-0 py-1.5 md:py-0 border-t md:border-t-0 md:border-l border-border md:pl-2 space-x-2">
          <AIProviderSelector
            selectedModel={selectedModel}
            onChange={onModelChange}
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`flex items-center justify-center space-x-1.5 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
              ${
                isLoading || !query.trim()
                  ? "bg-card border border-border text-text-muted cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover shadow-glow-primary active:scale-[0.98]"
              }
            `}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
