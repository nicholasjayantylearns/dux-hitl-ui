import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock data matching the expected BDDProgressData interface
    return NextResponse.json({
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
      },
      unit_dependencies: [],
      conservative_hitl_metrics: {
        evidence_in_review: 12,
        evidence_approved: 45,
        evidence_rejected: 3,
        average_review_time_ms: 120000,
        active_reviewers: 5,
        quality_gates_passed: 8
      },
      demo_readiness: {
        overall_status: "ready",
        critical_blockers: 0,
        key_features_operational: 3,
        evidence_pipeline_health: "healthy"
      },
      atlas_unit_status: {
        unit_1_evidence_validation: "operational",
        unit_2_hitl_integration: "operational",
        unit_7_slide_generation: "in_progress"
      },
      generated_at: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      error: "Failed to load BDD progress",
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
