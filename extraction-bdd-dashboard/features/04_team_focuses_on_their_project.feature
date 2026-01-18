Feature: Team Focuses On Their Project Without Distraction
  # RESULT: Save 5 hrs/month per team WHEN 95% of navigation stays within project route (no context switching)
  # OUTCOME: Team sees only their project data and stays focused: 100% route isolation, 0 confusion incidents, context preserved across sessions
  # JTBD: "When I work on my project, I want to see only my project's data, so I stay focused without being distracted by unrelated products"
  # TECHNICAL BENCHMARKS: <1.5s route load, <300ms SideNav render

  Background:
    Given the Declarative UX Dashboard tracks multiple projects
    And Wink team works on health verification
    And Biscuits team works on Kubeflow fork
    And dashboard has Carbon SideNav with project isolation

  Scenario: Biscuits team sees only Biscuits data
    Given developer is on Biscuits team
    When developer navigates to `/biscuits` route
    Then developer sees "Biscuits: Billable Containers" page title
    And developer sees 4 Biscuits features:
      | Feature | Status |
      | Workspace Ownership | 5 of 8 scenarios passing |
      | Kids Table Security | 3 of 4 scenarios passing |
      | Vault Integration | 6 of 7 scenarios passing |
      | GitOps Deployment | 4 of 5 scenarios passing |
    And developer sees 0 Wink features (completely isolated)
    And developer sees 0 reference to Alice, Bob, health verification
    And Carbon SideNav highlights "Biscuits" section
    And developer stays focused on Biscuits work

    # Navigation isolation (technical)
    And context.features_displayed_project = "biscuits"
    And context.wink_features_rendered = 0  # Zero data leakage
    And context.route_isolation_validated = true

  Scenario: Wink team sees only Wink data
    Given designer is on Wink team
    When designer navigates to `/wink` route
    Then designer sees "Wink: Health Verification" page title
    And designer sees 5 Wink microprototypes:
      | Microprototype | Status |
      | #1 BLE iBeacon | Passing (10m @ 90%) |
      | #2 Lambda SPIFFE | Failing (auth timeout) |
      | #3 Biometric | Passing |
      | #4 APNs Push | Passing |
      | #6 Anonymous Token | Pending |
    And designer sees 0 Biscuits features (completely isolated)
    And designer sees 0 reference to Joel, Bella, Kubeflow, workspace
    And Carbon SideNav highlights "Wink" section
    And designer stays focused on health verification work

    # Context preservation
    And context.features_displayed_project = "wink"
    And context.biscuits_features_rendered = 0  # Zero data leakage
    And context.user_stayed_in_context = true

  Scenario: Team switches projects intentionally without confusion
    Given PM works on both Wink and Biscuits
    And PM is currently viewing `/wink` route
    When PM clicks "Biscuits" in Carbon SideNav
    Then PM navigates to `/biscuits` route
    And PM sees Biscuits data only (Wink data hidden)
    And page title updates: "Biscuits: Billable Containers"
    When PM clicks "Wink" in Carbon SideNav
    Then PM navigates back to `/wink` route
    And PM sees Wink data only (Biscuits data hidden)
    And page title updates: "Wink: Health Verification"
    And PM completes 2 context switches without confusion

    # Navigation clarity (observable)
    And context.context_switches_count = 2
    And context.confusion_incidents = 0  # No "why am I seeing X?" support tickets
    And context.sidenav_highlight_accurate = true  # Visual feedback working

  Scenario: Portfolio view shows efficiency without mixing project data
    Given PM wants to compare Wink vs Biscuits performance
    When PM navigates to `/dux-metrics` route
    Then PM sees portfolio-level metrics (aggregate):
      | Project | Avg Time to Declare | Avg Cycle Time |
      | Wink | 3.2 days | 19 days |
      | Biscuits | 4.1 days | 23 days |
      | Portfolio | 3.7 days | 21 days |
    And PM sees both projects without data mixing (separate rows)
    And PM identifies: "Wink is faster - what can Biscuits learn?"
    And PM clicks "Wink" row → navigates to `/wink` detail view
    And PM stays in Wink context (focused analysis)

    # Portfolio aggregation (not individual)
    And context.projects_displayed = ["wink", "biscuits"]
    And context.data_mixed_in_same_row = false  # Clean separation
    And context.drill_down_preserves_context = true
