import { useState, useEffect } from "react";
import axios from "axios";
import {
  Radar,
  RefreshCw,
  AlertCircle,
  ArrowLeft,
  Clock,
  BookOpen,
} from "lucide-react";
import { SearchBar } from "./components/SearchBar";
import { AIModelOption, modelsList } from "./components/AIProviderSelector";
import { EmptyState } from "./components/EmptyState";
import { LoadingState } from "./components/LoadingState";
import { ResultTabs, TabId } from "./components/ResultTabs";
import { ProblemCard } from "./components/ProblemCard";
import { OpportunityTable } from "./components/OpportunityTable";
import { StartupCard } from "./components/StartupCard";
import { SolutionCard } from "./components/SolutionCard";
import { BlueprintCard } from "./components/BlueprintCard";

// Set axios base URL from environment variable for Render backend compatibility
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "";

// Define Analysis Result Schema matching backend
interface AnalysisResult {
  problems: Array<{ id: string; problem: string; description: string }>;
  opportunities: Array<{
    id: string;
    problemId: string;
    problem: string;
    impactScore: number;
    frequencyScore: number;
    automationPotential: number;
    opportunityScore: number;
  }>;
  startupIdeas: Array<{
    id: string;
    problemId: string;
    name: string;
    problemStatement: string;
    targetCustomers: string;
    valueProposition: string;
    revenueModel: string;
    mvpFeatures: string[];
    landingPageHeadline: string;
    techStack: string[];
    apiSuggestions: string[];
    databaseRecommendation: string;
    developmentRoadmap: string[];
  }>;
  solutions: Array<{
    id: string;
    problemId: string;
    currentProblem: string;
    recommendedSolution: string;
    implementationMethod: string;
    suggestedTools: string[];
    expectedBenefits: string[];
  }>;
}

