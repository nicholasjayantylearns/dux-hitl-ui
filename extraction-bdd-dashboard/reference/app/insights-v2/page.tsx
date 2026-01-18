"use client"

import { InsightChainV2 } from "@/components/insight-chain-v2"
import * as Data from "@/data/insight-data"

const insightChains = [
  // ── Nubank real-world examples ────────────────────────────────────────────
  {
    insight: Data.insight_financial_inclusion_success,
    problem: Data.problem_financial_exclusion_001,
    behavior: Data.beh_enable_financial_inclusion_001,
    result: Data.res_massive_customer_growth_001,
  },
  {
    insight: Data.insight_finops_forecasting_mastery,
    problem: Data.problem_cloud_forecasting_inaccuracy_002,
    behavior: Data.beh_granular_forecasting_buckets_002,
    result: Data.res_improved_forecasting_accuracy_002,
  },

  // ── Demo examples (kept for comparison) ───────────────────────────────────
  {
    insight: Data.insight_005,
    problem: Data.problem_idle_gpu_costs,
    behavior: Data.behavior_dashboard_use,
    result: Data.result_idle_cost_reduction,
  },
  {
    insight: Data.insight_003,
    problem: Data.problem_auto_shutdown_tracking,
    behavior: Data.behavior_shutdown_utilization,
    result: Data.result_cost_savings,
  },
  {
    insight: Data.insight_001,
    problem: Data.problem_gpu_monitoring,
    behavior: Data.behavior_admin_monitoring,
    result: Data.result_idle_gpu_alerting,
  },
]

export default function InsightSynthesizerV2Page() {
  return (
    <div className="min-h-screen bg-amber-50/30 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-primary font-barlow mb-2">
            Insight Synthesizer (Researcher's Desk)
          </h1>
          <p className="text-text-secondary font-sansBody">
            A tactile, artifact-based view of Insight Chains, including real-world examples from Nubank, connecting
            problems to results with a human-centric feel.
          </p>
        </div>

        <div className="space-y-12">
          {insightChains.map((chain) => (
            <InsightChainV2
              key={chain.insight.id}
              insight={chain.insight}
              problem={chain.problem}
              behavior={chain.behavior}
              result={chain.result}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
