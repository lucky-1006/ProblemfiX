import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Layers,
  Cable,
  Database,
  Route,
} from "lucide-react";

interface StartupIdea {
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
}

interface BlueprintCardProps {
  idea: StartupIdea;
}

export const BlueprintCard: React.FC<BlueprintCardProps> = ({ idea }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="glassmorphism-card rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300">
      {/* Collapsed Top Header (Always Visible) */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left p-6 flex items-start justify-between hover:bg-card/30 transition-colors relative z-10"
      >
        <div className="flex-1 pr-4">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 rounded border border-primary/20 bg-primary/5 text-primary font-semibold uppercase tracking-wider">
              Blueprint
            </span>
            <h4 className="text-lg font-bold font-sans text-text-primary group-hover:text-primary">
              {idea.name}
            </h4>
          </div>
          <p className="text-sm font-semibold text-text-primary mt-2 text-glow-indigo">
            "{idea.landingPageHeadline}"
          </p>
          <p className="text-xs text-text-secondary mt-1.5 line-clamp-1">
            {idea.valueProposition}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1 flex items-center justify-center w-8 h-8 rounded-full border border-border bg-surface text-text-secondary">
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      <div
        className={`transition-all duration-500 ease-in-out border-t border-border/40 bg-surface/20
          ${isExpanded ? "max-h-[1500px] opacity-100 p-6" : "max-h-0 opacity-0 overflow-hidden"}
        `}
      >
        <div className="space-y-6">
          {/* Target Customers */}
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
              Core Target Customers
            </span>
            <p className="text-xs text-text-primary mt-1 font-medium">
              {idea.targetCustomers}
            </p>
          </div>

          {/* Core Technical Specifications Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tech Stack */}
            <div className="bg-surface/60 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-2.5">
                <Layers className="w-3.5 h-3.5 text-primary mr-1.5" />
                <span>Tech Stack</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {idea.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-0.5 rounded border border-border bg-card text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommended APIs */}
            <div className="bg-surface/60 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-2.5">
                <Cable className="w-3.5 h-3.5 text-accent mr-1.5" />
                <span>API Integrations</span>
              </span>
              <div className="flex flex-wrap gap-1">
                {idea.apiSuggestions.map((api, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] px-2 py-0.5 rounded border border-border bg-card text-text-secondary"
                  >
                    {api}
                  </span>
                ))}
              </div>
            </div>

            {/* Database recommendation */}
            <div className="bg-surface/60 border border-border/40 rounded-xl p-4">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-2">
                <Database className="w-3.5 h-3.5 text-success mr-1.5" />
                <span>Recommended Database</span>
              </span>
              <p className="text-xs text-text-secondary font-medium leading-relaxed mt-1">
                {idea.databaseRecommendation}
              </p>
            </div>
          </div>

          {/* Development Roadmap */}
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-3">
              <Route className="w-4 h-4 text-primary mr-1.5" />
              <span>4-Phase Development Roadmap</span>
            </span>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {idea.developmentRoadmap.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-card/40 border border-border/30 rounded-xl p-3 text-xs relative"
                >
                  <div className="absolute top-2 right-2 text-[10px] font-bold text-primary/30">
                    Phase {idx + 1}
                  </div>
                  <span className="font-bold text-text-primary block mb-1">
                    {idx === 0 && "🔬 Inception"}
                    {idx === 1 && "🛠️ MVP Build"}
                    {idx === 2 && "🔌 Integration"}
                    {idx === 3 && "🚀 Launch"}
                  </span>
                  <p className="text-[11px] text-text-secondary leading-normal mt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* MVP Core Features checklist */}
          <div>
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">
              MVP Core Deliverables Checklist
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              {idea.mvpFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2 text-text-secondary"
                >
                  <div className="flex-shrink-0 w-4 h-4 rounded border border-border bg-surface flex items-center justify-center text-[10px] text-primary font-bold">
                    ✓
                  </div>
                  <span className="truncate">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