export default function App() {
  const [selectedModel, setSelectedModel] = useState<AIModelOption>(
    modelsList[0],
  );
  const [industry, setIndustry] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("problems");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<{ title: string; message: string } | null>(
    null,
  );

  // Recent search cache loaded from localStorage
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("problemfix_recent_searches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read recent searches from localStorage", e);
    }
  }, []);

  const saveRecentSearch = (term: string) => {
    const cleaned = term.trim();
    if (!cleaned) return;
    const updated = [
      cleaned,
      ...recentSearches.filter(
        (s) => s.toLowerCase() !== cleaned.toLowerCase(),
      ),
    ].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("problemfix_recent_searches", JSON.stringify(updated));
  };

  const handleClearHistory = () => {
    setRecentSearches([]);
    localStorage.removeItem("problemfix_recent_searches");
  };

  const handleAnalyze = async (searchQuery: string, model: AIModelOption) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIndustry(searchQuery);

    try {
      const response = await axios.post(
        "/api/analyze",
        {
          industry: searchQuery,
          provider: model.provider,
          model: model.id,
        },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 95000, // 95 seconds timeout for high-reasoning LLMs
        },
      );

      if (response.data && response.data.problems) {
        setResult(response.data);
        setActiveTab("problems"); // Reset to default view
        saveRecentSearch(searchQuery);
      } else {
        throw new Error("Response is missing problems list");
      }
    } catch (err: any) {
      console.error("Analysis failed:", err);
      const isTimeout = err.code === "ECONNABORTED";
      setError({
        title: isTimeout ? "Server Timeout" : "Analysis Failed",
        message:
          err.response?.data?.message ||
          err.message ||
          "An unexpected error occurred while communicating with the intelligence backend. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectIndustryFromSuggestions = (selected: string) => {
    handleAnalyze(selected, selectedModel);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Banner Header */}
      <header className="border-b border-border bg-surface/20 backdrop-blur-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            onClick={() => {
              if (!isLoading) {
                setResult(null);
                setError(null);
              }
            }}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:bg-primary/40 transition-colors"></div>
              <div className="relative w-8 h-8 rounded-lg bg-card border border-border flex items-center justify-center text-primary group-hover:text-white transition-colors">
                <Radar className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white font-sans group-hover:text-primary transition-colors">
                ProblemfiX{" "}
                <span className="text-primary group-hover:text-white transition-colors">
                  AI
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors flex items-center space-x-1"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        {/* VIEW 1: Home View (No Search Done & Not Loading) */}
        {!result && !isLoading && !error && (
          <div className="py-8 md:py-16">
            {/* Hero Text */}
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold font-sans text-gradient tracking-tight">
                ProblemfiX AI
              </h1>
              <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto leading-relaxed">
                Discover startup opportunities from real-world problems.
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="mb-6 relative z-50">
              <SearchBar
                onSearch={handleAnalyze}
                isLoading={isLoading}
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
              />
            </div>

            {/* Recent Searches Panel */}
            {recentSearches.length > 0 && (
              <div className="max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-2 mb-10 text-xs animate-fade-in">
                <span className="text-text-muted flex items-center mr-1">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  <span>Recent scans:</span>
                </span>
                {recentSearches.map((term, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnalyze(term, selectedModel)}
                    className="px-2.5 py-1 rounded-lg border border-border bg-card/40 hover:bg-card hover:border-primary/50 text-text-secondary hover:text-text-primary transition-all text-[11px]"
                  >
                    {term}
                  </button>
                ))}
                <button
                  onClick={handleClearHistory}
                  className="text-text-muted hover:text-warning text-[10px] underline ml-1 cursor-pointer"
                >
                  Clear History
                </button>
              </div>
            )}

            {/* Quick Suggestions grid */}
            <EmptyState
              onSelectIndustry={handleSelectIndustryFromSuggestions}
            />
          </div>
        )}

        {/* VIEW 2: Loading State */}
        {isLoading && (
          <div className="py-12">
            <LoadingState industry={industry} />
          </div>
        )}

        {/* VIEW 3: Error Panel */}
        {error && (
          <div className="max-w-xl mx-auto py-12 animate-fade-in">
            <div className="border border-warning/30 bg-warning/5 rounded-2xl p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 rounded-full bg-warning/10 text-warning flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-primary font-sans">
                  {error.title}
                </h3>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {error.message}
                </p>
              </div>
              <div className="pt-2 flex justify-center space-x-3">
                <button
                  onClick={() => handleAnalyze(industry, selectedModel)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Scan</span>
                </button>
                <button
                  onClick={() => {
                    setError(null);
                    setResult(null);
                  }}
                  className="px-4 py-2 border border-border bg-card text-xs font-semibold text-text-secondary rounded-lg hover:text-text-primary transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Results Dashboard */}
        {result && !isLoading && !error && (
          <div className="animate-fade-in">
            {/* Header controls inside result panel */}
            <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-border/80 mb-6 gap-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setResult(null);
                  }}
                  className="flex items-center justify-center w-8 h-8 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:border-text-muted/30 transition-all"
                  title="Run new scan"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                      Active Scan
                    </span>
                    <span className="text-xs text-text-muted">•</span>
                    <span className="text-[10px] uppercase font-bold text-text-muted">
                      {selectedModel.name}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold font-sans text-text-primary tracking-tight">
                    Opportunity Analysis:{" "}
                    <span className="text-primary">"{industry}"</span>
                  </h2>
                </div>
              </div>

              {/* Inline query re-trigger */}
              <div className="w-full md:w-auto min-w-[280px] relative z-50">
                <SearchBar
                  onSearch={handleAnalyze}
                  isLoading={isLoading}
                  selectedModel={selectedModel}
                  onModelChange={setSelectedModel}
                  initialValue={industry}
                />
              </div>
            </div>

            {/* Dashboard Tabs Selection */}
            <ResultTabs activeTab={activeTab} onChangeTab={setActiveTab} />

            {/* Tab Panes */}
            <div className="w-full">
              {/* Tab 1: Top Problems */}
              {activeTab === "problems" && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <h3 className="text-lg font-bold font-sans text-text-primary">
                      Discovered Pain Points
                    </h3>
                    <p className="text-xs text-text-secondary">
                      The following problems were extracted from web boards and
                      analyzed by our AI model.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.problems.map((prob) => {
                      const opp = result.opportunities.find(
                        (o) => o.problemId === prob.id,
                      );
                      return (
                        <ProblemCard
                          key={prob.id}
                          problem={prob}
                          opportunity={opp}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Opportunity Radar Table */}
              {activeTab === "radar" && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <h3 className="text-lg font-bold font-sans text-text-primary">
                      Opportunity Score Breakdown
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Opportunities are ranked by combining impact severity,
                      occurrence frequency, and AI automation feasibility.
                    </p>
                  </div>
                  <OpportunityTable opportunities={result.opportunities} />
                </div>
              )}

              {/* Tab 3: Startup Ideas */}
              {activeTab === "ideas" && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <h3 className="text-lg font-bold font-sans text-text-primary">
                      AI Generated Startup Concepts
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Potential startup concepts tailored specifically to
                      address the discovered pain points.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {result.startupIdeas.map((idea) => (
                      <StartupCard key={idea.id} idea={idea} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Solution Recommendations */}
              {activeTab === "solutions" && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <h3 className="text-lg font-bold font-sans text-text-primary">
                      Practical Implementations
                    </h3>
                    <p className="text-xs text-text-secondary">
                      Technical solution methods, recommended tools, and
                      business benefits to execute immediately.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {result.solutions.map((sol) => (
                      <SolutionCard key={sol.id} solution={sol} />
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Build Blueprint (Expandable Cards) */}
              {activeTab === "blueprints" && (
                <div className="space-y-4">
                  <div className="flex flex-col space-y-1 mb-4">
                    <h3 className="text-lg font-bold font-sans text-text-primary">
                      Startup Architectural Blueprints
                    </h3>
                    <p className="text-xs text-text-secondary font-medium">
                      Expand the cards below to unlock complete landing page
                      headlines, API requirements, tech stack tags, and the
                      development roadmap.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {result.startupIdeas.map((idea) => (
                      <BlueprintCard key={idea.id} idea={idea} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-surface/40 py-6 px-6 text-center text-xs text-text-muted">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>
            © {new Date().getFullYear()} ProblemfiX AI. All analysis is stored
            in-memory.
          </p>
          <div className="flex space-x-4">
            <span className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              Terms
            </span>
            <span className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              Privacy
            </span>
            <span className="text-text-muted hover:text-text-primary transition-colors cursor-pointer">
              Contact
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
