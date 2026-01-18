/*
 * ITERATION LOG
 *
 * Iteration 1: Initial API route implementation
 * - Created API route with mode parameter support
 * - JSON file reading from specs/mockups/
 * - TypeScript types for all 3 options
 * - Error handling for invalid modes and file read failures
 * - Result: JSON accuracy target 100%, UI compliance N/A (API only)
 * - Next: Implement UI mode switcher in page.tsx
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

// TypeScript types for mockup data structures
export interface MockupJTBD {
  statement: string;
  target_time: string;
  current_time: string;
  success_rate: string;
  bdd_features_complete: string;
  evidence_signals: string;
  target_outcome?: string;
}

export interface Enablement {
  id?: string;
  name: string;
  scenario?: string;
  journey_phase?: string;
  steps_file: string | null;
  steps_implemented?: string;
  status: string;
  icon: string;
  value_delivered?: string;
  value?: string;
  step_details?: string[];
  enables?: string;
  implementation_file?: string;
}

export interface SharedStep {
  step_definition?: string;
  definition?: string;
  status: string;
  icon: string;
  used_by_scenarios?: string[];
  reused_by?: string;
  features_blocked?: string[];
  blocker_impact?: {
    total_features_blocked: number;
    total_scenarios_blocked: number;
    percentage_of_suite: string;
    roi_if_implemented?: string;
    roi_if_completed?: string;
  };
  enables?: string;
  implemented?: string;
  missing?: string;
  features_waiting?: string[];
}

export interface PMEMInsight {
  available: boolean;
  score?: number;
  reason?: string;
  pm_question?: string;
  answer?: string;
  time_to_answer?: string;
  time_to_insight?: string;
  message?: string;
  clarity?: string;
  dashboard_shows?: any;
  if_implemented?: any;
  fast_track_options?: any;
  current_coverage?: string;
  missing_steps?: string[];
  sprint_projection?: string;
  can_ship_now?: string;
  roi_ranking?: any[];
  message_technical?: string;
  message_business?: string;
  clarity_score?: number;
  completeness_score?: number;
}

export interface MockupData {
  option: string;
  name: string;
  description: string;
  jtbd: MockupJTBD;
  features: any[];
  pm_em_insights: {
    blocker_identification: PMEMInsight;
    impact_projection?: PMEMInsight;
    fast_track_analysis: PMEMInsight;
    delivery_readiness: PMEMInsight;
    roi_guidance?: PMEMInsight;
    stakeholder_reporting: PMEMInsight;
    progress_projection?: PMEMInsight;
  };
  scoring_summary?: {
    blocker_visibility: number;
    impact_projection: number;
    fast_track_analysis: number;
    delivery_readiness: number;
    roi_guidance: number;
    stakeholder_reporting: number;
    total_score: string;
    average_score: number;
    passing_threshold: string;
    verdict: string;
  };
  strengths?: string[];
  weaknesses?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'option_a';

    // Validate mode parameter
    const validModes = ['option_a', 'option_b', 'option_hybrid'];
    if (!validModes.includes(mode)) {
      return NextResponse.json(
        { error: `Invalid mode: ${mode}. Valid modes are: ${validModes.join(', ')}` },
        { status: 400 }
      );
    }

    // Map mode to filename
    const filenameMap: Record<string, string> = {
      'option_a': 'option_a_enablements.json',
      'option_b': 'option_b_shared_steps.json',
      'option_hybrid': 'option_hybrid.json'
    };

    const filename = filenameMap[mode];

    // Read JSON file from specs/mockups directory
    // Path is relative to the project root
    const filePath = join(process.cwd(), '..', 'specs', 'mockups', filename);

    try {
      const fileContent = await readFile(filePath, 'utf-8');
      const data: MockupData = JSON.parse(fileContent);

      // Return parsed data with proper typing
      return NextResponse.json({
        success: true,
        mode,
        data
      });
    } catch (fileError) {
      // If file read fails, try alternate path (for different directory structures)
      const altPath = join(process.cwd(), '..', '..', 'specs', 'mockups', filename);
      try {
        const fileContent = await readFile(altPath, 'utf-8');
        const data: MockupData = JSON.parse(fileContent);
        return NextResponse.json({
          success: true,
          mode,
          data
        });
      } catch (altError) {
        console.error('Failed to read file from both paths:', { filePath, altPath, fileError, altError });
        return NextResponse.json(
          {
            error: 'Failed to read mockup data file',
            details: fileError instanceof Error ? fileError.message : 'Unknown error',
            attemptedPaths: [filePath, altPath]
          },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
