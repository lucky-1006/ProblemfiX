import React from "react";
import {
  Target,
  Shield,
  CheckCircle,
  DollarSign,
  ListTodo,
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
}

interface StartupCardProps {
  idea: StartupIdea;
}

export const StartupCard: React.FC<StartupCardProps> = ({ idea }) => {
  return (
    <div className="glassmorphism-card rounded-2xl p-6 relative overflow-hidden group hover:shadow-glow-accent duration-300">
      {/* Decorative background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="flex items-center justify-between border-b border-border/60 pb-4 mb-4 relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-accent/10 text-accent border border-accent/20">
            <LightbulbIcon className="w-5 h-5" />
          </div>
          <h4 className="text-lg font-bold font-sans text-text-primary tracking-tight group-hover:text-accent transition-colors">
            {idea.name}
          </h4>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded border border-accent/20 bg-accent/5 text-accent font-semibold uppercase tracking-wider">
          Idea
        </span>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Problem Statement */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center">
            <Shield className="w-3 h-3 text-warning mr-1" />
            <span>Problem Statement</span>
          </span>
          <p className="text-xs text-text-secondary mt-1 leading-relaxed">
            {idea.problemStatement}
          </p>
        </div>

        {/* Value Proposition */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center">
            <CheckCircle className="w-3 h-3 text-success mr-1" />
            <span>Value Proposition</span>
          </span>
          <p className="text-xs text-text-primary mt-1 font-medium leading-relaxed">
            {idea.valueProposition}
          </p>
        </div>

        {/* Target Customers and Revenue Model in Grid */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-surface/50 border border-border/30 rounded-xl p-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-1">
              <Target className="w-3.5 h-3.5 text-primary mr-1" />
              <span>Target Customers</span>
            </span>
            <span className="text-xs text-text-secondary font-medium leading-normal block">
              {idea.targetCustomers}
            </span>
          </div>

          <div className="bg-surface/50 border border-border/30 rounded-xl p-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-1">
              <DollarSign className="w-3.5 h-3.5 text-success mr-1" />
              <span>Revenue Model</span>
            </span>
            <span className="text-xs text-text-secondary font-medium leading-normal block">
              {idea.revenueModel}
            </span>
          </div>
        </div>

        {/* MVP Features */}
        <div>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center mb-2">
            <ListTodo className="w-3 h-3 text-accent mr-1" />
            <span>MVP Features</span>
          </span>
          <ul className="grid grid-cols-1 gap-1.5 text-xs text-text-secondary">
            {idea.mvpFeatures.map((feat, idx) => (
              <li key={idx} className="flex items-start">
                <span className="text-accent font-bold mr-2 select-none">
                  •
                </span>
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Internal lightbulb icon mapping
const LightbulbIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);
