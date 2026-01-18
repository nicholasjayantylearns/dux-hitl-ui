Feature: Sales Rep Forecasts Ship Dates With Confidence
  # RESULT: Improve forecast accuracy from 40% to 85% WHEN 85% of dates accurate within ±3 days (closes deals 2 weeks faster)
  # OUTCOME: Sales commits accurate dates using velocity data: 85% accurate ±3 days, customer trusts commitment, deal closes, proactive updates when velocity changes
  # JTBD: "When negotiating with customers, I want accurate ship date forecasts, so I commit credibly without promising vaporware or losing trust"
  # TECHNICAL BENCHMARKS: <500ms velocity calculation, <1s forecast algorithm

  Background:
    Given Declarative UX Dashboard tracks time_to_declare and cycle_time
    And dashboard calculates velocity trends
    And sales rep negotiating with customer

  Scenario: Sales rep commits accurate demo date based on dashboard
    Given customer asks: "When can I see workspace ownership demo?"
    And Biscuits feature shows: "5 of 8 scenarios passing"
    When sales rep checks dashboard velocity
    Then sales rep sees: "Current velocity: 1.2 scenarios/day"
    And sales rep sees: "3 scenarios remaining"
    And sales rep sees: "Est. complete: Nov 4 (±2 days, 80% confidence)"
    And sales rep commits to customer: "Demo ready Nov 4"
    And Nov 4: Feature ships (5 days early actually - Nov 1)
    And sales rep delivers demo Nov 4 as promised
    And customer impressed: "You hit your date exactly"
    And deal closes (customer trusts execution capability)

    # Forecast accuracy (observable)
    And context.committed_date = "2025-11-04"
    And context.actual_ship_date = "2025-11-01"
    And context.forecast_delta_days = -3  # 3 days early (within ±3 target)
    And context.customer_trust_increased = true
    And context.deal_closed = true

  Scenario: Sales rep updates customer when velocity changes
    Given sales rep committed demo for Nov 10
    And Biscuits team velocity slowed (blocker discovered)
    And dashboard updates forecast: "Est. complete: Nov 15 (±3 days)"
    When sales rep checks dashboard next day
    Then sales rep sees forecast changed: Nov 10 → Nov 15
    And sales rep sees reason: "Velocity decreased (blocker: SA provisioning bug)"
    And sales rep proactively emails customer: "Demo delayed to Nov 15 due to technical issue"
    And customer appreciates transparency (vs surprise delay)
    And sales rep maintains trust by being proactive
    And Nov 15: Demo delivered as updated forecast

    # Proactive communication (observable)
    And context.forecast_updated = true
    And context.sales_rep_notified_customer_proactively = true
    And context.customer_surprised_by_delay = false
    And context.trust_maintained = true

  Scenario: Sales rep shows dashboard to customer during negotiation
    Given customer skeptical: "Can you really deliver this?"
    And customer burned by previous vendor (promised Q2, delivered Q4)
    When sales rep shares dashboard link (read-only access)
    Then customer sees: "Biscuits: 5 of 8 scenarios passing"
    And customer sees: "Time to declare: 4.1 days (on pace)"
    And customer sees: "Historical accuracy: 85% of features ship ±3 days of forecast"
    And customer sees live progress (not sales promises)
    And customer trusts: "This is real data, not vapor"
    And customer signs contract (credibility established)
    And sales cycle shortened by 2 weeks (customer confidence accelerated decision)

    # Credibility through transparency (observable)
    And context.customer_viewed_dashboard = true
    And context.customer_trust_level = "high"  # vs "skeptical" baseline
    And context.sales_cycle_shortened_days = 14
    And context.contract_signed = true
