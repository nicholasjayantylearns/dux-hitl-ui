"use client"

import React, { useState } from 'react'
import { 
  ChevronRight, 
  Circle, 
  CheckCircle2, 
  AlertCircle, 
  Target,
  TrendingUp,
  Users,
  Clock
} from 'lucide-react'

// ============================================
// TypeScript Types
// ============================================

type SignalStatus = 'complete' | 'partial' | 'missing'
type FeatureStatus = 'completed' | 'in-progress' | 'not-started'

interface Signal {
  id: string
  text: string
  status: SignalStatus
}

interface BDDFeature {
  id: string
  number: string
  title: string
  status: FeatureStatus
  signals: Signal[]
  evidenceCount: number
  progress: number
}

interface JTBDJourney {
  statement: string
  metrics: {
    target: string
    current: string
    successRate: string
    featureCount: number
  }
  features: BDDFeature[]
}

interface ProgressData {
  bdd_progress?: {
    total_features?: number
    step_execution_rate?: number
    features_passing?: number
    steps_passing?: number
    total_steps?: number
  }
  pipeline_metrics?: {
    current_time?: string
    target_time?: string
  }
}

interface RealBDDFeature {
  id?: string
  name?: string
  title?: string
  file_path?: string
  status?: 'completed' | 'in_progress' | 'not_started' | 'failed'
  overall_progress?: number
  passing?: boolean
  inProgress?: boolean
  scenarios?: Array<{
    id: string
    name: string
    description: string
    status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
    feature_id: string
    passed?: boolean
    pending?: boolean
    steps?: Array<{
      id: string
      name: string
      status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
      execution_time?: number
      error_message?: string
    }>
  }>
  evidenceCount?: number
  passedScenarios?: number
  totalScenarios?: number
}

interface JTBDTimelineProps {
  journey?: JTBDJourney
  progressData?: ProgressData
  bddFeatures?: RealBDDFeature[]
  className?: string
}

// ============================================
// Transform Functions
// ============================================

const transformBDDFeatures = (bddFeatures: RealBDDFeature[]): BDDFeature[] => {
  return bddFeatures?.map((feature, index) => {
    // Extract all steps from all scenarios as signals
    const signals: Signal[] = []
    feature.scenarios?.forEach(scenario => {
      scenario.steps?.forEach(step => {
        signals.push({
          id: step.id,
          text: step.name,
          status: step.status === 'passed' ? 'complete' :
                  step.status === 'failed' ? 'missing' :
                  step.status === 'pending' ? 'partial' :
                  step.status === 'undefined' ? 'missing' : 'partial'
        })
      })
    })

    // Determine feature status based on scenarios
    let featureStatus: FeatureStatus = 'not-started'
    if (feature.status === 'completed' || feature.passing) {
      featureStatus = 'completed'
    } else if (feature.status === 'in_progress' || feature.inProgress) {
      featureStatus = 'in-progress'
    } else if (feature.status === 'failed') {
      featureStatus = 'in-progress' // Show failed as in-progress (with red signals)
    }

    // Calculate progress based on passed steps
    const totalSteps = signals.length
    const passedSteps = signals.filter(s => s.status === 'complete').length
    const progress = totalSteps > 0 ? Math.round((passedSteps / totalSteps) * 100) : 0

    return {
      id: feature.id || `bdd-${index}`,
      number: `BDD-${String(index + 1).padStart(2, '0')}`,
      title: feature.name || feature.title || `Feature ${index + 1}`,
      status: featureStatus,
      signals,
      evidenceCount: feature.evidenceCount || 0,
      progress
    }
  }) || []
}

// ============================================
// Sub-Components
// ============================================

const TerminalHeader: React.FC = () => (
  <div className="flex items-center justify-between p-3 border border-cyan-400/30 border-b-2 border-b-cyan-400/50 bg-gray-900/50 mb-6 rounded-t">
    <div className="flex gap-2">
      <span className="w-3 h-3 rounded-full bg-red-500" />
      <span className="w-3 h-3 rounded-full bg-yellow-500" />
      <span className="w-3 h-3 rounded-full bg-green-500" />
    </div>
    <div className="text-cyan-400 text-sm font-mono font-bold tracking-wider uppercase">
      JTBD.BDD.EVIDENCE.PIPELINE :: v4.0
    </div>
    <div className="flex items-center gap-2">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      <span className="text-green-500 text-xs font-mono">ONLINE</span>
    </div>
  </div>
)

