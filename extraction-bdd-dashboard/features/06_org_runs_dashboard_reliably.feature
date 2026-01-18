Feature: Org Runs Dashboard In Production Without DevOps Expertise
  # RESULT: Expand addressable market 10x WHEN 95% of non-technical orgs deploy successfully in first month (vs requiring DevOps team)
  # OUTCOME: Org deploys and runs dashboard reliably: <1hr deployment, 99.9% uptime, auto-recovery from failures, 0 support tickets
  # JTBD: "When I want to adopt Declarative UX, I want dashboard running reliably without hiring DevOps, so multiple teams can use methodology immediately"
  # TECHNICAL BENCHMARKS: <60min deploy, <30s failover, <200ms health check

  Background:
    Given org wants to adopt Declarative UX methodology
    And org has 2 product teams (Wink + Biscuits)
    And org has no dedicated DevOps engineer

  Scenario: Non-technical PM deploys dashboard to Vercel in under 1 hour
    Given PM has Vercel account (free tier)
    And PM has never deployed a Next.js app
    When PM clicks "Deploy to Vercel" button in README
    Then Vercel imports dashboard repository
    And Vercel auto-detects Next.js framework
    And Vercel provisions Postgres database addon
    And deployment completes in 45 minutes
    And PM sees dashboard URL: `https://acme-dux.vercel.app`
    And PM navigates to URL
    And dashboard loads successfully
    And PM sees "No projects configured yet" welcome screen
    And PM follows guided setup (adds Wink + Biscuits projects)
    And dashboard ready for team use in <1 hour total

    # Deployment simplicity (observable)
    And context.total_deployment_time = 45  # Minutes
    And context.manual_steps_required = 3   # Click button, add projects, done
    And context.devops_expertise_required = false

  Scenario: Dashboard auto-recovers when Postgres unavailable
    Given dashboard running in production
    And 2 teams actively using dashboard
    And Postgres database goes down (infrastructure failure)
    When team member navigates to `/wink` route
    Then dashboard detects Postgres unavailable
    And dashboard falls back to GitHub API (reads .feature files from repo)
    And team member sees Wink data (slightly stale, but functional)
    And team member sees notice: "Using cached data (DB reconnecting)"
    And Postgres recovers after 5 minutes
    And dashboard auto-reconnects to Postgres
    And team member sees "Live data restored" notification
    And team member experienced 0 downtime (transparent failover)

    # Failover resilience (technical)
    And context.postgres_downtime = 300  # 5 minutes
    And context.user_experienced_downtime = 0  # Transparent failover
    And context.github_api_fallback_triggered = true
    And context.auto_reconnect_succeeded = true

  Scenario: Org tracks uptime to prove reliability
    Given dashboard running for 30 days (Month 6)
    And org tracks uptime via health check endpoint
    When org reviews uptime dashboard
    Then org sees: "Uptime: 99.92% (30 days)"
    And org sees: "2 incidents (both auto-recovered <30s)"
    And org sees: "0 user-reported downtime"
    And org sees: "Mean time to recovery: 18 seconds"
    And org approves dashboard for production use (proven reliable)
    And org expands adoption to 3rd team (confidence established)

    # Reliability proof (aggregate)
    And context.uptime_percentage = 99.92
    And context.incident_count = 2
    And context.auto_recovery_count = 2  # All incidents auto-recovered
    And context.mean_time_to_recovery_seconds = 18

  Scenario: Org self-hosts dashboard using Docker Compose
    Given org has security requirement (no external SaaS)
    And org has Docker installed (no Kubernetes)
    When org runs `docker-compose up -d` from README
    Then Docker Compose starts 3 containers:
      | Container | Purpose |
      | dashboard-app | Next.js application |
      | dashboard-db | Postgres database |
      | dashboard-nginx | Reverse proxy |
    And dashboard accessible at `http://localhost:3000`
    And org sees health dashboard: "All systems operational"
    And org configures projects via `dashboard-config.yml`
    And Wink + Biscuits teams start using dashboard
    And org maintains full data control (no external SaaS)

    # Self-hosted simplicity
    And context.deployment_method = "docker_compose"
    And context.kubernetes_required = false
    And context.devops_expertise_required = false
    And context.data_sovereignty_maintained = true

  Scenario: Org monitors dashboard health without becoming SRE
    Given dashboard running in production
    And org has no dedicated SRE
    When PM views `/health` dashboard route
    Then PM sees traffic light system:
      | Component | Status |
      | Next.js App | 🟢 Healthy (99.9% uptime) |
      | Postgres DB | 🟢 Healthy (2ms avg latency) |
      | GitHub API | 🟢 Healthy (fallback tested) |
      | CI/CD Ingestion | 🟢 Healthy (87 posts/day) |
    And PM sees simple indicators (green = good, yellow = warning, red = down)
    And PM doesn't need to understand: metrics, logs, traces, dashboards
    And PM sees "All systems operational" summary
    And PM confident dashboard is working

    # Observability without SRE expertise
    And context.health_check_complexity_level = "traffic_light"  # Not Prometheus queries
    And context.sre_expertise_required = false
    And context.pm_understands_health_status = true
