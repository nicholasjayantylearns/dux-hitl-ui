'use client';

export interface DashboardMetrics {
  target: string;
  current: string;
  successRate: string;
  totalFeatures: number;
  featuresComplete: string;
  signalsObserved: string;
  journeyProgress: string;
  timeElapsed: string;
  evidenceItems: string;
}

interface DashboardHeaderProps {
  jtbd: string;
  metrics: DashboardMetrics;
}

export function DashboardHeader({ jtbd, metrics }: DashboardHeaderProps) {
  return (
    <div className="font-mono text-sm mb-8 px-6 pt-6">
      {/* Pipeline Title */}
      <div className="text-cyan-primary mb-2 tracking-wide">
        JTBD.BDD.EVIDENCE.PIPELINE :: v4.0
      </div>

      {/* Status with Animated Ping */}
      <div className="flex items-center gap-2 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-green-400 uppercase tracking-wider">ONLINE</span>
      </div>

      {/* Journey Section - Purple Bordered Box */}
      <div className="relative border border-purple-400/30 rounded-lg bg-purple-900/10 p-6 mb-6">
        <span className="absolute -top-3 left-6 bg-gray-900 px-4 text-purple-300 text-xs font-mono font-bold tracking-wider uppercase">
          [JOURNEY: JOB TO BE DONE]
        </span>

        {/* JTBD Statement */}
        <div className="text-purple-200 text-lg leading-relaxed mb-4 font-mono">
          "{jtbd}"
        </div>

        {/* Target Metrics Row */}
        <div className="flex flex-wrap gap-6 text-xs text-purple-300/70 uppercase tracking-wide font-mono">
          <span>Target: {metrics.target}</span>
          <span>Current: {metrics.current}</span>
          <span>Success Rate: {metrics.successRate}</span>
        </div>
      </div>

      {/* Progress Metrics - Green Bordered Box */}
      <div className="border border-green-400/30 bg-green-900/5 rounded-lg p-5 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.totalFeatures}
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              BDD Features
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.featuresComplete}
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              Features Complete
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.signalsObserved}
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              Signals Observed
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.journeyProgress}%
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              Journey Progress
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.timeElapsed}
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              Time Elapsed
            </div>
          </div>
          <div className="text-center">
            <div className="text-green-400 text-xl font-bold mb-1 font-mono">
              {metrics.evidenceItems}
            </div>
            <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
              Evidence Items
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
