"use client"

import { DashboardHeader, DashboardMetrics } from "../../../components/DashboardHeader"
import { UniversalCard, CardProps } from "../../../components/UniversalCard"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface BDDFeature {
  id: string
  name: string
  jtbd?: string
  target?: string
  currentState?: string
  totalScenarios: number
  scenarios: any[]
}

interface FeatureDetailPageProps {
  params: Promise<{
    featureId: string
  }>
}

export default function FeatureDetailPage({ params }: FeatureDetailPageProps) {
  const router = useRouter()
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null)
  const [feature, setFeature] = useState<BDDFeature | null>(null)
  const [allFeatures, setAllFeatures] = useState<BDDFeature[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featureId, setFeatureId] = useState<string | null>(null)

  // Unwrap params promise
  useEffect(() => {
    params.then(p => setFeatureId(p.featureId))
  }, [params])

  useEffect(() => {
    if (!featureId) return

    async function fetchFeatureData() {
      try {
        setLoading(true)
        const response = await fetch('/api/bdd/features')
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }
        const data = await response.json()

        // Store all features for navigation
        setAllFeatures(data.features)

        // Find the specific feature
        const foundFeature = data.features.find((f: BDDFeature) => f.id === featureId)
        if (!foundFeature) {
          throw new Error(`Feature "${featureId}" not found`)
        }

        setFeature(foundFeature)
        setError(null)
      } catch (err) {
        console.error('Error fetching feature data:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchFeatureData()
  }, [featureId])

  // Navigation helpers
  const currentIndex = allFeatures.findIndex(f => f.id === featureId)
  const hasPrevious = currentIndex > 0
  const hasNext = currentIndex < allFeatures.length - 1
  const previousFeature = hasPrevious ? allFeatures[currentIndex - 1] : null
  const nextFeature = hasNext ? allFeatures[currentIndex + 1] : null

  const handlePrevious = () => {
    if (previousFeature) {
      router.push(`/feature-detail/${previousFeature.id}`)
    }
  }

  const handleNext = () => {
    if (nextFeature) {
      router.push(`/feature-detail/${nextFeature.id}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-green-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Loading feature data...</div>
          <div className="text-gray-500">Parsing .feature files</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-red-400 font-mono flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl mb-2">Error loading feature</div>
          <div className="text-gray-500">{error}</div>
        </div>
      </div>
    )
  }

  if (!feature) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-400 font-mono flex items-center justify-center">
        <div className="text-center">Feature not found</div>
      </div>
    )
  }

  // Convert API scenarios to CardProps format
  const scenarioCards: CardProps[] = feature.scenarios.map((scenario) => {
    const completedSteps = scenario.steps.filter((s: any) => s.status === 'passed').length
    const totalSteps = scenario.steps.length
    const percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

    // Map status from API to UniversalCard status
    const statusMap: Record<string, 'NOT STARTED' | 'IN PROGRESS' | 'PASSING' | 'FAILING'> = {
      'undefined': 'NOT STARTED',
      'pending': 'IN PROGRESS',
      'passed': 'PASSING',
      'failed': 'FAILING',
      'skipped': 'NOT STARTED'
    }

    return {
      id: scenario.id,
      title: scenario.name,
      type: 'scenario',
      status: statusMap[scenario.status] || 'NOT STARTED',
      metrics: {
        signals: {
          completed: completedSteps,
          total: totalSteps
        },
        evidence: 0, // TODO: Extract from test results
        percentage
      },
      steps: scenario.steps.map((step: any) => ({
        step: step.name,
        status: step.status as 'passing' | 'failing' | 'pending' | 'undefined'
      }))
    }
  })

  // Calculate feature metrics
  const featureMetrics: DashboardMetrics = {
    target: feature.target || "< 5 minutes",
    current: feature.currentState || "Manual process",
    successRate: ">95%",
    totalFeatures: allFeatures.length,
    featuresComplete: `0/${feature.totalScenarios}`,
    signalsObserved: "0/" + feature.scenarios.reduce((sum, s) => sum + s.steps.length, 0),
    journeyProgress: "0",
    timeElapsed: "0 days",
    evidenceItems: "0"
  }

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      {/* Dashboard Header */}
      <DashboardHeader
        jtbd={feature.jtbd || feature.name}
        metrics={featureMetrics}
      />

      {/* Feature Title */}
      <div className="px-6 mb-4">
        <div className="text-cyan-400 text-xl font-bold font-mono tracking-wide">
          {feature.name}
        </div>
        <div className="text-gray-400 text-xs font-mono mt-1">
          Feature ID: {feature.id} • {feature.totalScenarios} scenarios • Feature {currentIndex + 1}/{allFeatures.length}
        </div>
      </div>

      {/* Horizontal Scenario Card Row - Single Row, No Scroll */}
      <div className="px-6 pb-6">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${scenarioCards.length}, minmax(0, 1fr))` }}>
          {scenarioCards.map((card) => (
            <UniversalCard
              key={card.id}
              {...card}
              expanded={expandedScenarioId === card.id}
              onToggleExpand={() => {
                setExpandedScenarioId(expandedScenarioId === card.id ? null : card.id)
              }}
            />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="px-6 pb-6">
        <div className="flex justify-between items-center text-gray-400 text-sm font-mono">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious}
            className={`px-4 py-2 border rounded transition-colors ${
              hasPrevious
                ? 'border-gray-600 hover:border-cyan-400 hover:text-cyan-400 cursor-pointer'
                : 'border-gray-800 text-gray-700 cursor-not-allowed'
            }`}
          >
            ← {previousFeature ? previousFeature.name.substring(0, 30) + (previousFeature.name.length > 30 ? '...' : '') : 'Previous Feature'}
          </button>
          <span className="text-cyan-400">
            {currentIndex + 1} / {allFeatures.length}
          </span>
          <button
            onClick={handleNext}
            disabled={!hasNext}
            className={`px-4 py-2 border rounded transition-colors ${
              hasNext
                ? 'border-gray-600 hover:border-cyan-400 hover:text-cyan-400 cursor-pointer'
                : 'border-gray-800 text-gray-700 cursor-not-allowed'
            }`}
          >
            {nextFeature ? nextFeature.name.substring(0, 30) + (nextFeature.name.length > 30 ? '...' : '') : 'Next Feature'} →
          </button>
        </div>
      </div>
    </div>
  )
}
