Feature: PM Coordinates Team Around Shared Dashboard
  # RESULT: Save 3 hrs/week WHEN 80% of status questions eliminated and standups <15min (vs 30-min baseline)
  # OUTCOME: Team self-serves from shared dashboard: 80% fewer status questions, standups <15min, 0 conflicting info, PM saves 3 hrs/week
  # JTBD: "When coordinating my team, I want everyone to see the same realtime progress, so we stay aligned without status meetings or email updates"
  # TECHNICAL BENCHMARKS: <2s dashboard refresh, >100 concurrent users

  Background:
    Given cross-functional team working on Wink (PM, designer, 2 engineers)
    And all team members have dashboard access
    And dashboard shows real-time progress

  Scenario: Team checks dashboard instead of asking PM for status
    Given Wink feature in development (Day 5 of sprint)
    And designer wants to know: "Are scenarios written?"
    And engineer wants to know: "Can I start coding?"
    When team members view `/wink` dashboard (instead of Slack PM)
    Then designer sees: "6 scenarios written, linter score 87/100, spec declared ✅"
    And designer knows: "Spec is ready, I can create A/B variants"
    And engineer sees: "Spec declared complete, 0 blockers"
    And engineer knows: "I can start implementation today"
    And PM receives 0 status questions (team self-served)
    And PM saves 30 minutes answering questions

    # Status self-service (observable)
    And context.status_questions_to_pm = 0  # Was 5/day baseline
    And context.team_self_served_from_dashboard = true
    And context.pm_time_saved_minutes = 30

  Scenario: Standup uses dashboard instead of round-robin updates
    Given daily standup meeting (team of 4)
    And traditional standup: Each person reports (15 min total)
    When PM opens dashboard on shared screen
    Then PM says: "Check dashboard - what's blocked?"
    And team sees:
      | Person | Item | Status |
      | Sarah (PM) | Spec declared | ✅ Done (3.2 days) |
      | Mike (Designer) | A/B variants | 🟡 In progress (Variant A done, B pending) |
      | Lisa (Engineer) | Implementation | 🟢 4 of 6 scenarios passing |
      | Tom (Engineer) | Bug fix | 🔴 Blocked (needs SA provisioning fix) |
    And team focuses on Tom's blocker only (1 topic, not 4 updates)
    And standup completes in 8 minutes (vs 15-minute baseline)
    And team saved 7 minutes
    And team aligned on priority: Help Tom unblock

    # Meeting efficiency (observable)
    And context.standup_duration_minutes = 8
    And context.baseline_duration = 15
    And context.time_saved = 7
    And context.blockers_identified = 1

  Scenario: PM shares dashboard with stakeholders instead of writing status email
    Given PM needs to update VP on Biscuits progress
    And traditional approach: PM writes status email (30 minutes)
    When PM sends dashboard link: `/biscuits/summary`
    Then VP views dashboard
    And VP sees: "5 of 8 scenarios passing, 3 in development"
    And VP sees: "Time to declare: 4.1 days (within 5-day target)"
    And VP sees: "Est. ship date: Nov 12 (based on velocity)"
    And VP satisfied with update (0 follow-up questions)
    And PM saved 30 minutes (no email writing)
    And VP can check anytime (no waiting for PM's weekly update)

    # Stakeholder communication (observable)
    And context.status_email_writing_time_saved = 30  # Minutes
    And context.vp_follow_up_questions = 0
    And context.vp_can_self_serve = true
