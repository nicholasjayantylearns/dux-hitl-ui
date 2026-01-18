Feature: Character Agents Prevent Bad Specs From Becoming Bad Code
  # RESULT: Reduce post-launch bugs by 60% WHEN 95% of specs pass character agents on ≤2 attempts (vs 80% baseline bug rate)
  # OUTCOME: Character agents reject bad specs pre-development: Rejected in <5min, actionable fix provided, 0 bad specs reach development, 95% pass in ≤2 attempts
  # JTBD: "When I write a spec, I want automated quality gates to catch errors early, so I don't waste weeks building the wrong solution or shipping bugs"
  # TECHNICAL BENCHMARKS: <10s validation, <2s rejection reason generation

  Background:
    Given Declarative UX Dashboard has character agent integration
    And Erin validates evidence links
    And Columbo validates observable signals
    And Billy validates business outcomes

  Scenario: PM is able to fix Problem evidence gaps using Erin's feedback rapidly
    Given PM writing Problem object for Biscuits workspace ownership
    And PM's Problem missing evidence field
    When PM clicks "Validate with Character Agents"
    Then Erin runs validation
    And Erin rejects: "Missing evidence links - cannot validate problem is real"
    And dashboard shows rejection reason with example:
      ```
      Add evidence field:
      "evidence": ["EV-20240315-platform-survey"]
      ```
    And PM adds evidence link to Platform Ops survey
    And PM re-runs validation
    And Erin approves ✅
    And PM fixed issue in <10 minutes
    And 93% of Erin rejections get fixed in <15 minutes (actionable feedback)
    And PM learns pattern (observable: 0 missing evidence in next spec)
    And PM feels productive (observable: fixes issue without asking for clarification)

    # Erin validation (observable)
    And context.erin_rejection_count = 1
    And context.erin_approval_after_fix = true
    And context.time_to_fix = 8  # Minutes

  Scenario: Designer is able to replace subjective signals using Columbo's guidance
    Given designer writing Behavior for Wink health status delivery
    And designer's Behavior has signal: "user_feels_confident"
    When designer runs character agent validation
    Then Columbo runs validation
    And Columbo rejects: "Signal 'user_feels_confident' is not observable - feelings can't be measured"
    And dashboard suggests observable alternatives:
      | Subjective Signal | Observable Alternative |
      | user_feels_confident | health_status_received_under_2min |
      | user_is_satisfied | user_returned_next_day |
    And designer replaces with "health_status_received_under_2min"
    And designer re-runs validation
    And Columbo approves ✅
    And designer learned: Signals must be loggable events
    And 89% of Columbo rejections lead to observable replacements (learning sticks)
    And designer feels confident (observable: 0 subjective signals in remaining scenarios)
    And designer applies pattern (observable: next spec has 100% observable signals)

    # Columbo validation (observable)
    And context.columbo_rejection_count = 1
    And context.subjective_signals_flagged = 1
    And context.designer_corrected_to_observable = true

  Scenario: PM is able to add measurable outcomes using Billy's requirements
    Given PM writing Result for Biscuits launch
    And PM's Result says: "Improve platform adoption"
    And PM missing success_criteria and success_metrics fields
    When PM runs character agent validation
    Then Billy runs validation
    And Billy rejects: "Target impact not measurable - how will you know if adoption improved?"
    And dashboard shows required fields:
      ```
      Add:
      "success_criteria": "Platform adoption >90% (vs 60% baseline)"
      "success_metrics": ["workspace_activation_rate"]
      ```
    And PM adds measurable criteria
    And PM re-runs validation
    And Billy approves ✅
    And PM defined success in <15 minutes
    And 91% of Billy rejections get fixed with measurable criteria (clear guidance)
    And PM learns discipline (observable: next spec includes success metrics from start)
    And PM feels accountable (observable: commits to measurable business outcome)

    # Billy validation (observable)
    And context.billy_rejection_count = 1
    And context.unmeasurable_results_flagged = 1
    And context.pm_added_measurable_criteria = true

  Scenario: PM is able to pass all three agents on first try with well-formed spec
    Given PM writing spec for Wink microprototype #1
    And spec has:
      - Problem with evidence links (Erin requirement)
      - Behaviors with observable signals (Columbo requirement)
      - Result with measurable outcomes (Billy requirement)
    And linter score 87/100 (green)
    When PM runs character agent validation
    Then Erin validates → Approved ✅ (evidence present)
    And Columbo validates → Approved ✅ (signals observable)
    And Billy validates → Approved ✅ (outcomes measurable)
    And spec status changes to "Declared Complete"
    And PM avoided rejection cycle (0 iterations needed)
    And time_to_declare = 3.2 days
    And 95% of specs scoring ≥80 pass agents on ≤2 attempts (quality threshold works)
    And PM feels confident (observable: 0 anxiety about validation outcome)
    And PM's workflow accelerates (observable: declares in 3.2 days vs 5-day baseline)

    # Zero rejection success path
    And context.character_agent_rejections = 0
    And context.validation_attempts = 1  # Passed first try
    And context.spec_quality_score = 87

  Scenario: PM is able to prove 60% bug reduction using character agent validation
    Given 10 features shipped using Declarative UX (Months 1-6)
    And all specs validated by character agents before development
    And dashboard tracks post-launch bug rate
    When PM views `/dux-metrics` portfolio dashboard
    Then PM sees: "Post-launch bugs: 2 out of 10 features (20% bug rate)"
    And PM compares to baseline: "Traditional: 8 out of 10 features (80% bug rate)"
    And PM sees: "60% reduction in post-launch bugs"
    And PM sees proof: "Character agents prevented 6 bad specs from reaching development"
    And 95% of validated specs ship with ≤1 post-launch bug (quality gates work)
    And PM presents metric to executive: "Quality baked in, not tested in"
    And PM feels vindicated (observable: methodology gets executive buy-in)
    And PM secures budget (observable: executive approves expansion to 5 more teams)

    # Portfolio quality proof (aggregate)
    And context.features_shipped = 10
    And context.post_launch_bugs = 2  # 20% bug rate
    And context.baseline_bug_rate = 80  # Traditional approach
    And context.bug_reduction_percentage = 60
