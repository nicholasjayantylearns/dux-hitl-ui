"use client"

import { useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { InsightChainViewer } from "@/components/insight-chain-viewer" // Renamed import
import * as Data from "@/data/insight-data"
import { mockFilters } from "@/data/filters" // Import mock filters and type

// Lazy-load ChatInterface on the client to keep the initial chunk small
// REMOVED: ChatInterface is now integrated within InsightChainViewer
// const ChatInterface = dynamic(() => import("@/components/chat-interface").then((m) => m.ChatInterface), {
//   ssr: false,
//   loading: () => <div className="text-center text-gray-400 font-sansBody py-8">Loading chat…</div>,
// })

const insightChains = [
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
  // NEW INSIGHTS FROM ATTACHMENT
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
]

const alternatives = {
  problems: Data.alternativeProblems,
  behaviors: Data.alternativeBehaviors,
  results: Data.alternativeResults,
}

export default function InsightSynthesizerPage() {
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0)
  // The activeFilter state is now managed within InsightChainViewer,
  // but we keep a reference to the initial filter to pass down.
  const initialActiveFilter = mockFilters[0]

  // REMOVED: This function is now handled within InsightChainViewer
  // const handleAddCommentAsEvidence = (comment: string, objectId: string, objectType: string) => {
  //   // This is a conceptual function. In a real app, you would:
  //   // 1. Call a Server Action or API route to create a new Provenance object from the comment.
  //   // 2. Update the relevant DUX object (e.g., problem_idle_gpu_costs) in your backend
  //   //    to include the new Provenance ID in its 'evidence' array.
  //   // 3. Re-fetch or update the local state to reflect the change.
  //   console.log(`Adding comment as evidence: "${comment}" to ${objectType} with ID: ${objectId}`)
  //   alert(`Comment added as evidence to ${objectType} ${objectId}! (Conceptually)`)
  // }

  return (
    <div className="min-h-screen p-4 sm:p-8 text-white bg-neon-dark-bg">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-left">
          <h1 className="text-3xl font-bold font-barlow mb-2 text-gray-100 text-left">Insight Synthesizer</h1>
          <p className="text-gray-400 font-sansBody text-left">
            An evidence-first synthesizer. Each key finding acts as a magnet, pulling you through a chain of related
            insights.
          </p>
        </div>

        {/* The filter selection section is now moved inside InsightChainViewer */}

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full mb-8"
          onSelect={(api) => {
            // Add a check to ensure api and its method are available
            if (api && typeof api.selectedScrollSnap === "function") {
              setCurrentCarouselIndex(api.selectedScrollSnap())
            }
          }}
        >
          <CarouselContent>
            {insightChains.map((chain, index) => (
              <CarouselItem key={chain.insight.id}>
                <InsightChainViewer // Renamed component
                  insight={chain.insight}
                  initialProblem={chain.problem}
                  initialBehavior={chain.behavior}
                  initialResult={chain.result}
                  alternatives={alternatives}
                  filters={mockFilters} // Pass all mock filters
                  initialFilter={initialActiveFilter} // Pass the initial filter
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="text-white bg-gray-800/50 border-gray-600 hover:bg-gray-700" />
          <CarouselNext className="text-white bg-gray-800/50 border-gray-600 hover:bg-gray-700" />
        </Carousel>

        {/* REMOVED: Chat element is now integrated within InsightChainViewer */}
        {/* <div className="mt-12">
          <h2 className="text-2xl font-bold font-barlow mb-4 text-gray-100 text-center">Chat with your LLM</h2>
          <ChatInterface
            onAddCommentAsEvidence={handleAddCommentAsEvidence}
            currentProblemId={currentChain?.problem.id}
            currentBehaviorId={currentChain?.behavior.id}
            currentResultId={currentChain?.result.id}
          />
        </div> */}
      </div>
    </div>
  )
}
