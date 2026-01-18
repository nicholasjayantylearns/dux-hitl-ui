Feature: PM Tracks Time-to-Declare For Accountability
  # RESULT: Reduce spec refinement by 65% WHEN 80% of PMs complete in <5 days (vs 14-day baseline = 2.8x faster)
  # OUTCOME: PM tracks time-to-declare and stays accountable: Live countdown visible, bottleneck identified in <1 day, 30% velocity improvement, on-pace indicator
  # JTBD: "When I'm refining a spec, I want to see how long it's taking, so that I know if I'm on pace and can identify where I'm stuck"
  # TECHNICAL BENCHMARKS: <100ms time calculation, <500ms trend chart render

  Background:
    Given Declarative UX Dashboard tracks time_to_declare metric
    And PM opened issue 4 days ago
    And PM has been refining spec

  Scenario: PM is able to stay on pace using live countdown and confidence indicator
    Given PM opened Wink issue 2.5 days ago
    And target time_to_declare is <5 days
    When PM views dashboard
    Then PM sees "Time to Declare: 2.5 days" (live counter)
    And PM sees "Target: <5 days" (2.5 days remaining)
    And PM sees status: "On pace ✅" (green indicator)
    And PM sees linter score: 82/100 (near completion)
    And PM knows: "I'm on track, keep going"
    And 87% of PMs on-pace at day 2.5 complete in <5 days (reliable predictor)
    And PM continues refinement with confidence
    And PM feels accountable (observable: checks dashboard 3x/day when on pace)
    And PM maintains velocity (observable: completes spec in 3.2 days total)

    # Accountability visibility (observable)
    And context.time_elapsed = 2.5  # Days since issue opened
    And context.time_remaining = 2.5  # Days to target
    And context.on_pace_indicator = true

  Scenario: PM is able to identify delay and accelerate using bottleneck visibility
    Given PM opened Biscuits issue 6 days ago
    And target is <5 days
    And PM exceeded target by 1 day
    When PM views dashboard
    Then PM sees "Time to Declare: 6.0 days" (red - exceeded target)
    And PM sees "Target: <5 days" (1 day overdue)
    And PM sees status: "Behind pace ⚠️" (yellow/red indicator)
    And PM sees bottleneck: "Spent 3 days stuck at 45/100 linter score"
    And PM escalates: Asks for help with missing layers
    And PM completes spec next day (7 days total)
    And PM learns: "Don't spend 3 days stuck - ask for help earlier"
    And 78% of PMs behind-pace at day 6 complete within 2 days after escalation (recovery works)
    And PM feels supported (observable: receives help within 2 hours of asking)
    And PM applies learning (observable: next spec completes in <5 days with early escalation)

    # Bottleneck detection (observable)
    And context.days_overdue = 1
    And context.bottleneck_identified = "stuck_at_low_linter_score"
    And context.time_stuck_at_45 = 3  # Days

  Scenario: PM is able to compare velocity to portfolio and identify best practices
    Given PM completed Wink spec in 3.2 days
    And portfolio average is 4.1 days
    When PM views dashboard performance metrics
    Then PM sees "Your time_to_declare: 3.2 days"
    And PM sees "Portfolio average: 4.1 days"
    And PM sees "You're 22% faster than average ✅"
    And PM sees personal trend: "Spec 1: 7 days → Spec 2: 4 days → Spec 3: 3.2 days"
    And PM sees improvement: "Getting 2x faster over 3 specs"
    And 84% of PMs viewing velocity comparisons improve next spec by ≥15% (motivating)
    And PM shares best practice: "Use 5-layer template from start"
    And PM feels motivated (observable: shares learning with 3 teammates unprompted)
    And PM accelerates team (observable: teammates adopt template, avg drops to 3.5 days)

    # PM performance vs portfolio (not individual blame)
    And context.pm_time_to_declare = 3.2
    And context.portfolio_avg = 4.1
    And context.performance_delta_percentage = -22  # 22% faster
    And context.improvement_trend = "accelerating"

  Scenario: Design leader is able to identify team-wide bottleneck and improve velocity 40%
    Given 3 PMs on team completing specs
    And dashboard tracks all time_to_declare metrics
    When design leader views team performance dashboard
    Then design leader sees:
      | PM | Spec | Time to Declare | Bottleneck |
      | Sarah | Wink #1 | 3.2 days | 0.3 days at <60 score |
      | Mike | Biscuits | 7.0 days | 4 days at <60 score |
      | Lisa | Wink #2 | 4.1 days | 1.2 days at <60 score |
    And design leader identifies pattern: "Team struggles with 5-layer structure"
    And design leader runs training: "How to use template"
    And next round of specs: All complete in <4 days
    And team velocity improves 40%
    And 92% of teams running training after bottleneck detection improve velocity by ≥30% (intervention works)
    And design leader feels effective (observable: presents 40% improvement to executives)
    And design leader scales practice (observable: trains 3 additional teams on template usage)

    # Team-level learning (aggregate)
    And context.team_avg_time_to_declare_before = 4.8
    And context.team_avg_time_to_declare_after = 3.4
    And context.velocity_improvement = 40  # Percentage
    And context.training_intervention_worked = true
