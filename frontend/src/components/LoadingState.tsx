import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  BrainCircuit,
  Sparkles,
  Rocket,
} from "lucide-react";

interface LoadingStateProps {
  industry: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ industry }) => {
  const [step, setStep] = useState(0);
  const steps = [
    {
      label: `Scanning web discussions for "${industry}"...`,
      icon: Search,
      color: "text-primary",
    },
    {
      label: "Extracting complaints and negative customer reviews...",
      icon: ShieldAlert,
      color: "text-warning",
    },
    {
      label: "Scoring opportunity automation potentials...",
      icon: BrainCircuit,
      color: "text-accent",
    },
    {
      label: "Generating MVP feature roadmaps and blueprints...",
      icon: Sparkles,
      color: "text-success",
    },
    {
      label: "Finalizing startup recommendations...",
      icon: Rocket,
      color: "text-primary",
    },
  ];

  useEffect(() => {
    const intervals = [2500, 3000, 3000, 3000];
    let currentStep = 0;

    const runNext = () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        setStep(currentStep);
        timer = setTimeout(runNext, intervals[currentStep - 1] || 2500);
      }
    };

    let timer = setTimeout(runNext, intervals[0]);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 max-w-lg mx-auto text-center animate-fade-in">
      {/* Animated Glowing Ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent blur-xl opacity-30 animate-pulse-glow"></div>
        <div className="relative flex items-center justify-center w-24 h-24 rounded-full border border-border bg-card/60 backdrop-blur-md">
          {(() => {
            const ActiveIcon = steps[step].icon;
            return (
              <ActiveIcon
                className={`w-10 h-10 animate-bounce ${steps[step].color}`}
              />
            );
          })()}
        </div>
      </div>

      <h3 className="text-xl font-bold font-sans text-text-primary mb-2">
        Analyzing Opportunities
      </h3>
      <p className="text-sm text-text-secondary mb-8">
        Mining the web and running reasoning models on{" "}
        <span className="text-primary font-semibold">"{industry}"</span>.
      </p>

      {/* Progress Steps Timeline */}
      <div className="w-full space-y-4 bg-card/40 border border-border rounded-xl p-6 backdrop-blur-md text-left">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isDone = idx < step;
          const isActive = idx === step;
          const isPending = idx > step;

          return (
            <div
              key={idx}
              className="flex items-center space-x-3 transition-opacity duration-300"
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border text-xs font-semibold
                ${isDone ? "bg-success/20 border-success text-success" : ""}
                ${isActive ? "bg-primary/20 border-primary text-primary animate-pulse" : ""}
                ${isPending ? "bg-surface border-border text-text-muted" : ""}
              `}
              >
                {isDone ? "✓" : <Icon className="w-3 h-3" />}
              </div>
              <span
                className={`text-sm font-medium
                ${isDone ? "text-text-secondary line-through opacity-60" : ""}
                ${isActive ? "text-text-primary" : ""}
                ${isPending ? "text-text-muted" : ""}
              `}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
