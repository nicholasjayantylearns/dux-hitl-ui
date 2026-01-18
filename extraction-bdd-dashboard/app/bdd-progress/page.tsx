"use client"

import { DashboardHeader, DashboardMetrics } from "../../components/DashboardHeader"
import { UniversalCard, CardProps } from "../../components/UniversalCard"
import { useState, useEffect } from "react"

interface BDDProgressData {
  bdd_progress: {
    total_features: number
    total_scenarios: number
    total_steps: number
    passed_steps: number
    failed_steps: number
    undefined_steps: number
    skipped_steps: number
    pending_steps: number
    implementation_completeness: number
    definition_coverage: number
    step_execution_rate: number
  }
  unit_dependencies: Array<{
    unit_id: string
    unit_name: string
    status: "completed" | "in_progress" | "blocked" | "pending"
    blocking_dependencies: string[]
    progress_percentage: number
    critical_path: boolean
  }>
  conservative_hitl_metrics: {
    evidence_in_review: number
    evidence_approved: number
    evidence_rejected: number
    average_review_time_ms: number
    active_reviewers: number
    quality_gates_passed: number
  }
  demo_readiness: {
    overall_status: string
    critical_blockers: number
    key_features_operational: number
    evidence_pipeline_health: string
  }
  atlas_unit_status: {
    unit_1_evidence_validation: string
    unit_2_hitl_integration: string
    unit_7_slide_generation: string
  }
}

// Mock BDD data demonstrating the visual hierarchy (fallback)
const mockBDDFeatures = [
  {
    id: "evidence_upload_validation",
    name: "evidence_upload_validation",
    file_path: "features/evidence-loader-filesystem.feature",
    status: "in_progress" as const,
    overall_progress: 67,
    scenarios: [
      {
        id: "upload_pdf_valid",
        name: "Upload PDF with valid format",
        status: "completed" as const,
        feature_id: "evidence_upload_validation",
        steps: [
          {
            id: "step_1",
            name: "Upload research document (PDF/DOCX)",
            status: "completed" as const,
            execution_time: 250
          },
          {
            id: "step_2", 
            name: "Validate file format and size",
            status: "completed" as const,
            execution_time: 120
          },
          {
            id: "step_3",
            name: "Extract source chunks with page attribution",
            status: "completed" as const,
            execution_time: 1450
          }
        ]
      },
      {
        id: "upload_invalid_format",
        name: "Upload document with invalid format",
        status: "in_progress" as const,
        feature_id: "evidence_upload_validation",
        steps: [
          {
            id: "step_4",
            name: "Upload research document (PDF/DOCX)",
            status: "completed" as const,
            execution_time: 180
          },
          {
            id: "step_5",
            name: "Validate file format and size", 
            status: "in_progress" as const
          },
          {
            id: "step_6",
            name: "Display validation error message",
            status: "pending" as const
          }
        ]
      },
      {
        id: "extract_evidence_objects",
        name: "Extract Evidence Schema v2.2 objects",
        status: "failed" as const,
        feature_id: "evidence_upload_validation",
        steps: [
          {
            id: "step_7",
            name: "Generate Evidence Schema v2.2 objects",
            status: "failed" as const,
            error_message: "Citation field validation failed: missing source_created_on"
          },
          {
            id: "step_8",
            name: "Route to Conservative HITL pipeline",
            status: "pending" as const
          },
          {
            id: "step_9",
            name: "Validate 5-field Citation completeness",
            status: "undefined" as const
          }
        ]
      }
    ]
  },
  {
    id: "hitl_quality_gates",
    name: "hitl_quality_gates",
    file_path: "features/conservative_hitl_integration.feature", 
    status: "completed" as const,
    overall_progress: 100,
    scenarios: [
      {
        id: "human_approval_workflow",
        name: "Human reviewer validates evidence quality",
        status: "completed" as const,
        feature_id: "hitl_quality_gates",
        steps: [
          {
            id: "step_10",
            name: "Evidence enters HITL review queue",
            status: "completed" as const,
            execution_time: 50
          },
          {
            id: "step_11",
            name: "Human reviewer validates evidence quality",
            status: "completed" as const,
            execution_time: 15000
          },
          {
            id: "step_12",
            name: "Source document displayed with navigation",
            status: "completed" as const,
            execution_time: 300
          },
          {
            id: "step_13",
            name: "Approval/rejection decision captured",
            status: "completed" as const,
            execution_time: 100
          },
          {
            id: "step_14",
            name: "Quality feedback incorporated", 
            status: "completed" as const,
            execution_time: 80
          },
          {
            id: "step_15",
            name: "Evidence promoted to canonical vault",
            status: "completed" as const,
            execution_time: 200
          }
        ]
      }
    ]
  },
  {
    id: "stage4_template_mapping",
    name: "stage4_template_mapping",
    file_path: "features/stage4_llm_template_mapping.feature",
    status: "pending" as const,
    overall_progress: 0,
    scenarios: [
      {
        id: "template_selection",
        name: "Select appropriate slide template for evidence",
        status: "undefined" as const,
        feature_id: "stage4_template_mapping", 
        steps: [
          {
            id: "step_16",
            name: "Analyze evidence applications_of_evidence field",
            status: "undefined" as const
          },
          {
            id: "step_17",
            name: "Match to template library with confidence scoring",
            status: "undefined" as const
          },
          {
            id: "step_18",
            name: "Select template with confidence ≥ 0.6",
            status: "undefined" as const
          }
        ]
      },
      {
        id: "slide_generation",
        name: "Generate slide from evidence and template",
        status: "pending" as const,
        feature_id: "stage4_template_mapping",
        steps: [
          {
            id: "step_19", 
            name: "Extract evidence content for slide mapping",
            status: "pending" as const
          },
          {
            id: "step_20",
            name: "Apply LLM template transformation",
            status: "pending" as const
          },
          {
            id: "step_21",
            name: "Validate research integrity preservation",
            status: "pending" as const
          },
          {
            id: "step_22",
            name: "Generate slide with complete audit trail",
            status: "pending" as const
          }
        ]
      }
    ]
  }
]

