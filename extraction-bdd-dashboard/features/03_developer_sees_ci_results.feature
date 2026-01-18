Feature: Developer Sees BDD Results From CI/CD
  # RESULT: Save 10 hrs/month per team WHEN 90% of developers view results in dashboard (vs GitHub Actions logs)
  # OUTCOME: Developer sees test results immediately after push: Results visible <30s, 99% of pushes appear, 0 log checking, framework-agnostic display
  # JTBD: "When I push code, I want to see test results immediately in dashboard, so I don't waste time checking GitHub Actions logs or running tests locally"
  # TECHNICAL BENCHMARKS: <200ms ingestion, <100ms Postgres insert

  Background:
    Given the Declarative UX Dashboard has API ingestion endpoint
    And Wink project CI/CD configured with dashboard integration
    And developer has GitHub Actions workflow posting to `/api/bdd/ingest`

  Scenario: Developer sees test results within 30 seconds of push
    Given developer pushes code to Wink repository
    And GitHub Actions runs BDD tests (behave)
    And CI/CD generates behave-results.json
    When CI/CD POSTs results to `/api/bdd/ingest`
    Then dashboard receives results
    And results stored in Postgres JSONB column
    And developer navigates to `/wink` dashboard route
    And developer sees updated test results within 30 seconds
    And developer sees: "5 of 6 scenarios passing"
    And developer sees: "1 failing: Scenario 3 (BLE detection at 15m)"
    And developer does NOT open GitHub Actions logs

    # Technical benchmarks in context
    And context.api_response_time < 200ms
    And context.postgres_insert_time < 100ms
    And context.dashboard_refresh_time < 30000ms

  Scenario: Developer distinguishes CI results from local results
    Given developer ran tests locally yesterday (6 scenarios passing)
    And developer pushed code today with 1 new failing test
    And CI/CD posted updated results
    When developer views dashboard
    Then developer sees CI/CD results (not local results)
    And developer sees timestamp: "Last run: 2 minutes ago (CI/CD)"
    And developer sees commit SHA: "abc123def"
    And developer sees: "5 of 6 passing (1 regression detected)"
    And developer identifies: "Scenario 3 broke in commit abc123"
    And developer fixes regression

    # Source attribution (CI vs local)
    And context.result_source = "ci_cd"  # Not "local"
    And context.commit_sha_linked = "abc123def"
    And context.github_actions_run_id = "12345678"

  Scenario: Developer sees results from multiple BDD frameworks
    Given Wink uses behave (Python)
    And Biscuits uses cucumber (JavaScript)
    And both projects POST to same `/api/bdd/ingest` endpoint
    When developer views `/wink` dashboard
    Then developer sees behave results parsed correctly
    And developer sees: "6 scenarios, 5 passing (behave format)"
    When developer views `/biscuits` dashboard
    Then developer sees cucumber results parsed correctly
    And developer sees: "12 scenarios, 11 passing (cucumber format)"
    And both formats display consistently (same UI components)
    And developer doesn't notice framework difference (abstracted)

    # Format handling (technical)
    And context.behave_parser_succeeded = true
    And context.cucumber_parser_succeeded = true
    And context.parsers_unified_to_common_schema = true

  Scenario: Developer gets notified when CI/CD integration breaks
    Given Wink CI/CD was posting results successfully
    And API key rotated (expired)
    When CI/CD attempts to POST results
    Then dashboard API returns 401 Unauthorized
    And developer sees dashboard alert: "CI/CD integration broken for Wink"
    And developer sees fix instructions: "Regenerate API key in settings"
    And developer regenerates key
    And developer updates GitHub Actions secret
    And next CI run succeeds
    And developer sees results within 30 seconds

    # Error visibility (not silent failure)
    And context.failed_post_attempts_tracked = 3  # How many failed before fix
    And context.time_to_fix = 10  # Minutes to resolve
