"use client"

import { useState, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Rewind } from "lucide-react"

interface Snapshot {
  timestamp: string
  week: number
  phase: string
  features: Array<{
    id: string
    status: string
    overall_progress: number
    evidenceCount: number
    passedScenarios: number
    totalScenarios: number
  }>
  pipeline_metrics: {
    total_steps: number
    defined_steps: number
    implemented_steps: number
    passing_steps: number
    success_rate: number
    step_execution_rate: number
  }
  journey: {
    phase: string
    description: string
    progress: number
  }
  overall_completion: number
  demo_readiness: {
    status: string
    critical_blockers: number
    features_operational: number
    total_features: number
  }
}

interface LongitudinalData {
  project: string
  total_weeks: number
  snapshots: Snapshot[]
}

const FEATURE_NAMES: Record<string, string> = {
  workspace_ownership: "Workspace Ownership Assignment and Management",
  service_account_binding: "Service Account Integration for Credential Isolation",
  vault_integration: "HashiCorp Vault Integration for Secret Management",
  gitops_deployment: "GitOps-Based Workspace Deployment and Configuration",
  multicloud_access: "Multi-Cloud Resource Access Management",
  billing_tracking: "Workspace-Level Billing and Cost Attribution"
}

export default function RoadmapTimeline() {
  const [data, setData] = useState<LongitudinalData | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1000) // milliseconds per week

  useEffect(() => {
    fetch('/bdd-data/longitudinal-roadmap.json')
      .then(res => res.json())
      .then(setData)
  }, [])

  useEffect(() => {
    if (playing && data) {
      const interval = setInterval(() => {
        setCurrentIndex(i => {
          if (i >= data.snapshots.length - 1) {
            setPlaying(false)
            return i
          }
          return i + 1
        })
      }, speed)
      return () => clearInterval(interval)
    }
  }, [playing, speed, data])

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-primary font-monospace">Loading roadmap data...</div>
      </div>
    )
  }

  const snapshot = data.snapshots[currentIndex]
  const startDate = new Date(data.snapshots[0].timestamp)
  const currentDate = new Date(snapshot.timestamp)

  return (
    <div className="min-h-screen bg-black text-cyan-primary font-monospace p-8">
      {/* Header */}
      <div className="mb-8 border-b border-cyan-primary/30 pb-4">
        <h1 className="text-2xl font-bold tracking-wide mb-2">
          {data.project.toUpperCase()}
        </h1>
        <div className="flex justify-between text-sm">
          <span>WEEK {snapshot.week} OF {data.total_weeks}</span>
          <span>{currentDate.toLocaleDateString()}</span>
          <span>PHASE: {snapshot.phase.toUpperCase()}</span>
        </div>
      </div>

      {/* Timeline Controls */}
      <div className="mb-8 flex items-center gap-4 bg-terminal-bg-secondary border border-cyan-primary/30 p-4 rounded">
        <button
          onClick={() => setCurrentIndex(0)}
          className="p-2 hover:bg-cyan-primary/20 rounded"
          title="Reset to start"
        >
          <Rewind className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          className="p-2 hover:bg-cyan-primary/20 rounded"
          disabled={currentIndex === 0}
        >
          <SkipBack className="w-5 h-5" />
        </button>
        <button
          onClick={() => setPlaying(!playing)}
          className="p-3 bg-cyan-primary/20 hover:bg-cyan-primary/30 rounded"
        >
          {playing ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        <button
          onClick={() => setCurrentIndex(Math.min(data.snapshots.length - 1, currentIndex + 1))}
          className="p-2 hover:bg-cyan-primary/20 rounded"
          disabled={currentIndex === data.snapshots.length - 1}
        >
          <SkipForward className="w-5 h-5" />
        </button>

        <div className="flex-1 mx-4">
          <input
            type="range"
            min="0"
            max={data.snapshots.length - 1}
            value={currentIndex}
            onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <select
          value={speed}
          onChange={(e) => setSpeed(parseInt(e.target.value))}
          className="bg-black border border-cyan-primary/30 p-2 rounded text-sm"
        >
          <option value={2000}>0.5x Speed</option>
          <option value={1000}>1x Speed</option>
          <option value={500}>2x Speed</option>
          <option value={250}>4x Speed</option>
        </select>
      </div>

      {/* Overall Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-terminal-bg-secondary border border-cyan-primary/30 p-4 rounded">
          <div className="text-xs text-cyan-secondary mb-1">OVERALL COMPLETION</div>
          <div className="text-3xl font-bold">{snapshot.overall_completion.toFixed(1)}%</div>
        </div>
        <div className="bg-terminal-bg-secondary border border-cyan-primary/30 p-4 rounded">
          <div className="text-xs text-cyan-secondary mb-1">SUCCESS RATE</div>
          <div className="text-3xl font-bold">{snapshot.pipeline_metrics.success_rate.toFixed(1)}%</div>
        </div>
        <div className="bg-terminal-bg-secondary border border-cyan-primary/30 p-4 rounded">
          <div className="text-xs text-cyan-secondary mb-1">STEPS PASSING</div>
          <div className="text-3xl font-bold">
            {snapshot.pipeline_metrics.passing_steps}/{snapshot.pipeline_metrics.total_steps}
          </div>
        </div>
        <div className="bg-terminal-bg-secondary border border-cyan-primary/30 p-4 rounded">
          <div className="text-xs text-cyan-secondary mb-1">FEATURES COMPLETE</div>
          <div className="text-3xl font-bold">
            {snapshot.demo_readiness.features_operational}/{snapshot.demo_readiness.total_features}
          </div>
        </div>
      </div>

      {/* Journey Phase */}
      <div className="mb-8 bg-purple-bg border border-purple-border p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm font-bold text-purple-text">{snapshot.journey.phase}</div>
          <div className="text-sm text-purple-text-muted">{snapshot.journey.progress}%</div>
        </div>
        <div className="text-xs text-purple-text-muted mb-2">{snapshot.journey.description}</div>
        <div className="w-full bg-black rounded-full h-2">
          <div
            className="bg-purple-text h-2 rounded-full transition-all duration-300"
            style={{ width: `${snapshot.journey.progress}%` }}
          />
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-2 gap-6">
        {snapshot.features.map((feature, idx) => (
          <div
            key={feature.id}
            className="bg-terminal-bg-secondary border border-cyan-primary/30 p-6 rounded relative overflow-hidden"
          >
            {/* Progress bar background */}
            <div
              className="absolute inset-0 bg-cyan-primary/10 transition-all duration-500"
              style={{ width: `${feature.overall_progress}%` }}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="text-xs text-cyan-secondary mb-1">BDD-{String(idx + 1).padStart(2, '0')}</div>
                  <div className="text-sm font-bold">{FEATURE_NAMES[feature.id]}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded ${
                  feature.status === 'completed' ? 'bg-status-green/20 text-status-green' :
                  feature.status === 'in_progress' ? 'bg-status-yellow/20 text-status-yellow' :
                  'bg-signal-missing/20 text-cyan-muted'
                }`}>
                  {feature.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-xs text-cyan-secondary">Progress</div>
                  <div className="font-bold">{feature.overall_progress.toFixed(1)}%</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-secondary">Evidence</div>
                  <div className="font-bold">{feature.evidenceCount} signals</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-secondary">Scenarios</div>
                  <div className="font-bold">{feature.passedScenarios}/{feature.totalScenarios}</div>
                </div>
                <div>
                  <div className="text-xs text-cyan-secondary">Status</div>
                  <div className="font-bold">
                    {feature.overall_progress === 100 ? '✓ Complete' :
                     feature.overall_progress > 0 ? '⟳ Active' : '○ Pending'}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 w-full bg-black rounded-full h-1">
                <div
                  className="bg-cyan-primary h-1 rounded-full transition-all duration-500"
                  style={{ width: `${feature.overall_progress}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Health */}
      <div className="mt-8 bg-terminal-bg-secondary border border-cyan-primary/30 p-6 rounded">
        <div className="text-sm font-bold mb-4">PIPELINE HEALTH METRICS</div>
        <div className="grid grid-cols-4 gap-6">
          <div>
            <div className="text-xs text-cyan-secondary mb-1">Defined Steps</div>
            <div className="text-2xl font-bold">{snapshot.pipeline_metrics.defined_steps}</div>
            <div className="text-xs text-cyan-muted">of {snapshot.pipeline_metrics.total_steps} total</div>
          </div>
          <div>
            <div className="text-xs text-cyan-secondary mb-1">Implemented</div>
            <div className="text-2xl font-bold">{snapshot.pipeline_metrics.implemented_steps}</div>
            <div className="text-xs text-cyan-muted">
              {((snapshot.pipeline_metrics.implemented_steps / snapshot.pipeline_metrics.total_steps) * 100).toFixed(0)}% coverage
            </div>
          </div>
          <div>
            <div className="text-xs text-cyan-secondary mb-1">Passing</div>
            <div className="text-2xl font-bold text-status-green">{snapshot.pipeline_metrics.passing_steps}</div>
            <div className="text-xs text-cyan-muted">
              {snapshot.pipeline_metrics.success_rate.toFixed(1)}% success rate
            </div>
          </div>
          <div>
            <div className="text-xs text-cyan-secondary mb-1">Demo Status</div>
            <div className={`text-lg font-bold ${
              snapshot.demo_readiness.status === 'operational' ? 'text-status-green' : 'text-status-yellow'
            }`}>
              {snapshot.demo_readiness.status.toUpperCase()}
            </div>
            <div className="text-xs text-cyan-muted">
              {snapshot.demo_readiness.critical_blockers} blockers remaining
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
