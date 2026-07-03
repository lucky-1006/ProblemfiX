import React from "react";
import { Radar } from "lucide-react";

interface EmptyStateProps {
  onSelectIndustry: (industry: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectIndustry }) => {
  const suggestions = [
    {
      title: "Marketing",
      desc: "Ad waste, social algorithms, content fatigue",
      emoji: "📢",
    },
    {
      title: "Healthcare",
      desc: "Clinical documentation, billing, shift scheduling",
      emoji: "🏥",
    },
    {
      title: "Education",
      desc: "Student engagement, grading workloads, curriculum prep",
      emoji: "🎓",
    },
    {
      title: "Cybersecurity",
      desc: "Alert fatigue, employee phishing, credentials storage",
      emoji: "🔒",
    },
    {
      title: "Customer Support",
      desc: "Repetitive tickets, slow responses, SLA tracking",
      emoji: "💬",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-2xl mx-auto text-center animate-fade-in">
      <div className="relative mb-6">
        <div className="absolute inset-0 rounded-full bg-primary/10 blur-lg animate-pulse-glow"></div>
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full border border-border bg-card/40">
          <Radar
            className="w-8 h-8 text-primary animate-spin"
            style={{ animationDuration: "6s" }}
          />
        </div>
      </div>

      <h3 className="text-2xl font-bold font-sans text-text-primary tracking-tight mb-2">
        No active scan results
      </h3>
      <p className="text-text-secondary text-sm max-w-md mb-10">
        Enter an industry, niche, or topic in the search bar above. We will scan
        discussions and boards to discover problems worth solving.
      </p>

      <div className="w-full text-left">
        <span className="text-xs font-semibold text-text-muted tracking-wider uppercase mb-3 block">
          Suggested Industries
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {suggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => onSelectIndustry(item.title)}
              className="flex items-start p-4 rounded-xl border border-border bg-card/30 hover:bg-card/80 hover:border-primary/40 hover:shadow-glow-primary transition-all duration-300 group text-left"
            >
              <div className="text-2xl mr-3">{item.emoji}</div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-text-secondary mt-0.5 line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
