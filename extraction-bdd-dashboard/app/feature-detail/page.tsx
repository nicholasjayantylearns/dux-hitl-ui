"use client"

import { DashboardHeader, DashboardMetrics } from "../../components/DashboardHeader"
import { UniversalCard, CardProps } from "../../components/UniversalCard"
import { useState } from "react"

export default function FeatureDetailPage() {
  const [expandedScenarioId, setExpandedScenarioId] = useState<string | null>(null)

  // Mock data for ONE feature (Workspace Ownership)
  const featureJTBD = "When I need to respond to urgent client requests, I want to manage my workspace independently, so that I can deliver fixes within 1 hour instead of waiting 3 days for admin approval"

  const featureMetrics: DashboardMetrics = {
    target: "< 1 hour",
    current: "3 days",
    successRate: ">95%",
    totalFeatures: 1,
    featuresComplete: "0/4",
    signalsObserved: "0/13",
    journeyProgress: "0",
    timeElapsed: "0 days",
    evidenceItems: "0"
  }

  // Scenarios as main cards (not nested) - 8 scenarios (4 × 2 for testing)
  const scenarioCards: CardProps[] = [
    {
      id: "S1",
      title: "Sarah responds to urgent client bug fix within 1 hour",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 4 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah receives urgent P1 bug report from Bank of Example at 9:00 AM', status: 'undefined' },
        { step: 'And the bug affects real-time fraud detection (revenue impact: $50K/hour)', status: 'undefined' },
        { step: 'And the fix requires adding team member Mike to workspace', status: 'undefined' },
        { step: 'When platform admin assigns Sarah as workspace owner (completed by 9:05 AM)', status: 'undefined' },
        { step: 'And Sarah grants Mike access to fraud-detection workspace (completed by 9:07 AM)', status: 'undefined' },
        { step: 'And Mike accesses workspace and implements fix (completed by 9:35 AM)', status: 'undefined' },
        { step: 'And Sarah reviews Mike\'s code changes (completed by 9:45 AM)', status: 'undefined' },
        { step: 'And Sarah deploys fix to production (completed by 9:50 AM)', status: 'undefined' },
        { step: 'Then complete workflow finishes in <1 hour (50 minutes actual)', status: 'undefined' },
        { step: 'And Bank of Example confirms fraud detection restored by 10:00 AM', status: 'undefined' },
        { step: 'And SLA compliance maintained (P1 response <1 hour)', status: 'undefined' },
        { step: 'And Sarah feels empowered to manage her team without blockers', status: 'undefined' },
        { step: 'And ≥95% of similar urgent requests handled within 1 hour', status: 'undefined' },
      ]
    },
    {
      id: "S2",
      title: "Sarah transfers ownership when promoted to new role",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah has been workspace owner for "fraud-detection-team" for 6 months', status: 'undefined' },
        { step: 'And Sarah is promoted to Director of Data Science (no longer hands-on)', status: 'undefined' },
        { step: 'And John is taking over as fraud detection team lead', status: 'undefined' },
        { step: 'When Sarah initiates ownership transfer to John (takes 3 minutes)', status: 'undefined' },
        { step: 'And system validates John has appropriate permissions', status: 'undefined' },
        { step: 'Then John becomes primary workspace owner within 5 minutes', status: 'undefined' },
        { step: 'And John receives owner dashboard access immediately', status: 'undefined' },
        { step: 'And cost attribution updates to John\'s department within 1 hour', status: 'undefined' },
      ]
    },
    {
      id: "S3",
      title: "Sarah adds secondary owner for coverage during vacation",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah is primary owner of fraud-detection workspace', status: 'undefined' },
        { step: 'And Sarah is planning 2-week vacation', status: 'undefined' },
        { step: 'And Mike needs to handle urgent requests while Sarah is away', status: 'undefined' },
        { step: 'When Sarah adds Mike as secondary workspace owner (takes 2 minutes)', status: 'undefined' },
        { step: 'Then Mike receives owner permissions within 1 minute', status: 'undefined' },
        { step: 'And Mike can grant team access independently', status: 'undefined' },
      ]
    },
    {
      id: "S4",
      title: "System handles owner account deactivation gracefully",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah is primary owner of fraud-detection workspace', status: 'undefined' },
        { step: 'And Mike is designated as secondary owner (backup)', status: 'undefined' },
        { step: 'And Sarah\'s account is deactivated (left company)', status: 'undefined' },
        { step: 'When system detects account deactivation within 5 minutes', status: 'undefined' },
        { step: 'Then ownership automatically transfers to Mike within 10 minutes', status: 'undefined' },
      ]
    },
    // Duplicate scenarios for testing (8 total)
    {
      id: "S5",
      title: "Sarah responds to urgent client bug fix within 1 hour",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 4 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah receives urgent P1 bug report from Bank of Example at 9:00 AM', status: 'undefined' },
        { step: 'Then complete workflow finishes in <1 hour (50 minutes actual)', status: 'undefined' },
      ]
    },
    {
      id: "S6",
      title: "Sarah transfers ownership when promoted to new role",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah has been workspace owner for "fraud-detection-team" for 6 months', status: 'undefined' },
      ]
    },
    {
      id: "S7",
      title: "Sarah adds secondary owner for coverage during vacation",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah is primary owner of fraud-detection workspace', status: 'undefined' },
      ]
    },
    {
      id: "S8",
      title: "System handles owner account deactivation gracefully",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: {
        signals: { completed: 0, total: 3 },
        evidence: 0,
        percentage: 0
      },
      steps: [
        { step: 'Given Sarah is primary owner of fraud-detection workspace', status: 'undefined' },
      ]
    },
    // Additional scenarios for 12-scenario test
    {
      id: "S9",
      title: "Scenario 9",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: { signals: { completed: 0, total: 2 }, evidence: 0, percentage: 0 },
      steps: [{ step: 'Given test step', status: 'undefined' }]
    },
    {
      id: "S10",
      title: "Scenario 10",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: { signals: { completed: 0, total: 2 }, evidence: 0, percentage: 0 },
      steps: [{ step: 'Given test step', status: 'undefined' }]
    },
    {
      id: "S11",
      title: "Scenario 11",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: { signals: { completed: 0, total: 2 }, evidence: 0, percentage: 0 },
      steps: [{ step: 'Given test step', status: 'undefined' }]
    },
    {
      id: "S12",
      title: "Scenario 12",
      type: 'scenario',
      status: 'NOT STARTED',
      metrics: { signals: { completed: 0, total: 2 }, evidence: 0, percentage: 0 },
      steps: [{ step: 'Given test step', status: 'undefined' }]
    },
  ]

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono">
      {/* Dashboard Header */}
      <DashboardHeader
        jtbd={featureJTBD}
        metrics={featureMetrics}
      />

      {/* Feature Title */}
      <div className="px-6 mb-4">
        <div className="text-cyan-400 text-xl font-bold font-mono tracking-wide">
          Workspace Ownership: Respond to Urgent Requests
        </div>
        <div className="text-gray-400 text-xs font-mono mt-1">
          Feature 1 of 6 • 4 scenarios
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
          <button className="px-4 py-2 border border-gray-600 rounded hover:border-cyan-400 transition-colors">
            ← Previous Feature
          </button>
          <span>1 / 6 Features</span>
          <button className="px-4 py-2 border border-gray-600 rounded hover:border-cyan-400 transition-colors">
            Next Feature →
          </button>
        </div>
      </div>
    </div>
  )
}
