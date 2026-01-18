"""
Behave Environment Setup for Dashboard Validation Tests
Purpose: Configure Playwright browser automation for dashboard UI testing
Infrastructure: Real browser (Playwright MCP), real dashboard server
"""

import os
import time
from datetime import datetime


def before_all(context):
    """
    Setup before all tests run
    Configure Playwright MCP integration
    """
    context.test_run_id = f"dashboard-validation-{int(time.time())}"
    context.start_time = datetime.now()
    context.dashboard_url = os.getenv('DASHBOARD_URL', 'http://localhost:3000')

    print(f"\n{'='*60}")
    print(f"Dashboard Validation Test Run: {context.test_run_id}")
    print(f"Dashboard URL: {context.dashboard_url}")
    print(f"Started at: {context.start_time}")
    print(f"{'='*60}\n")

    # Verify dashboard is accessible
    # This will be checked when browser opens


def before_scenario(context, scenario):
    """
    Setup before each scenario
    Initialize browser state tracking
    """
    context.scenario_start_time = time.time()
    context.browser_open = False
    context.current_url = None
    context.current_mode = None
    context.timer_start = None

    # Track resources for cleanup
    context.test_resources = []

    # Playwright MCP will handle browser lifecycle
    # Browser opens on first navigation


def after_scenario(context, scenario):
    """
    Cleanup after each scenario
    Record timing and results
    """
    elapsed = time.time() - context.scenario_start_time

    if scenario.status == 'passed':
        status_icon = '✅'
    elif scenario.status == 'failed':
        status_icon = '❌'
    elif scenario.status == 'skipped':
        status_icon = '⏭️'
    else:
        status_icon = '⚠️'

    print(f"{status_icon} {scenario.name} ({elapsed:.2f}s)")

    # Cleanup resources if needed
    for resource in context.test_resources:
        # Dashboard tests don't create resources, but hook is here for consistency
        pass


def after_all(context):
    """
    Cleanup after all tests
    Generate summary report
    """
    total_time = (datetime.now() - context.start_time).total_seconds()

    print(f"\n{'='*60}")
    print(f"Dashboard Validation Test Summary")
    print(f"{'='*60}")
    print(f"Test Run ID: {context.test_run_id}")
    print(f"Total Duration: {total_time:.2f}s")
    print(f"Completed at: {datetime.now()}")
    print(f"{'='*60}\n")

    # Close browser (Playwright MCP handles cleanup)
    # No explicit browser.close() needed - MCP manages lifecycle
