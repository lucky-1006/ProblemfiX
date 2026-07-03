import React from "react";
import { HelpCircle, ShieldCheck, CheckCircle2 } from "lucide-react";

interface Solution {
  id: string;
  problemId: string;
  currentProblem: string;
  recommendedSolution: string;
  implementationMethod: string;
  suggestedTools: string[];
  expectedBenefits: string[];
}

interface SolutionCardProps {
  solution: Solution;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution }) => {
  return (
    <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-glow-success duration-300">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-success/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-success/10 text-success border border-success/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold font-sans text-text-primary tracking-tight group-hover:text-success transition-colors">
            Recommended AI Solution
          </h4>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Current Problem vs Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-surface/50 border border-border/30 rounded-xl p-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-1">
              <HelpCircle className="w-3 h-3 text-warning mr-1" />
              <span>Current Problem</span>
            </span>
            <p className="text-xs text-text-secondary leading-relaxed">
              {solution.currentProblem}
            </p>
          </div>

          <div className="bg-success/5 border border-success/20 rounded-xl p-3">
            <span className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center mb-1">
              <CheckCircle2 className="w-3 h-3 text-success mr-1" />
              <span>Recommended Solution</span>
            </span>
            <p className="text-xs text-text-primary font-medium leading-relaxed">
              {solution.recommendedSolution}
            </p>
          </div>
        </div>

        {/* Implementation Method */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">
            Implementation Method
          </span>
          <p className="text-xs text-text-secondary mt-1.5 leading-relaxed bg-surface/30 p-3 rounded-lg border border-border/20">
            {solution.implementationMethod}
          </p>
        </div>

        {/* Suggested Tools */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">
            Suggested Tools & Frameworks
          </span>
          <div className="flex flex-wrap gap-1.5">
            {solution.suggestedTools.map((tool, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-lg border border-border bg-surface text-text-secondary hover:text-text-primary hover:border-text-muted/30 transition-colors"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Expected Benefits */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block mb-2">
            Expected Benefits
          </span>
          <ul className="space-y-1.5 text-xs text-text-secondary">
            {solution.expectedBenefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-success mr-2 font-bold select-none">
                  ✓
                </span>
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
