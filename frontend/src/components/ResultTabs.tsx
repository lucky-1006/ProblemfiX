import React from "react";
import {
  AlertCircle,
  Radar,
  Lightbulb,
  CheckSquare,
  Settings,
} from "lucide-react";

export type TabId = "problems" | "radar" | "ideas" | "solutions" | "blueprints";

interface ResultTabsProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
}

export const ResultTabs: React.FC<ResultTabsProps> = ({
  activeTab,
  onChangeTab,
}) => {
  const tabs = [
    { id: "problems", label: "Top Problems", icon: AlertCircle },
    { id: "radar", label: "Opportunity Radar", icon: Radar },
    { id: "ideas", label: "Startup Ideas", icon: Lightbulb },
    { id: "solutions", label: "Solutions", icon: CheckSquare },
    { id: "blueprints", label: "Build Blueprint", icon: Settings },
  ] as const;

  return (
    <div className="w-full border-b border-border bg-background/40 backdrop-blur-md sticky top-0 z-40 mb-8 overflow-x-auto">
      <div className="max-w-6xl mx-auto flex items-center justify-start space-x-1 px-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-3 border-b-2 text-sm font-semibold transition-all duration-200 whitespace-nowrap outline-none
                ${
                  isActive
                    ? "border-primary text-primary text-glow-indigo font-bold"
                    : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
                }
              `}
            >
              <Icon
                className={`w-4 h-4 ${isActive ? "text-primary" : "text-text-muted"}`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
