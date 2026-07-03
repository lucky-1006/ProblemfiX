import React from "react";
import { ArrowDown, Flame, Clock, Cpu, Award } from "lucide-react";

interface OpportunityRow {
  id: string;
  problemId: string;
  problem: string;
  impactScore: number;
  frequencyScore: number;
  automationPotential: number;
  opportunityScore: number;
}

interface OpportunityTableProps {
  opportunities: OpportunityRow[];
}

export const OpportunityTable: React.FC<OpportunityTableProps> = ({
  opportunities,
}) => {
  // Sort by Opportunity Score descending
  const sorted = [...opportunities].sort(
    (a, b) => b.opportunityScore - a.opportunityScore,
  );

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-success";
    if (score >= 70) return "bg-primary";
    return "bg-warning";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "text-success bg-success/10 border-success/20";
    if (score >= 70) return "text-primary bg-primary/10 border-primary/20";
    return "text-warning bg-warning/10 border-warning/20";
  };

  return (
    <div className="w-full bg-card/20 border border-border rounded-2xl overflow-hidden backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-card/60 text-xs font-semibold text-text-secondary uppercase tracking-wider">
              <th className="py-4 px-6 min-w-[250px]">Problem Description</th>
              <th className="py-4 px-4 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-warning" />
                  <span>Impact</span>
                </span>
              </th>
              <th className="py-4 px-4 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Frequency</span>
                </span>
              </th>
              <th className="py-4 px-4 text-center">
                <span className="flex items-center justify-center space-x-1">
                  <Cpu className="w-3.5 h-3.5 text-success" />
                  <span>Automation</span>
                </span>
              </th>
              <th className="py-4 px-6 text-center min-w-[150px]">
                <span className="flex items-center justify-center space-x-1 font-bold text-text-primary">
                  <Award className="w-3.5 h-3.5 text-accent" />
                  <span>Opportunity</span>
                  <ArrowDown className="w-3.5 h-3.5 text-primary" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-sm">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-text-muted">
                  No opportunity metrics available.
                </td>
              </tr>
            ) : (
              sorted.map((row, idx) => (
                <tr
                  key={row.id}
                  className="hover:bg-card/40 transition-colors group"
                >
                  {/* Problem Title */}
                  <td className="py-4 px-6 font-medium text-text-primary">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-text-muted font-bold w-4">
                        {idx + 1}.
                      </span>
                      <span className="line-clamp-2 group-hover:text-primary transition-colors">
                        {row.problem}
                      </span>
                    </div>
                  </td>

                  {/* Impact Score */}
                  <td className="py-4 px-4 text-center font-semibold text-text-secondary">
                    {row.impactScore}
                  </td>

                  {/* Frequency Score */}
                  <td className="py-4 px-4 text-center font-semibold text-text-secondary">
                    {row.frequencyScore}
                  </td>

                  {/* Automation Potential */}
                  <td className="py-4 px-4 text-center font-semibold text-text-secondary">
                    {row.automationPotential}
                  </td>

                  {/* Opportunity Score Indicator */}
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                      {/* Micro progress bar */}
                      <div className="w-16 bg-surface h-1.5 rounded-full overflow-hidden border border-border/50 hidden md:block">
                        <div
                          className={`h-full rounded-full ${getProgressColor(row.opportunityScore)}`}
                          style={{ width: `${row.opportunityScore}%` }}
                        ></div>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-sans ${getScoreBadge(row.opportunityScore)}`}
                      >
                        {row.opportunityScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
