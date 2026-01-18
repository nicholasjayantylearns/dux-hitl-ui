Feature: Executive Compares Design Team Performance To Industry
  # RESULT: Answer "Is Design Dead?" and protect team (>90% retention) WHEN design team outperforms on 5 metrics (vs 39% Fortune 500 elimination, -15-20% salaries)
  # OUTCOME: Executive defends design team using industry comparison: Team outperforms on 5 metrics, retention approved, budget increased, salaries protected vs -15-20% decline
  # JTBD: "When board challenges design value, I want performance data vs industry baselines, so I protect high-performing teams instead of following 39% elimination trend"
  # TECHNICAL BENCHMARKS: <1s comparison calculation, daily industry data refresh

  Background:
    Given Declarative UX Dashboard tracks portfolio performance
    And dashboard includes industry baseline data (Fast Company research)
    And executive reviewing design team during budget cycle

  Scenario: Executive sees team outperforms "Is Design Dead?" baseline
    Given industry baseline (Fast Company March 2024):
      - 39% of Fortune 500 cut top design levels
      - Salaries down 15-20%
      - Only 1 CDO hired in H2 2023
      - Design leaders can't articulate ROI ("crickets" when asked for breakthrough)
    When executive views `/dux-metrics/industry-comparison`
    Then executive sees team performance vs baseline:
      | Metric | This Team | Industry Baseline | Delta |
      | Design team retention | 100% (5 of 5 roles) | 61% (39% eliminated) | +39% ✅ |
      | Salary trajectory | Stable | -15 to -20% | +15-20% ✅ |
      | Time to market | 21 days avg | 77 days | 3.7x faster ✅ |
      | Can cite breakthrough | Yes (Wink 19-day proof) | No ("crickets") | ✅ |
      | Reports to CEO | Yes | 16% only | Top tier ✅ |
    And executive sees: "This team outperforms industry on all 5 metrics"
    And executive protects team from cuts
    And executive increases budget (reward high performance)

    # Team protection (observable)
    And context.design_team_headcount_change = 0  # No layoffs
    And context.salary_trajectory = "stable"  # vs -15-20% industry
    And context.budget_approved = true
    And context.team_protected_from_cuts = true

  Scenario: Executive cites design team when challenged by board
    Given board member asks: "Why do we still have a design team?"
    And board cites: "39% of Fortune 500 cut design - should we follow?"
    When executive references dashboard
    Then executive shows: "Our team ships 3.7x faster than industry (21 days vs 77 days)"
    And executive shows: "Cost avoidance: $560K in 6 months"
    And executive shows: "Post-launch bugs: 20% vs 80% baseline (60% reduction)"
    And executive shows: "Sales forecast accuracy: 85% vs 40% baseline"
    And executive says: "Cutting this team would slow us 3.7x - that's $2M opportunity cost"
    And board approves design team retention
    And executive protected team using data (not opinion)

    # Board-level defense (observable)
    And context.board_challenged_design_value = true
    And context.executive_cited_dashboard_metrics = true
    And context.board_approved_retention = true
    And context.defense_successful = true

  Scenario: Executive identifies when team needs support vs when to cut
    Given executive manages 3 product teams
    And Team A (Wink): 3.2 days avg time_to_declare
    And Team B (Biscuits): 4.1 days avg
    And Team C (Product X): 12 days avg (struggling)
    When executive views team comparison dashboard
    Then executive sees:
      | Team | Time to Declare | Trend | Action |
      | Wink | 3.2 days | ✅ Improving | Protect + reward |
      | Biscuits | 4.1 days | → Stable | Protect |
      | Product X | 12 days | 🔴 Degrading | Support or restructure |
    And executive sees Team X bottleneck: "Stuck at <60 linter score for 8 days"
    And executive sees recommendation: "Team X needs training on 5-layer structure"
    And executive funds training (not immediate cuts)
    And Team X improves to 5 days avg after training
    And executive protected productive teams, helped struggling team

    # Data-driven team management (observable)
    And context.teams_protected_from_cuts = 2  # Wink + Biscuits
    And context.teams_given_support = 1  # Product X
    And context.teams_cut_without_support = 0  # Evidence-based decisions
    And context.product_x_improved_after_training = true
