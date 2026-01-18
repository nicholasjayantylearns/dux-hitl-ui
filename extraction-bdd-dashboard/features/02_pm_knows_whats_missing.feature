Feature: PM Knows What's Missing From Spec
  # RESULT: Reduce spec iteration time by 50% WHEN 80% of PMs fix linter errors in <1 day (vs 1.6-day baseline)
  # OUTCOME: PM sees missing layers and fixes rapidly: 80% progress 45→80 score in <2 days, <1 day per fix, 0 character agent rejections
  # JTBD: "When my spec has errors, I want to know exactly what's missing, so I can fix it quickly without trial-and-error or character agent rejection"
  # TECHNICAL BENCHMARKS: <3s linter execution, <500ms breakdown render

  Background:
    Given the Declarative UX Dashboard is running with quality linter integration
    And PM has committed BDD spec to Git
    And linter runs automatically on commit

  Scenario: PM is able to identify missing layer and fix it rapidly
    Given PM's Wink spec has linter score 45/100 (red)
    And dashboard shows "Time in Refinement: 1.2 days"
    When PM views dashboard linter breakdown
    Then PM sees 5-layer checklist:
      | Layer | Status |
      | Result header | ❌ Missing |
      | Outcome header | ✅ Present |
      | Success Criteria | ❌ Missing |
      | Acceptance Criteria | ✅ Present |
      | Technical Benchmarks | ✅ In steps only |
    And PM sees actionable message: "Add Result header describing business impact"
    And PM sees example: "# RESULT: Reduce fraud detection time by 50%"
    And PM adds Result + Success Criteria headers
    And PM commits changes
    And linter re-runs → Score: 82/100 (green)
    And PM fixed issues in 0.3 days (<1 day target ✅)
    And 90% of PMs using linter fix errors in <1 day (rapid iteration)
    And PM knows exactly what to add (observable: 0 trial-and-error commits)
    And PM feels productive (observable: progresses from 45→82 without asking for help)

    # Technical signals
    And context.linter_execution_time < 3000ms
    And context.breakdown_render_time < 500ms

  Scenario: PM is able to replace subjective criteria with observable signals
    Given PM's Biscuits spec has linter score 67/100 (yellow)
    And dashboard highlights Line 12: "users feel confident"
    When PM views linter details
    Then PM sees flagged issue: "Subjective acceptance criteria detected"
    And PM sees suggestion: "Replace with observable: '82% of users return next day'"
    And PM sees anti-pattern explanation: "Self-reported confidence can't be measured"
    And PM replaces "feel confident" with "82% return next day"
    And linter re-runs → Score: 87/100
    And dashboard shows improvement: 67 → 87 (+20 points)
    And PM spent 0.5 days fixing (fast iteration ✅)
    And 88% of flagged subjective criteria get fixed to observable (learning sticks)
    And PM learns anti-pattern (observable: 0 subjective criteria in next spec)
    And PM feels empowered (observable: improves score +20 points independently)

    # Observable progress tracking (aggregate)
    And context.subjective_criteria_flagged_count = 3  # How many found
    And context.subjective_criteria_fixed_count = 3    # All fixed
    And context.fix_time_avg = 0.5  # Days to fix all 3

  Scenario: PM is able to track score progression and identify bottlenecks for continuous improvement
    Given PM has been refining spec for 2.8 days
    And linter has run 5 times (on each commit)
    When PM views dashboard trend chart
    Then PM sees score progression:
      | Day | Score | Time Spent |
      | 0.0 | 45/100 | - |
      | 1.2 | 45/100 | 1.2 days (stuck!) |
      | 1.8 | 67/100 | 0.6 days |
      | 2.5 | 82/100 | 0.7 days |
      | 2.8 | 87/100 | 0.3 days |
    And PM identifies bottleneck: "Spent 1.2 days stuck at 45/100 (missing layers)"
    And PM learns: "Use 5-layer template next time to avoid 1.2-day delay"
    And 82% of PMs viewing progression data identify bottleneck patterns (effective learning)
    And PM shares insight with team (improve process)
    And PM applies learning (observable: next spec starts at 67/100 with template)
    And PM accelerates velocity (observable: next spec completes 40% faster)

    # Portfolio-level learning (not individual tracking)
    And context.portfolio_avg_time_at_45 = 0.8  # Portfolio average for <60 band
    And context.this_spec_time_at_45 = 1.2      # This spec exceeded average
    And context.improvement_opportunity = "Start with template" # Actionable insight

  Scenario: PM is able to avoid character agent rejection using linter preview
    Given PM's spec has linter score 87/100 (green)
    And dashboard shows "Ready for character agent validation"
    When PM clicks "Validate with Erin/Columbo/Billy"
    Then character agents run validation
    And Erin approves (evidence links present)
    And Columbo approves (signals observable)
    And Billy approves (business outcome measurable)
    And spec status changes to "Declared Complete"
    And PM avoided rejection (0 rejection cycles)
    And time_to_declare = 2.8 days (<5 day target ✅)
    And 92% of specs scoring ≥80 pass character agents on first try (accurate prediction)
    And PM feels confident submitting (observable: 0 hesitation or peer reviews before submission)
    And PM's workflow accelerates (observable: declares 2.8 days vs 5-day baseline)

    # Success metric: Rejection avoidance
    And context.character_agent_rejection_rate = 0  # Zero rejections
    And context.linter_predicted_approval = true    # Linter correctly predicted agents would approve
