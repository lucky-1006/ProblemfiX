import React from "react";
import { AlertCircle, Flame, Clock, Cpu } from "lucide-react";

interface ProblemCardProps {
  problem: {
    id: string;
    problem: string;
    description: string;
  };
  opportunity?: {
    impactScore: number;
    frequencyScore: number;
    automationPotential: number;
    opportunityScore: number;
  };
}

export const ProblemCard: React.FC<ProblemCardProps> = ({
  problem,
  opportunity,
}) => {
  const score = opportunity?.opportunityScore ?? 0;

  const getScoreColor = (val: number) => {
    if (val >= 85) return "text-success border-success/30 bg-success/5";
    if (val >= 70) return "text-primary border-primary/30 bg-primary/5";
    return "text-warning border-warning/30 bg-warning/5";
  };

  return (
    <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-glow-primary duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-start space-x-3 max-w-[78%]">
          <div className="mt-1 flex-shrink-0 p-2 rounded-xl bg-warning/10 text-warning border border-warning/20">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-text-primary tracking-tight group-hover:text-primary transition-colors">
              {problem.problem}
            </h4>
            <p className="text-xs text-text-secondary mt-2 leading-relaxed">
              {problem.description}
            </p>
          </div>
        </div>

        {/* Opportunity Score Indicator */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">
            Opportunity
          </span>
          <div
            className={`mt-1 flex items-center justify-center px-3 py-1.5 rounded-xl border text-sm font-bold font-sans ${getScoreColor(score)}`}
          >
            {score}
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      {opportunity && (
        <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-border relative z-10 text-xs">
          <div className="flex items-center space-x-1.5 text-text-secondary bg-surface/50 p-2 rounded-lg border border-border/30">
            <Flame className="w-3.5 h-3.5 text-warning" />
            <div>
              <span className="text-[10px] text-text-muted block uppercase">
                Impact
              </span>
              <span className="font-semibold text-text-primary">
                {opportunity.impactScore}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-text-secondary bg-surface/50 p-2 rounded-lg border border-border/30">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <div>
              <span className="text-[10px] text-text-muted block uppercase">
                Frequency
              </span>
              <span className="font-semibold text-text-primary">
                {opportunity.frequencyScore}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1.5 text-text-secondary bg-surface/50 p-2 rounded-lg border border-border/30">
            <Cpu className="w-3.5 h-3.5 text-success" />
            <div>
              <span className="text-[10px] text-text-muted block uppercase">
                Automation
              </span>
              <span className="font-semibold text-text-primary">
                {opportunity.automationPotential}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
