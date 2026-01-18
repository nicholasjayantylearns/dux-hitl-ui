/**
 * SKATEBOARD MDE: Local Filesystem Feature Parser
 *
 * Reads .feature files from local filesystem (monorepo or relative paths)
 * NO external dependencies (GitHub API, database)
 * Works in Vercel if projects are in same deployment
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export interface Project {
  id: string;
  name: string;
  featuresPath: string;
  source: 'local';
}

export interface Feature {
  projectId: string;
  fileName: string;
  content: string;
  path: string;
  scenarioCount: number;
  lintScore?: number;
}

export interface DashboardData {
  projects: ProjectSummary[];
  lastUpdated: string;
}

export interface ProjectSummary {
  id: string;
  name: string;
  featureCount: number;
  scenarioCount: number;
  avgLintScore: number;
  features: FeatureSummary[];
}

export interface FeatureSummary {
  fileName: string;
  scenarioCount: number;
  lintScore: number;
  qualityLayers: {
    functional: boolean;
    reliable: boolean;
    usable: boolean;
    delightful: boolean;
  };
}

/**
 * Load project registry from .dashboard-projects.json
 */
export function loadProjectRegistry(rootDir: string): Project[] {
  const registryPath = path.join(rootDir, '.dashboard-projects.json');

  if (!fs.existsSync(registryPath)) {
    console.warn('No .dashboard-projects.json found, using default (discrete_connection only)');
    return [{
      id: 'discrete-connection',
      name: 'Discrete Connection',
      featuresPath: './features',
      source: 'local'
    }];
  }

  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  return registry.projects;
}

/**
 * Find all .feature files for a project
 */
export async function findFeatureFiles(project: Project, rootDir: string): Promise<string[]> {
  const absolutePath = path.resolve(rootDir, project.featuresPath);

  if (!fs.existsSync(absolutePath)) {
    console.error(`Features path not found: ${absolutePath}`);
    return [];
  }

  // Find all .feature files recursively
  const pattern = path.join(absolutePath, '**/*.feature');
  const files = await glob(pattern, {
    ignore: ['**/node_modules/**', '**/venv/**'],
    absolute: true
  });

  return files;
}

/**
 * Parse a single .feature file
 */
export function parseFeatureFile(filePath: string, projectId: string): Feature {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);

  // Count scenarios (simple regex)
  const scenarioMatches = content.match(/^\s*(Scenario|Scenario Outline):/gm);
  const scenarioCount = scenarioMatches ? scenarioMatches.length : 0;

  return {
    projectId,
    fileName,
    content,
    path: filePath,
    scenarioCount
  };
}

/**
 * Simple lint scorer (extracted from bdd-quality-linter.py logic)
 *
 * Checks:
 * - Functional: Has "Then" steps with assertions
 * - Reliable: Has measurable criteria (numbers, time units)
 * - Usable: Uses domain language (not technical jargon)
 * - Delightful: Has user enablement language ("Bella can...", "so that")
 */
export function lintFeature(feature: Feature): number {
  const { content } = feature;

  let score = 0;
  const layers = {
    functional: false,
    reliable: false,
    usable: false,
    delightful: false
  };

  // FUNCTIONAL: Has "Then" steps
  if (/^\s*Then\s+/m.test(content)) {
    layers.functional = true;
    score += 25;
  }

  // RELIABLE: Has measurable criteria
  const measurablePatterns = [
    /<\d+\s*(second|minute|hour|ms|MB|GB)/i,  // Time/size units
    />\d+%/,                                    // Percentages
    /\d+\s*(users|scenarios|features)/i         // Counts
  ];
  if (measurablePatterns.some(pattern => pattern.test(content))) {
    layers.reliable = true;
    score += 25;
  }

  // USABLE: Has real user names (Bella, Maya, Alice) not generic "user"
  const realNames = ['Bella', 'Maya', 'Alice', 'Joel', 'Bob'];
  if (realNames.some(name => content.includes(name))) {
    layers.usable = true;
    score += 25;
  }

  // DELIGHTFUL: Has user enablement language
  const delightPatterns = [
    /\bcan\s+\w+/i,           // "Bella can create workspace"
    /\bso that\b/i,           // "so that Bella can..."
    /\benables\b/i,           // "enables data scientists to..."
    /\bfeels\s+confident/i    // "feels confident to..."
  ];
  if (delightPatterns.some(pattern => pattern.test(content))) {
    layers.delightful = true;
    score += 25;
  }

  feature.lintScore = score;
  return score;
}

/**
 * Generate dashboard data for all projects
 */
export async function generateDashboardData(rootDir: string): Promise<DashboardData> {
  const projects = loadProjectRegistry(rootDir);
  const projectSummaries: ProjectSummary[] = [];

  for (const project of projects) {
    const featureFiles = await findFeatureFiles(project, rootDir);
    const features: Feature[] = featureFiles.map(file => parseFeatureFile(file, project.id));

    // Lint all features
    features.forEach(feature => lintFeature(feature));

    // Calculate project summary
    const totalScenarios = features.reduce((sum, f) => sum + f.scenarioCount, 0);
    const totalScore = features.reduce((sum, f) => sum + (f.lintScore || 0), 0);
    const avgLintScore = features.length > 0 ? Math.round(totalScore / features.length) : 0;

    const featureSummaries: FeatureSummary[] = features.map(f => ({
      fileName: f.fileName,
      scenarioCount: f.scenarioCount,
      lintScore: f.lintScore || 0,
      qualityLayers: {
        functional: (f.lintScore || 0) >= 25,
        reliable: (f.lintScore || 0) >= 50,
        usable: (f.lintScore || 0) >= 75,
        delightful: (f.lintScore || 0) === 100
      }
    }));

    projectSummaries.push({
      id: project.id,
      name: project.name,
      featureCount: features.length,
      scenarioCount: totalScenarios,
      avgLintScore,
      features: featureSummaries
    });
  }

  return {
    projects: projectSummaries,
    lastUpdated: new Date().toISOString()
  };
}

/**
 * CACHING STRATEGY: In-memory with 60-second TTL
 *
 * Rationale:
 * - Skateboard = filesystem reads are fast (<50ms)
 * - Cache prevents redundant parsing on rapid page refreshes
 * - 60s TTL = near real-time (acceptable for local dev)
 * - No external cache needed (Redis overkill for Skateboard)
 */
let cache: { data: DashboardData | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function getCachedDashboardData(rootDir: string): Promise<DashboardData> {
  const now = Date.now();

  if (cache.data && (now - cache.timestamp) < CACHE_TTL_MS) {
    console.log('Serving from cache');
    return cache.data;
  }

  console.log('Cache miss, regenerating...');
  const data = await generateDashboardData(rootDir);
  cache = { data, timestamp: now };

  return data;
}
