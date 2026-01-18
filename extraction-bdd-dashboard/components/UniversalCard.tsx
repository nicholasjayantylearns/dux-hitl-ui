'use client';

import { useState } from 'react';

export interface CardStep {
  step: string;
  status: 'passing' | 'failing' | 'pending' | 'undefined';
}

export interface CardMetrics {
  signals: {
    completed: number;
    total: number;
  };
  evidence: number;
  percentage: number;
}

export interface CardProps {
  id: string;
  title: string;
  type: 'feature' | 'scenario';
  status: 'NOT STARTED' | 'IN PROGRESS' | 'PASSING' | 'FAILING';
  metrics: CardMetrics;
  children?: CardProps[];
  steps?: CardStep[];
  expanded?: boolean;
  onToggleExpand?: () => void;
  level?: number;
}

export function UniversalCard({
  id,
  title,
  type,
  status,
  metrics,
  children,
  steps,
  expanded = false,
  onToggleExpand,
  level = 0,
}: CardProps) {
  // Internal state for scenario cards (level > 0)
  const [internalExpanded, setInternalExpanded] = useState(false);

  // Use controlled expansion if onToggleExpand provided, otherwise use internal state
  const isExpanded = onToggleExpand ? expanded : internalExpanded;

  const handleClick = () => {
    if (onToggleExpand) {
      onToggleExpand();
    } else {
      setInternalExpanded(!internalExpanded);
    }
  };

  // Status color mapping
  const statusColors = {
    'NOT STARTED': 'text-gray-500',
    'IN PROGRESS': 'text-cyan-primary',
    'PASSING': 'text-status-green',
    'FAILING': 'text-status-red',
  };

  // Step status icon mapping
  const stepStatusIcons = {
    passing: '✓',
    failing: '✗',
    pending: '○',
    undefined: '○',
  };

  const stepStatusColors = {
    passing: 'text-status-green',
    failing: 'text-status-red',
    pending: 'text-gray-500',
    undefined: 'text-gray-600',
  };

  // Indentation based on nesting level
  const indentClass = level === 0 ? '' : 'ml-6';

  return (
    <div className={`
      ${indentClass}
      w-full
      transition-all duration-300
      mb-4
    `}>
      {/* Card */}
      <div
        className="border border-gray-600/30 bg-gray-800/10 p-4 transition-all hover:border-opacity-60 cursor-pointer rounded-lg"
        onClick={handleClick}
      >
        {/* Header Row: ID Badge + Status */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-400/20">
          <span className="bg-cyan-400/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
            {id}
          </span>
          <span className="text-xs uppercase tracking-wide font-mono text-gray-500">
            {status.toLowerCase().replace(/_/g, ' ')}
          </span>
        </div>

        {/* Title */}
        <div className="text-cyan-300 text-sm font-bold mb-3 leading-tight font-mono">
          {title}
        </div>

        {/* Metrics Row */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-3">
          <span>{metrics.signals.completed}/{metrics.signals.total} signals</span>
          <span>{metrics.evidence} evidence</span>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div
            className="h-full transition-all duration-300 bg-gray-600"
            style={{ width: `${metrics.percentage}%` }}
          ></div>
        </div>

        {/* Bottom Row: Percentage + Arrow */}
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-mono">{metrics.percentage}% complete</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          >
            <path d="m9 18 6-6-6-6"></path>
          </svg>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-2 pl-4 border-l-2 border-purple-border">
          {/* Feature Type: Render nested scenario cards */}
          {type === 'feature' && children && children.length > 0 && (
            <div className="space-y-3 mt-3">
              <div className="text-cyan-secondary uppercase tracking-wider text-xs font-mono mb-2">
                [SCENARIOS]
              </div>
              {children.map((child, index) => (
                <UniversalCard
                  key={`${child.id}-${index}`}
                  {...child}
                  level={level + 1}
                />
              ))}
            </div>
          )}

          {/* Scenario Type: Render step list */}
          {type === 'scenario' && steps && steps.length > 0 && (
            <div className="mt-3">
              <div className="text-cyan-secondary uppercase tracking-wider text-xs font-mono mb-2">
                [OBSERVABLE SIGNALS]
              </div>
              <div className="space-y-2">
                {steps.map((stepItem, index) => (
                  <div
                    key={`step-${index}`}
                    className="flex items-start gap-3 text-xs font-mono"
                  >
                    {/* Status Icon */}
                    <span
                      className={`${
                        stepStatusColors[stepItem.status]
                      }`}
                    >
                      {stepStatusIcons[stepItem.status]}
                    </span>

                    {/* Step Text */}
                    <span className="text-gray-400 flex-1">
                      {stepItem.step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {type === 'feature' && (!children || children.length === 0) && (
            <div className="mt-3 text-gray-500 text-sm font-mono italic">
              No scenarios defined yet
            </div>
          )}

          {type === 'scenario' && (!steps || steps.length === 0) && (
            <div className="mt-3 text-gray-500 text-sm font-mono italic">
              No steps defined yet
            </div>
          )}
        </div>
      )}
    </div>
  );
}
