import React, { useState, useRef, useEffect } from "react";
import { Cpu, ChevronDown, Check } from "lucide-react";

export interface AIModelOption {
  id: string;
  provider: "openai" | "groq" | "gemini";
  name: string;
  description: string;
  badge: string;
}

interface AIProviderSelectorProps {
  selectedModel: AIModelOption;
  onChange: (model: AIModelOption) => void;
}

export const modelsList: AIModelOption[] = [
  {
    id: "gpt-5.5",
    provider: "openai",
    name: "OpenAI GPT-5.5",
    description:
      "Primary reasoning model. Best for deep logic, complex coding structure, and market value analysis.",
    badge: "Reasoning",
  },
  {
    id: "llama-3.3-70b",
    provider: "groq",
    name: "Groq Llama 3.3 70B",
    description:
      "Ultra-fast open-source model. Excellent for structuring general industry summaries and problem sorting.",
    badge: "Fast Llama",
  },
  {
    id: "deepseek-r1",
    provider: "groq",
    name: "Groq DeepSeek R1",
    description:
      "Open-weights reasoning model. High performance for logic pathways, tech stack alignment, and roadmap generation.",
    badge: "Deep Reasoning",
  },
  {
    id: "gemini-2.5-flash",
    provider: "gemini",
    name: "Gemini 2.5 Flash",
    description:
      "Google next-gen lightweight model. Blazing fast, excellent for general web mining, structural extraction, and ideation.",
    badge: "Fast & Creative",
  },
];

export const AIProviderSelector: React.FC<AIProviderSelectorProps> = ({
  selectedModel,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-xl border border-border bg-card/65 hover:bg-card hover:border-text-muted/30 transition-all duration-200 text-sm font-medium text-text-primary"
      >
        <Cpu className="w-4 h-4 text-primary" />
        <span>{selectedModel.name}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-xl border border-border bg-zinc-950 shadow-2xl p-2 z-50 animate-fade-in origin-top-right">
          <div className="px-2 py-1.5 text-xs font-semibold text-text-muted border-b border-border mb-1">
            Choose AI Engine
          </div>
          <div className="space-y-1">
            {modelsList.map((model) => {
              const isSelected = model.id === selectedModel.id;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => {
                    onChange(model);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-2.5 rounded-lg flex items-start space-x-2.5 transition-colors
                    ${isSelected ? "bg-primary/10 text-text-primary" : "hover:bg-zinc-900 text-text-secondary hover:text-text-primary"}
                  `}
                >
                  <div
                    className={`mt-0.5 flex items-center justify-center w-4 h-4 rounded-full border text-[10px]
                    ${isSelected ? "bg-primary border-primary text-white" : "border-border text-transparent"}
                  `}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-text-primary">
                        {model.name}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded border font-medium
                        ${
                          model.provider === "openai"
                            ? "border-indigo-500/25 bg-indigo-500/5 text-indigo-400"
                            : model.provider === "gemini"
                              ? "border-success/25 bg-success/5 text-success"
                              : "border-purple-500/25 bg-purple-500/5 text-purple-400"
                        }
                      `}
                      >
                        {model.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-text-secondary mt-1 leading-normal">
                      {model.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
