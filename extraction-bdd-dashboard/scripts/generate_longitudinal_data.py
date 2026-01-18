#!/usr/bin/env python3
"""
Generate synthetic longitudinal BDD roadmap data for Discrete Connection
Simulates 24-week development timeline across 4 phases
"""

import json
import math
from datetime import datetime, timedelta
from typing import Dict, List


def s_curve(week: int, start_week: int, duration: int) -> float:
    """
    Generate S-curve progression (sigmoid function)
    Returns 0-100 percentage based on position in development window
    """
    if week < start_week:
        return 0.0
    if week >= start_week + duration:
        return 100.0

    # Normalize to 0-1 range within the duration window
    x = (week - start_week) / duration
    # Sigmoid with steeper curve: 1 / (1 + e^(-12*(x-0.5)))
    progress = 1 / (1 + math.exp(-12 * (x - 0.5)))
    return round(progress * 100, 1)


def evidence_count(progress: float, max_signals: int) -> int:
    """Evidence accumulates with progress, with some randomness"""
    base = (progress / 100) * max_signals
    # Add realistic variance (±10%)
    variance = math.sin(progress / 10) * max_signals * 0.1
    return max(0, min(max_signals, int(base + variance)))


def scenario_status(progress: float, scenario_index: int, total_scenarios: int) -> Dict:
    """Determine scenario status based on feature progress"""
    # Scenarios complete sequentially
    scenario_threshold = ((scenario_index + 1) / total_scenarios) * 100

    if progress >= scenario_threshold:
        return {
            "status": "passing",
            "passed": True,
            "steps_passing": scenario_index + 4  # ~4-6 steps per scenario
        }
    elif progress >= scenario_threshold - 20:
        return {
            "status": "in_progress",
            "passed": False,
            "steps_passing": scenario_index + 1
        }
    else:
        return {
            "status": "pending",
            "passed": False,
            "steps_passing": 0
        }


# Feature development schedule (start_week, duration_weeks, max_evidence)
FEATURE_SCHEDULE = {
    "workspace_ownership": {"start": 1, "duration": 6, "max_evidence": 13, "scenarios": 4},
    "service_account_binding": {"start": 3, "duration": 6, "max_evidence": 14, "scenarios": 4},
    "vault_integration": {"start": 8, "duration": 5, "max_evidence": 12, "scenarios": 4},
    "gitops_deployment": {"start": 12, "duration": 4, "max_evidence": 12, "scenarios": 4},
    "multicloud_access": {"start": 13, "duration": 4, "max_evidence": 12, "scenarios": 4},
    "billing_tracking": {"start": 16, "duration": 5, "max_evidence": 12, "scenarios": 4},
}


def generate_feature_snapshot(feature_id: str, week: int) -> Dict:
    """Generate a single feature's state at a given week"""
    schedule = FEATURE_SCHEDULE[feature_id]
    progress = s_curve(week, schedule["start"], schedule["duration"])
    evidence = evidence_count(progress, schedule["max_evidence"])

    # Determine overall status
    if progress == 0:
        status = "not_started"
        in_progress = False
    elif progress < 100:
        status = "in_progress"
        in_progress = True
    else:
        status = "completed"
        in_progress = False

    # Calculate passing scenarios
    passing_scenarios = 0
    for i in range(schedule["scenarios"]):
        scenario_state = scenario_status(progress, i, schedule["scenarios"])
        if scenario_state["passed"]:
            passing_scenarios += 1

    return {
        "id": feature_id,
        "status": status,
        "overall_progress": progress,
        "evidenceCount": evidence,
        "passedScenarios": passing_scenarios,
        "totalScenarios": schedule["scenarios"],
        "passing": progress == 100,
        "inProgress": in_progress
    }


def calculate_pipeline_metrics(week: int) -> Dict:
    """Calculate overall pipeline health metrics"""
    total_steps = 75  # From your 6 features

    # Steps get defined early (weeks 1-4), implemented gradually
    defined_steps = min(75, int(week * 4.5))

    # Implementation lags behind definition
    implemented_steps = max(0, int((week - 2) * 3.5))
    implemented_steps = min(defined_steps, implemented_steps)

    # Passing steps lag behind implementation (some fail initially)
    passing_steps = max(0, int((week - 3) * 3.2))
    passing_steps = min(implemented_steps, passing_steps)

    # Calculate success rate
    if implemented_steps > 0:
        success_rate = round((passing_steps / implemented_steps) * 100, 1)
    else:
        success_rate = 0.0

    return {
        "total_steps": total_steps,
        "defined_steps": defined_steps,
        "implemented_steps": implemented_steps,
        "passing_steps": passing_steps,
        "success_rate": success_rate,
        "step_execution_rate": round((implemented_steps / total_steps) * 100, 1) if total_steps > 0 else 0
    }


