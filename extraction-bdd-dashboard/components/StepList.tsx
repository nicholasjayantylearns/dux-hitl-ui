'use client';

export interface Step {
  step: string;
  status: 'passing' | 'failing' | 'pending' | 'undefined';
}

interface StepListProps {
  steps: Step[];
  title?: string;
}

export function StepList({ steps, title = '[OBSERVABLE SIGNALS]' }: StepListProps) {
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

  if (!steps || steps.length === 0) {
    return (
      <div className="mt-3 text-gray-500 text-sm font-mono italic">
        No steps defined yet
      </div>
    );
  }

  return (
    <div className="mt-3">
      {/* Section Header */}
      <div className="text-cyan-secondary uppercase tracking-wider text-xs font-mono mb-3">
        {title}
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        {steps.map((stepItem, index) => (
          <div
            key={`step-${index}`}
            className="flex items-start gap-3 text-sm font-mono leading-relaxed"
          >
            {/* Status Icon */}
            <span
              className={`${
                stepStatusColors[stepItem.status]
              } font-bold shrink-0`}
            >
              {stepStatusIcons[stepItem.status]}
            </span>

            {/* Step Text */}
            <span className="text-card-monospace-text-primary flex-1">
              {stepItem.step}
            </span>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="mt-4 pt-3 border-t border-purple-border/30 text-xs font-mono text-card-monospace-text-secondary">
        {steps.filter((s) => s.status === 'passing').length}/{steps.length}{' '}
        signals passing
      </div>
    </div>
  );
}
