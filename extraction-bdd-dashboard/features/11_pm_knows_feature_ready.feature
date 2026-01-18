Feature: PM Knows When Feature Is Ready To Ship
  # RESULT: Reduce release decisions by 95% WHEN 95% of features ship when dashboard shows "Ready" (vs 2-day meeting baseline, 0 premature releases)
  # OUTCOME: PM makes confident ship decisions using objective criteria: Decision in <1hr, 0 rollbacks, 100% team trust in dashboard, same-day shipping
  # JTBD: "When deciding whether to ship, I want objective readiness criteria, so I make confident go/no-go decisions without meetings or debates"
  # TECHNICAL BENCHMARKS: <500ms readiness calc, <5s dashboard update

  Background:
    Given Declarative UX Dashboard tracks feature readiness
    And readiness criteria defined: All scenarios passing + character agents approved + 0 critical bugs
    And PM needs to decide: Ship or wait?

  Scenario: PM sees all green and ships confidently
    Given Wink BLE iBeacon feature complete
    And dashboard shows:
      | Readiness Indicator | Status |
      | BDD scenarios | 6 of 6 passing ✅ |
      | Character agents | Approved (Erin/Columbo/Billy) ✅ |
      | Critical bugs | 0 open ✅ |
      | Linter score | 87/100 (green) ✅ |
    When PM views `/wink/features/ble-ibeacon` readiness page
    Then PM sees "Ready to Ship ✅" (all indicators green)
    And PM sees confidence statement: "All criteria met - ship recommended"
    And PM clicks "Ship to Production" button
    And deployment triggered
    And feature ships same day
    And PM made decision in 15 minutes (vs 2-day meeting baseline)
    And post-release: 0 bugs, 0 rollbacks

    # Ship decision speed (observable)
    And context.decision_time_minutes = 15
    And context.all_readiness_criteria_met = true
    And context.post_release_rollbacks = 0

  Scenario: PM sees red indicators and delays ship
    Given Biscuits workspace ownership in development
    And dashboard shows:
      | Readiness Indicator | Status |
      | BDD scenarios | 4 of 5 passing ❌ |
      | Character agents | Approved ✅ |
      | Critical bugs | 1 open (SA provisioning timeout) ❌ |
      | Linter score | 82/100 ✅ |
    When PM views readiness page
    Then PM sees "Not Ready to Ship ⚠️" (blockers present)
    And PM sees blockers:
      - "1 scenario failing: Owner assigns workspace <30s"
      - "1 critical bug: SA provisioning timeout (Issue #42)"
    And PM sees recommendation: "Wait - fix blockers first"
    And "Ship to Production" button disabled
    And PM delays release (avoided premature ship)
    And PM assigns engineer to fix timeout bug
    And next day: All indicators green
    And PM ships with confidence (0 post-release issues)

    # Prevented premature release
    And context.blockers_detected = 2
    And context.premature_ship_prevented = true
    And context.post_release_issues_after_fix = 0

  Scenario: Sales rep uses dashboard to commit customer demo date
    Given sales rep negotiating with customer
    And customer asks: "When can I see workspace ownership demo?"
    And traditional answer: "Maybe Q2?" (useless)
    When sales rep checks dashboard at `/biscuits/features/workspace-ownership`
    Then sales rep sees: "4 of 5 scenarios passing"
    And sales rep sees: "Est. ready: Nov 4 (7 days)" (based on current velocity)
    And sales rep sees: "Confidence: High (87% of features with 80% scenarios passing ship on time)"
    And sales rep commits to customer: "Demo ready Nov 4"
    And Nov 4: Feature ships on time (sales forecast accurate)
    And customer demo successful
    And sales rep trusts dashboard forecasts (uses for future commitments)

    # Sales forecast accuracy (observable)
    And context.forecast_date = "2025-11-04"
    And context.actual_ship_date = "2025-11-04"
    And context.forecast_accuracy = 100  # Percentage
    And context.sales_rep_trusts_dashboard = true