def calculate_journey_phase(week: int) -> Dict:
    """Determine JTBD journey phase"""
    if week <= 4:
        return {
            "phase": "Problem Definition",
            "description": "Defining workspace ownership & credential isolation problems",
            "progress": min(100, week * 25)
        }
    elif week <= 12:
        return {
            "phase": "Behavior Validation",
            "description": "Implementing & testing workspace behaviors",
            "progress": min(100, (week - 4) * 12.5)
        }
    elif week <= 20:
        return {
            "phase": "Result Measurement",
            "description": "Measuring billing, cost attribution, compliance",
            "progress": min(100, (week - 12) * 12.5)
        }
    else:
        return {
            "phase": "Production Hardening",
            "description": "Enterprise-grade reliability & scale",
            "progress": min(100, (week - 20) * 25)
        }


def generate_week_snapshot(week: int) -> Dict:
    """Generate complete system snapshot for a given week"""

    features = []
    for feature_id in FEATURE_SCHEDULE.keys():
        features.append(generate_feature_snapshot(feature_id, week))

    pipeline = calculate_pipeline_metrics(week)
    journey = calculate_journey_phase(week)

    # Calculate overall completion
    total_progress = sum(f["overall_progress"] for f in features)
    overall_completion = round(total_progress / (len(features) * 100) * 100, 1)

    # Time calculations
    start_date = datetime(2025, 1, 6)
    current_date = start_date + timedelta(weeks=week)
    elapsed_minutes = week * 7 * 24 * 60  # Total minutes elapsed

    return {
        "timestamp": current_date.isoformat() + "Z",
        "week": week,
        "phase": journey["phase"],
        "features": features,
        "pipeline_metrics": pipeline,
        "journey": journey,
        "overall_completion": overall_completion,
        "time_elapsed_minutes": elapsed_minutes,
        "demo_readiness": {
            "status": "operational" if pipeline["success_rate"] >= 75 else "in_progress",
            "critical_blockers": max(0, 6 - sum(1 for f in features if f["status"] == "completed")),
            "features_operational": sum(1 for f in features if f["status"] == "completed"),
            "total_features": len(features)
        }
    }


def generate_longitudinal_dataset(weeks: int = 24) -> Dict:
    """Generate complete 24-week dataset"""

    snapshots = []
    for week in range(1, weeks + 1):
        snapshots.append(generate_week_snapshot(week))

    return {
        "project": "Discrete Connection - BDD Roadmap Progression",
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "total_weeks": weeks,
        "snapshots": snapshots,
        "metadata": {
            "phases": [
                {"name": "Phase 1: Foundation", "weeks": "1-8"},
                {"name": "Phase 2: Collaboration", "weeks": "8-12"},
                {"name": "Phase 3: GitOps & Multi-Cloud", "weeks": "12-16"},
                {"name": "Phase 4: Enterprise", "weeks": "16-24"}
            ],
            "features": list(FEATURE_SCHEDULE.keys())
        }
    }


if __name__ == "__main__":
    dataset = generate_longitudinal_dataset(24)

    # Write to public directory for dashboard
    output_path = "../public/bdd-data/longitudinal-roadmap.json"

    with open(output_path, 'w') as f:
        json.dump(dataset, f, indent=2)

    print(f"✅ Generated 24-week longitudinal dataset")
    print(f"📊 Total snapshots: {len(dataset['snapshots'])}")
    print(f"📁 Output: {output_path}")

    # Print summary statistics
    final_week = dataset['snapshots'][-1]
    print(f"\n📈 Final State (Week 24):")
    print(f"   Overall Completion: {final_week['overall_completion']}%")
    print(f"   Success Rate: {final_week['pipeline_metrics']['success_rate']}%")
    print(f"   Features Complete: {final_week['demo_readiness']['features_operational']}/6")
    print(f"   Phase: {final_week['phase']}")
