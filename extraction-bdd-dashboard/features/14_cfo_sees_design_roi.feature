Feature: CFO Sees Design Team ROI In Dashboard Metrics
  # RESULT: Protect design team (100% retention) WHEN CFO sees measurable ROI in <5min (vs 39% Fortune 500 elimination baseline)
  # OUTCOME: CFO approves design budget using objective metrics: ROI visible in <5min, budget approved same meeting, design team protected, $560K cost avoidance proven
  # JTBD: "When reviewing design budget, I want objective ROI metrics, so I approve investment based on data instead of cutting roles like 39% of Fortune 500"
  # TECHNICAL BENCHMARKS: <1s ROI calculation, <500ms cost aggregation

  Background:
    Given Declarative UX Dashboard tracks portfolio metrics
    And CFO reviewing design team budget
    And CFO asks: "What ROI are we getting from design?"

  Scenario: CFO sees cycle time savings in dollars
    Given Wink shipped in 19 days using Declarative UX
    And Biscuits shipped in 23 days
    And traditional approach averages 77 days (11 weeks)
    When CFO views `/dux-metrics/roi` dashboard
    Then CFO sees:
      | Project | Declarative UX | Traditional | Time Saved | Cost Savings |
      | Wink | 19 days | 77 days | 58 days | $290K (58 days × $5K/day) |
      | Biscuits | 23 days | 77 days | 54 days | $270K |
      | Portfolio | 21 days avg | 77 days avg | 56 days avg | $560K total |
    And CFO sees ROI: "Design team delivered $560K cost avoidance in 6 months"
    And CFO sees velocity: "3.7x faster time-to-market"
    And CFO approves design budget for next year
    And design team protected from layoffs

    # Business ROI (observable)
    And context.cost_savings_total = 560000  # $560K
    And context.velocity_multiple = 3.7  # 3.7x faster
    And context.design_budget_approved = true
    And context.design_team_layoffs = 0

  Scenario: CFO compares design team ROI to marketing team
    Given CFO evaluating design vs marketing investment
    And marketing team cost: $800K/year
    And design team cost: $600K/year
    When CFO views comparative ROI dashboard
    Then CFO sees:
      | Team | Annual Cost | Measurable ROI | ROI Multiple |
      | Marketing | $800K | $1.2M revenue (campaigns) | 1.5x |
      | Design | $600K | $560K cost avoidance + 3.7x velocity | 0.93x direct + velocity gain |
    And CFO sees design comment: "Marketing drives revenue, Design accelerates all teams"
    And CFO sees: "Design 3.7x velocity multiplier applies to engineering ($2M/year team)"
    And CFO calculates: "3.7x eng velocity = $7.4M effective capacity vs $2M cost"
    And CFO approves both budgets (design ROI proven through leverage)
    And design leader answered: "We multiply everyone's velocity"

    # Comparative ROI (observable)
    And context.design_cost = 600000
    And context.design_roi_direct = 560000
    And context.design_velocity_multiplier = 3.7
    And context.engineering_team_cost = 2000000
    And context.effective_capacity_increase = 7400000  # 3.7x leverage
    And context.cfo_approved_design_budget = true

  Scenario: CFO sees post-launch bug reduction savings
    Given 10 features shipped using Declarative UX
    And post-launch bug rate: 20% (2 of 10 features)
    And traditional baseline: 80% bug rate (8 of 10 features)
    When CFO views quality metrics dashboard
    Then CFO sees: "Post-launch bugs: 2 (vs 8 traditional baseline)"
    And CFO sees: "6 bugs prevented by character agents"
    And CFO sees cost avoidance: "6 bugs × $15K avg fix cost = $90K saved"
    And CFO sees: "Zero critical production incidents (vs 2 baseline)"
    And CFO sees: "Customer trust maintained (no emergency fixes)"
    And CFO approves design methodology (quality = cost savings)

    # Quality ROI (observable)
    And context.bugs_prevented = 6
    And context.bug_fix_cost_avg = 15000
    And context.cost_avoidance_from_quality = 90000  # $90K
    And context.production_incidents = 0