const JTBDHeader: React.FC<{ journey: JTBDJourney }> = ({ journey }) => (
  <div className="relative border border-purple-400/30 rounded-lg bg-purple-900/10 p-6 mb-6">
    <span className="absolute -top-3 left-6 bg-gray-900 px-4 text-purple-300 text-xs font-mono font-bold tracking-wider uppercase">
      [JOURNEY: JOB TO BE DONE]
    </span>
    <div className="text-purple-200 text-lg leading-relaxed mb-4 font-mono">
      "{journey.statement}"
    </div>
    <div className="flex flex-wrap gap-6 text-xs text-purple-300/70 uppercase tracking-wide font-mono">
      <span>Target: {journey.metrics.target}</span>
      <span>Current: {journey.metrics.current}</span>
      <span>Success Rate: {journey.metrics.successRate}</span>
      <span>{journey.metrics.featureCount} BDD Features</span>
    </div>
  </div>
)

const SignalIndicator: React.FC<{ status: SignalStatus }> = ({ status }) => {
  switch (status) {
    case 'complete': 
      return <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
    case 'partial': 
      return <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
    case 'missing': 
      return <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
  }
}

const BDDFeatureCard: React.FC<{ feature: BDDFeature; index: number }> = ({ feature, index }) => {
  const [expanded, setExpanded] = useState(false)
  
  const statusColors = {
    'completed': 'text-green-400',
    'in-progress': 'text-cyan-400',
    'not-started': 'text-gray-500'
  }

  const dotColors = {
    'completed': 'bg-green-400',
    'in-progress': 'bg-cyan-400',
    'not-started': 'bg-gray-600'
  }

  const borderColors = {
    'completed': 'border-green-400/30 bg-green-900/10',
    'in-progress': 'border-cyan-400/30 bg-cyan-900/10',
    'not-started': 'border-gray-600/30 bg-gray-800/10'
  }

  return (
    <div className="relative">
      {/* Timeline Dot */}
      <div className={`absolute top-9 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gray-900 z-20 ${dotColors[feature.status]}`} />
      
      {/* Card */}
      <div className={`border ${borderColors[feature.status]} p-4 mt-16 transition-all hover:border-opacity-60 cursor-pointer rounded-lg`}
           onClick={() => setExpanded(!expanded)}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-400/20">
          <span className="bg-cyan-400/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full font-mono">
            {feature.number}
          </span>
          <span className={`text-xs uppercase tracking-wide font-mono ${statusColors[feature.status]}`}>
            {feature.status.replace('-', ' ')}
          </span>
        </div>

        {/* Title */}
        <div className="text-cyan-300 text-sm font-bold mb-3 leading-tight font-mono">
          {feature.title}
        </div>

        {/* Quick Stats */}
        <div className="flex justify-between items-center text-xs text-gray-400 font-mono mb-3">
          <span>{feature.signals.filter(s => s.status === 'complete').length}/{feature.signals.length} signals</span>
          <span>{feature.evidenceCount} evidence</span>
        </div>

        {/* Progress */}
        <div className="h-1 bg-gray-700 rounded-full overflow-hidden mb-2">
          <div 
            className={`h-full transition-all duration-300 ${
              feature.status === 'completed' ? 'bg-green-400' :
              feature.status === 'in-progress' ? 'bg-cyan-400' :
              'bg-gray-600'
            }`}
            style={{ width: `${feature.progress}%` }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500 font-mono">{feature.progress}% complete</span>
          <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${
            expanded ? 'rotate-90' : ''
          }`} />
        </div>

        {/* Expanded Signals */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-cyan-400/10">
            <div className="text-xs text-cyan-300/70 uppercase tracking-wide mb-3 font-mono">
              [OBSERVABLE SIGNALS]
            </div>
            <div className="space-y-2">
              {feature.signals.map(signal => (
                <div key={signal.id} className="flex items-center gap-2">
                  <SignalIndicator status={signal.status} />
                  <span className={`text-xs font-mono ${
                    signal.status === 'complete' ? 'text-green-300' :
                    signal.status === 'partial' ? 'text-yellow-300' :
                    'text-gray-400'
                  }`}>
                    {signal.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const JourneySummary: React.FC<{ journey: JTBDJourney }> = ({ journey }) => {
  const completedFeatures = journey.features.filter(f => f.status === 'completed').length
  const totalSignals = journey.features.reduce((acc, f) => acc + f.signals.length, 0)
  const completedSignals = journey.features.reduce((acc, f) => 
    acc + f.signals.filter(s => s.status === 'complete').length + 
    (f.signals.filter(s => s.status === 'partial').length * 0.5), 0
  )
  const totalEvidence = journey.features.reduce((acc, f) => acc + f.evidenceCount, 0)
  const overallProgress = totalSignals > 0 
    ? Math.round((completedSignals / totalSignals) * 100) 
    : 0

  return (
    <div className="border border-green-400/30 bg-green-900/5 rounded-lg p-5 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold mb-1 font-mono" data-testid="total-features-count">
            {completedFeatures}/{journey.features.length}
          </div>
          <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
            Features Complete
          </div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold mb-1 font-mono">
            {completedSignals}/{totalSignals}
          </div>
          <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
            Signals Observed
          </div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold mb-1 font-mono">
            {overallProgress}%
          </div>
          <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
            Journey Progress
          </div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold mb-1 font-mono">
            {journey.metrics.current}
          </div>
          <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
            Time Elapsed
          </div>
        </div>
        <div className="text-center">
          <div className="text-green-400 text-xl font-bold mb-1 font-mono">
            {totalEvidence}
          </div>
          <div className="text-green-400/60 text-xs uppercase tracking-wide font-mono">
            Evidence Items
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================

export default function JTBDTimeline({ 
  journey, 
  progressData, 
  bddFeatures, 
  className = "" 
}: JTBDTimelineProps) {
  
  // Default mock journey
  const mockJourney: JTBDJourney = {
    statement: "When I need to validate UX research evidence, I want to ensure quality and compliance through automated testing, so that I can trust the insights for product decisions.",
    metrics: {
      target: "< 2 minutes",
      current: "4.5 minutes", 
      successRate: "78%",
      featureCount: 3
    },
    features: [
      {
        id: "evidence_upload_validation",
        number: "BDD-01",
        title: "Evidence Upload & Format Validation",
        status: "completed" as FeatureStatus,
        signals: [
          { id: "s1", text: "User uploads research document (PDF/DOCX)", status: "complete" },
          { id: "s2", text: "System validates file format and size", status: "complete" },
          { id: "s3", text: "Document converted with page attribution", status: "complete" },
          { id: "s4", text: "Source chunks extracted successfully", status: "complete" }
        ],
        evidenceCount: 12,
        progress: 100
      },
      {
        id: "hitl_quality_gates",
        number: "BDD-02",
        title: "Human-in-the-Loop Quality Gates",
        status: "in-progress" as FeatureStatus,
        signals: [
          { id: "s5", text: "Evidence enters HITL review queue", status: "complete" },
          { id: "s6", text: "Human reviewer validates quality", status: "complete" },
          { id: "s7", text: "Source document displayed with navigation", status: "partial" },
          { id: "s8", text: "Approval/rejection decision captured", status: "missing" },
          { id: "s9", text: "Quality feedback incorporated", status: "missing" }
        ],
        evidenceCount: 8,
        progress: 50
      },
      {
        id: "stage4_template_mapping",
        number: "BDD-03",
        title: "Template Mapping & Slide Generation",
        status: "not-started" as FeatureStatus,
        signals: [
          { id: "s10", text: "Evidence applications analyzed", status: "missing" },
          { id: "s11", text: "Template matched with confidence", status: "missing" },
          { id: "s12", text: "Slide generated with audit trail", status: "missing" },
          { id: "s13", text: "Research integrity preserved", status: "missing" }
        ],
        evidenceCount: 0,
        progress: 0
      }
    ]
  }

  // Merge real data with mock
  const currentJourney: JTBDJourney = journey || {
    ...mockJourney,
    features: bddFeatures ? transformBDDFeatures(bddFeatures) : mockJourney.features,
    metrics: {
      target: progressData?.pipeline_metrics?.target_time || mockJourney.metrics.target,
      current: progressData?.pipeline_metrics?.current_time || mockJourney.metrics.current,
      successRate: progressData?.bdd_progress?.step_execution_rate 
        ? `${progressData.bdd_progress.step_execution_rate}%` 
        : mockJourney.metrics.successRate,
      featureCount: bddFeatures?.length || 
                    progressData?.bdd_progress?.total_features || 
                    mockJourney.features.length
    }
  }

  // Calculate overall progress for timeline
  const completedFeatures = currentJourney.features.filter(f => f.status === 'completed').length
  const overallProgress = currentJourney.features.length > 0 
    ? Math.round((completedFeatures / currentJourney.features.length) * 100)
    : 0

  return (
    <div className={`min-h-screen bg-gray-900 text-cyan-400 p-5 ${className}`} data-testid="bdd-progress-dashboard">
      <div className="max-w-[1800px] mx-auto" data-testid="json-data-display">
        <TerminalHeader />
        
        {/* JTBD Definition */}
        <JTBDHeader journey={currentJourney} />
        
        {/* Status Summary (Bridge Position) */}
        <JourneySummary journey={currentJourney} />
        
        {/* Timeline */}
        <div className="relative py-10">
          {/* Progress Line */}
          <div className="absolute top-20 left-10 right-10 h-0.5 bg-cyan-400/20">
            <div 
              className="h-full bg-gradient-to-r from-green-400 via-cyan-400 to-cyan-400 transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>

          {/* BDD Features Timeline */}
          <div className={`grid gap-5 relative z-10 ${
            currentJourney.features.length <= 3 ? 'grid-cols-3' :
            currentJourney.features.length === 4 ? 'grid-cols-4' :
            currentJourney.features.length === 5 ? 'grid-cols-5' :
            'grid-cols-4'
          }`}>
            {currentJourney.features.map((feature, index) => (
              <BDDFeatureCard key={feature.id} feature={feature} index={index} />
            ))}
          </div>
        </div>

        {/* Optional: Detailed Stats */}
        {progressData && (
          <div className="mt-8 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
            <div className="text-xs text-gray-400 font-mono">
              <div>Pipeline Metrics: {progressData.bdd_progress?.features_passing}/{progressData.bdd_progress?.total_features} features passing</div>
              <div>Step Execution: {progressData.bdd_progress?.steps_passing}/{progressData.bdd_progress?.total_steps} steps passing</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
// // ============================================
// // jtbd-timeline.tsx - Main Component
// // ============================================

// "use client"

// import React from 'react'
// import { CheckCircle2, AlertCircle, Circle, ChevronRight } from 'lucide-react'

// // ============================================
// // TypeScript Types
// // ============================================

// type SignalStatus = 'complete' | 'partial' | 'missing'
// type FeatureStatus = 'completed' | 'in-progress' | 'not-started'

// interface Signal {
//   id: string
//   text: string
//   status: SignalStatus
// }

// interface BDDFeature {
//   id: string
//   number: string
//   title: string
//   status: FeatureStatus
//   signals: Signal[]
//   evidenceCount: number
//   progress: number
// }

// interface JTBDJourney {
//   statement: string
//   metrics: {
//     target: string
//     current: string
//     successRate: string
//     featureCount: number
//   }
//   features: BDDFeature[]
// }

// interface JTBDTimelineProps {
//   journey?: JTBDJourney
//   progressData?: any
//   bddFeatures?: any[]
//   className?: string
// }

// // ============================================
// // Data Mapping Utilities
// // ============================================

// // Convert BDD mock data to JTBD format
// function mapBDDDataToJTBD(bddFeatures: any[], progressData?: any): JTBDJourney {
//   const features: BDDFeature[] = bddFeatures.map((bddFeature) => {
//     // Map BDD scenarios to signals
//     const signals: Signal[] = []
//     bddFeature.scenarios?.forEach((scenario: any) => {
//       scenario.steps?.forEach((step: any) => {
//         const signalStatus: SignalStatus = 
//           step.status === 'completed' ? 'complete' :
//           step.status === 'in_progress' ? 'partial' : 'missing'
        
//         signals.push({
//           id: step.id,
//           text: step.name,
//           status: signalStatus
//         })
//       })
//     })
    
//     // Map BDD status to feature status
//     const featureStatus: FeatureStatus = 
//       bddFeature.status === 'completed' ? 'completed' :
//       bddFeature.status === 'in_progress' ? 'in-progress' : 'not-started'
    
//     return {
//       id: bddFeature.id,
//       number: bddFeature.name.replace('_', '-').toUpperCase(),
//       title: bddFeature.name.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
//       status: featureStatus,
//       signals: signals,
//       evidenceCount: Math.floor(Math.random() * 15), // Mock evidence count
//       progress: bddFeature.overall_progress || 0
//     }
//   })
  
//   return {
//     statement: "When I need to validate UX research evidence, I want to ensure quality and compliance through automated testing, so that I can trust the insights for product decisions.",
//     metrics: {
//       target: "< 2 minutes",
//       current: "4.5 minutes",
//       successRate: `${progressData?.bdd_progress?.step_execution_rate || 78}%`,
//       featureCount: progressData?.bdd_progress?.total_features || features.length
//     },
//     features: features
//   }
// }

// // ============================================
// // Sub-Components
// // ============================================

// const TerminalHeader: React.FC = () => (
//   <div className="flex items-center justify-between p-3 border border-cyan-faint border-b-2 border-b-cyan-primary/50 bg-terminal-bg-secondary mb-6">
//     <div className="flex gap-2">
//       <span className="w-3 h-3 rounded-full bg-status-red" />
//       <span className="w-3 h-3 rounded-full bg-status-yellow" />
//       <span className="w-3 h-3 rounded-full bg-status-green" />
//     </div>
//     <div className="text-cyan-primary text-base font-mono font-bold tracking-wider uppercase">
//       JTBD.BDD.SIGNAL.TIMELINE :: v3.0
//     </div>
//     <div className="flex items-center gap-2">
//       <span className="relative flex h-2 w-2">
//         <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-status-green opacity-75"></span>
//         <span className="relative inline-flex rounded-full h-2 w-2 bg-status-green"></span>
//       </span>
//       <span className="text-status-green text-sm">ONLINE</span>
//     </div>
//   </div>
// )

// const JTBDHeader: React.FC<{ journey: JTBDJourney }> = ({ journey }) => (
//   <div className="relative border border-purple-border rounded-lg bg-purple-bg p-6 mb-10">
//     <span className="absolute -top-3 left-6 bg-terminal-bg px-4 text-purple-text text-sm font-mono font-bold tracking-wider uppercase">
//       [JOURNEY: JOB TO BE DONE]
//     </span>
//     <div className="text-purple-text text-2xl leading-relaxed mb-4 font-mono">
//       "{journey.statement}"
//     </div>
//     <div className="flex gap-10 text-sm text-purple-text-muted uppercase tracking-terminal font-mono">
//       <span>Target: {journey.metrics.target}</span>
//       <span>Current: {journey.metrics.current}</span>
//       <span>Success Rate: {journey.metrics.successRate}</span>
//       <span>{journey.metrics.featureCount} BDD Features</span>
//     </div>
//   </div>
// )

// const SignalIndicator: React.FC<{ status: SignalStatus }> = ({ status }) => {
//   // // Option 1: Lucide Icons (currently active)
//   // switch (status) {
//   //   case 'complete': 
//   //     return <CheckCircle2 className="w-4 h-4 text-signal-complete flex-shrink-0" />
//   //   case 'partial': 
//   //     return <AlertCircle className="w-4 h-4 text-signal-partial flex-shrink-0" />
//   //   case 'missing': 
//   //     return <Circle className="w-4 h-4 text-signal-missing flex-shrink-0" />
//   // }
  
//   //Option 2: Simple Dots (commented out for comparison)
//   const colors = {
//     complete: 'bg-signal-complete',
//     partial: 'bg-signal-partial', 
//     missing: 'bg-signal-missing'
//   }

//   return <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors[status]}`} />
  
// }

// const BDDFeatureCard: React.FC<{ feature: BDDFeature }> = ({ feature }) => {
//   const statusColors = {
//     'completed': 'text-signal-complete',
//     'in-progress': 'text-cyan-primary',
//     'not-started': 'text-gray-500'
//   }

//   const dotColors = {
//     'completed': 'bg-signal-complete',
//     'in-progress': 'bg-cyan-primary',
//     'not-started': 'bg-gray-600'
//   }

//   const completedSignals = feature.signals.filter(s => s.status === 'complete').length
//   const partialSignals = feature.signals.filter(s => s.status === 'partial').length * 0.5
//   const totalSignals = feature.signals.length

//   return (
//     <div className="relative">
//       {/* Timeline Dot */}
//       <div className={`absolute top-9 left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-2 border-terminal-bg z-20 ${dotColors[feature.status]}`} />
      
//       {/* Card */}
//       <div className="border border-cyan-faint bg-terminal-bg-secondary p-4 mt-[60px] transition-all hover:border-cyan-primary/60 hover:bg-terminal-bg-tertiary hover:-translate-y-0.5 cursor-pointer">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-3 pb-2 border-b border-cyan-faint/20">
//           <span className="bg-cyan-primary/30 text-cyan-primary text-xs font-bold px-2 py-0.5 rounded-full">
//             {feature.number}
//           </span>
//           <span className={`text-2xs uppercase tracking-terminal ${statusColors[feature.status]}`}>
//             {feature.status.replace('-', ' ')}
//           </span>
//         </div>

//         {/* Title */}
//         <div className="text-cyan-primary text-lg font-bold mb-3 leading-tight font-mono">
//           {feature.title}
//         </div>

//         {/* Signals */}
//         <div className="mt-3 pt-3 border-t border-cyan-faint/10">
//           <div className="text-cyan-muted text-2xs uppercase tracking-terminal mb-2 font-mono">
//             [OBSERVABLE SIGNALS]
//           </div>
//           <div className="space-y-1.5">
//             {feature.signals.map(signal => (
//               <div key={signal.id} className="flex items-center gap-2">
//                 <SignalIndicator status={signal.status} />
//                 <span className="text-cyan-secondary text-sm leading-tight font-mono">
//                   {signal.text}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Progress */}
//         <div className="mt-3 pt-3 border-t border-cyan-faint/10">
//           <div className="h-1 bg-cyan-faint/10 rounded-sm overflow-hidden mb-1.5">
//             <div 
//               className="h-full bg-gradient-to-r from-signal-complete to-cyan-primary"
//               style={{ width: `${feature.progress}%` }}
//             />
//           </div>
//           <div className="flex justify-between text-xs text-cyan-muted font-mono">
//             <span>{completedSignals + partialSignals}/{totalSignals} signals</span>
//             <span>{feature.progress}%</span>
//           </div>
//         </div>

//         {/* Evidence Link */}
//         <a href="#" className="inline-block mt-2 text-xs text-purple-text hover:text-purple-text-muted border-b border-dotted border-purple-border font-mono">
//           → {feature.evidenceCount} evidence items
//         </a>
//       </div>
//     </div>
//   )
// }

// const JourneySummary: React.FC<{ journey: JTBDJourney }> = ({ journey }) => {
//   const completedFeatures = journey.features.filter(f => f.status === 'completed').length
//   const totalSignals = journey.features.reduce((acc, f) => acc + f.signals.length, 0)
//   const completedSignals = journey.features.reduce((acc, f) => 
//     acc + f.signals.filter(s => s.status === 'complete').length + 
//     (f.signals.filter(s => s.status === 'partial').length * 0.5), 0
//   )
//   const overallProgress = Math.round((completedSignals / totalSignals) * 100)

//   return (
//     <div className="mt-10 p-5 border border-signal-complete/30 bg-signal-complete/5 grid grid-cols-5 gap-5">
//       <div className="text-center">
//         <div className="text-signal-complete text-xl font-bold mb-1 font-mono">{completedFeatures}/{journey.features.length}</div>
//         <div className="text-signal-complete/60 text-2xs uppercase tracking-terminal font-mono">Features Complete</div>
//       </div>
//       <div className="text-center">
//         <div className="text-signal-complete text-xl font-bold mb-1 font-mono">{Math.round(completedSignals)}/{totalSignals}</div>
//         <div className="text-signal-complete/60 text-2xs uppercase tracking-terminal font-mono">Signals Observed</div>
//       </div>
//       <div className="text-center">
//         <div className="text-signal-complete text-xl font-bold mb-1 font-mono">{overallProgress}%</div>
//         <div className="text-signal-complete/60 text-2xs uppercase tracking-terminal font-mono">Journey Progress</div>
//       </div>
//       <div className="text-center">
//         <div className="text-signal-complete text-xl font-bold mb-1 font-mono">3.5hr</div>
//         <div className="text-signal-complete/60 text-2xs uppercase tracking-terminal font-mono">Time Elapsed</div>
//       </div>
//       <div className="text-center">
//         <div className="text-signal-complete text-xl font-bold mb-1 font-mono">27</div>
//         <div className="text-signal-complete/60 text-2xs uppercase tracking-terminal font-mono">Evidence Items</div>
//       </div>
//     </div>
//   )
// }

// // ============================================
// // Main Component
// // ============================================

// export default function JTBDTimeline({ journey, progressData, bddFeatures, className = "" }: JTBDTimelineProps) {
//   const mockJourney: JTBDJourney = {
//     statement: "When I need to validate UX research evidence, I want to ensure quality and compliance through automated testing, so that I can trust the insights for product decisions.",
//     metrics: {
//       target: "< 2 minutes",
//       current: "4.5 minutes", 
//       successRate: "78%",
//       featureCount: progressData?.bdd_progress?.total_features || 25
//     },
//     features: [
//       {
//         id: "evidence_upload_validation",
//         number: "BDD-01",
//         title: "Evidence Upload & Format Validation",
//         status: "completed" as FeatureStatus,
//         signals: [
//           { id: "s1", text: "User uploads research document (PDF/DOCX)", status: "complete" },
//           { id: "s2", text: "System validates file format and size", status: "complete" },
//           { id: "s3", text: "Document converted with page attribution", status: "complete" },
//           { id: "s4", text: "Source chunks extracted successfully", status: "complete" }
//         ],
//         evidenceCount: 12,
//         progress: 100
//       },
//       {
//         id: "hitl_quality_gates",
//         number: "BDD-02",
//         title: "Human-in-the-Loop Quality Gates",
//         status: "in-progress" as FeatureStatus,
//         signals: [
//           { id: "s5", text: "Evidence enters HITL review queue", status: "complete" },
//           { id: "s6", text: "Human reviewer validates quality", status: "complete" },
//           { id: "s7", text: "Source document displayed with navigation", status: "partial" },
//           { id: "s8", text: "Approval/rejection decision captured", status: "missing" },
//           { id: "s9", text: "Quality feedback incorporated", status: "missing" }
//         ],
//         evidenceCount: 8,
//         progress: 67
//       },
//       {
//         id: "stage4_template_mapping",
//         number: "BDD-03",
//         title: "Template Mapping & Slide Generation",
//         status: "not-started" as FeatureStatus,
//         signals: [
//           { id: "s10", text: "Evidence applications analyzed", status: "missing" },
//           { id: "s11", text: "Template matched with confidence", status: "missing" },
//           { id: "s12", text: "Slide generated with audit trail", status: "missing" },
//           { id: "s13", text: "Research integrity preserved", status: "missing" }
//         ],
//         evidenceCount: 0,
//         progress: 0
//       }
//     ]
//   }
  
//   // Use provided journey, or map from BDD features, or fallback to default
//   const currentJourney = journey || 
//     (bddFeatures ? mapBDDDataToJTBD(bddFeatures, progressData) : mockJourney)
  
//   // Calculate overall progress based on completed features
//   const overallProgress = Math.round(
//     currentJourney.features.reduce((acc, f) => acc + f.progress, 0) / currentJourney.features.length
//   )
  
//   // Update metrics from progressData if available
//   if (progressData) {
//     currentJourney.metrics.featureCount = progressData.bdd_progress?.total_features || currentJourney.metrics.featureCount
//     currentJourney.metrics.successRate = `${progressData.bdd_progress?.step_execution_rate || 78}%`
//   }
  
//   return (
//     <div className={`min-h-screen bg-terminal-bg text-cyan-primary p-5 ${className}`}>
//       <div className="max-w-[1800px] mx-auto">
//         <TerminalHeader />
//         <JTBDHeader journey={currentJourney} />
        
//         {/* Timeline Wrapper */}
//         <div className="relative py-10">
//           {/* Progress Line */}
//           <div className="absolute top-20 left-10 right-10 h-0.5 bg-cyan-faint/20">
//             <div 
//               className="h-full bg-gradient-to-r from-signal-complete via-cyan-primary to-cyan-primary transition-all duration-500"
//               style={{ width: `${overallProgress}%` }}
//             />
//           </div>

//           {/* BDD Features Timeline */}
//           <div className="grid grid-cols-3 gap-5 relative z-10">
//             {currentJourney.features.map((feature) => (
//               <BDDFeatureCard key={feature.id} feature={feature} />
//             ))}
//           </div>
//         </div>

//         <JourneySummary journey={currentJourney} />
//       </div>
//     </div>
//   )
// }