/**
 * SKATEBOARD API: Local Filesystem Dashboard Data
 *
 * GET /api/skateboard/dashboard
 *
 * Returns aggregated dashboard data for all projects in .dashboard-projects.json
 * Reads from local filesystem (monorepo or relative paths)
 */

import { NextResponse } from 'next/server';
import { getCachedDashboardData } from '@/lib/skateboard-filesystem-parser';
import path from 'path';

export async function GET() {
  try {
    // Root directory = repo root (2 levels up from app/api/skateboard/dashboard)
    const rootDir = path.resolve(process.cwd(), '../..');

    const data = await getCachedDashboardData(rootDir);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    });
  } catch (error) {
    console.error('Skateboard API error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