export default function BDDProgressPage() {
  const [progressData, setProgressData] = useState<BDDProgressData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")

  const [bddFeatures, setBddFeatures] = useState<RealBDDFeature[] | null>(null)
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null)

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Fetch both progress data and detailed features
        const [progressResponse, featuresResponse] = await Promise.all([
          fetch('/api/bdd/progress'),
          fetch('/api/bdd/features')
        ])

        if (!progressResponse.ok) {
          throw new Error(`Progress API error! status: ${progressResponse.status}`)
        }
        if (!featuresResponse.ok) {
          throw new Error(`Features API error! status: ${featuresResponse.status}`)
        }

        const progressData = await progressResponse.json()
        const featuresData = await featuresResponse.json()
        
        setProgressData(progressData)
        setBddFeatures(featuresData.features)
        setLastUpdate(new Date().toLocaleTimeString())
        setError(null)
      } catch (err) {
        console.warn('API fetch failed, using mock data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch BDD data')
        // Set mock data so the component still works
        setProgressData({
          bdd_progress: {
            total_features: 3,
            total_scenarios: 8,
            total_steps: 25,
            passed_steps: 18,
            failed_steps: 2,
            undefined_steps: 5,
            skipped_steps: 0,
            pending_steps: 0,
            implementation_completeness: 80,
            definition_coverage: 75,
            step_execution_rate: 72
          }
        } as any)
        setBddFeatures(mockBDDFeatures)
      } finally {
        setLoading(false)
      }
    }

    fetchProgressData()
    // Refresh every 30 seconds for real-time updates
    const interval = setInterval(fetchProgressData, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-400"
      case "in_progress": return "text-yellow-400"
      case "blocked": return "text-red-400"
      case "pending": return "text-gray-400"
      default: return "text-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return "✅"
      case "in_progress": return "🔄" 
      case "blocked": return "🚫"
      case "pending": return "⏸️"
      default: return "❓"
    }
  }

  const generateProgressBar = (progress: number) => {
    const blocks = 20
    const filled = Math.floor((progress / 100) * blocks)
    const empty = blocks - filled
    return "[" + "█".repeat(filled) + "░".repeat(empty) + "]"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🔄 Loading BDD Progress Data...</div>
          <div className="text-green-600">Analyzing test definitions and execution status</div>
        </div>
      </div>
    )
  }

  // Don't block rendering on API errors - show dashboard with mock data

  // Calculate real metrics from bddFeatures (Wink data)
  const realFeatures = bddFeatures || mockBDDFeatures
  const totalFeatures = realFeatures.length
  const completedFeatures = realFeatures.filter(f => f.status === 'completed').length
  const totalScenarios = realFeatures.reduce((sum, f) => sum + f.scenarios.length, 0)
  const totalSteps = realFeatures.reduce((sum, f) =>
    sum + f.scenarios.reduce((ssum, s) => ssum + s.steps.length, 0), 0)
  const passedSteps = realFeatures.reduce((sum, f) =>
    sum + f.scenarios.reduce((ssum, s) =>
      ssum + s.steps.filter(step => step.status === 'completed' || step.status === 'passed').length, 0), 0)
  const totalEvidence = realFeatures.reduce((sum, f) => sum + (f.evidenceCount || 0), 0)
  const progressPercent = totalSteps > 0 ? Math.round((passedSteps / totalSteps) * 100) : 0

  // Dashboard metrics from real BDD data
  const dashboardMetrics: DashboardMetrics = {
    target: "95% Test Coverage",
    current: `${progressPercent}%`,
    successRate: totalSteps > 0 ? `${Math.round((passedSteps / totalSteps) * 100)}%` : "0%",
    totalFeatures: totalFeatures,
    featuresComplete: `${completedFeatures}/${totalFeatures}`,
    signalsObserved: `${passedSteps}/${totalSteps}`,
    journeyProgress: `${progressPercent}`,
    timeElapsed: "Phase 0",
    evidenceItems: `${totalEvidence}`
  };

  // Convert mock BDD features to CardProps format
  const convertToCardProps = (features: typeof mockBDDFeatures): CardProps[] => {
    return features.map((feature, idx) => {
      const children: CardProps[] = feature.scenarios.map((scenario, sidx) => {
        const steps = scenario.steps.map(step => ({
          step: step.name,
          status: step.status as 'passing' | 'failing' | 'pending' | 'undefined'
        }));

        const passingSteps = steps.filter(s => s.status === 'completed').length;

        return {
          id: `${feature.id}-S${sidx + 1}`,
          title: scenario.name,
          type: 'scenario' as const,
          status: scenario.status === 'completed' ? 'PASSING' :
                  scenario.status === 'in_progress' ? 'IN PROGRESS' :
                  scenario.status === 'failed' ? 'FAILING' : 'NOT STARTED',
          metrics: {
            signals: {
              completed: passingSteps,
              total: steps.length
            },
            evidence: 0,
            percentage: steps.length > 0 ? Math.round((passingSteps / steps.length) * 100) : 0
          },
          steps
        };
      });

      const passingScenarios = children.filter(c => c.status === 'PASSING').length;

      return {
        id: `BDD-${String(idx + 1).padStart(2, '0')}`,
        title: feature.name.replace(/_/g, ' ').toUpperCase(),
        type: 'feature' as const,
        status: feature.status === 'completed' ? 'PASSING' :
                feature.status === 'in_progress' ? 'IN PROGRESS' :
                feature.status === 'failed' ? 'FAILING' : 'NOT STARTED',
        metrics: {
          signals: {
            completed: passingScenarios,
            total: children.length
          },
          evidence: feature.evidenceCount || 0,  // Use evidenceCount from API (linked to DUX objects)
          percentage: feature.overall_progress
        },
        children
      };
    });
  };

  const featureCards = convertToCardProps(bddFeatures || mockBDDFeatures);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      {/* API Error Warning (if any) */}
      {error && (
        <div className="mb-4 border border-red-500 p-3 bg-red-900/20 text-red-300 text-sm">
          ⚠️ API Error: {error} (showing mock data)
        </div>
      )}

      {/* Dashboard Header */}
      <DashboardHeader
        jtbd="When I want to connect safely with someone I find attractive, I want to know if they're interested before approaching, so that I only pursue connections where interest is mutual and avoid visible rejection"
        metrics={dashboardMetrics}
      />

      {/* Horizontal Feature Card Row */}
      <div className="px-6 pb-6">
        <div className="flex gap-4 overflow-x-auto">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className={`flex-shrink-0 transition-all duration-300 ${
                expandedCardId === card.id ? 'w-[500px]' : 'w-[280px]'
              }`}
            >
              <UniversalCard
                {...card}
                expanded={expandedCardId === card.id}
                onToggleExpand={() => {
                  setExpandedCardId(expandedCardId === card.id ? null : card.id);
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}