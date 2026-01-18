import { CardProps, CardStep, CardMetrics } from '../components/UniversalCard';
import fs from 'fs';
import path from 'path';

/**
 * Parse Gherkin .feature files into nested card structure
 *
 * Feature → Epic (Feature Card)
 * Scenario → User Story (Scenario Card)
 * Given/When/Then → Acceptance Criteria (Steps)
 */

interface GherkinScenario {
  name: string;
  steps: string[];
}

interface GherkinFeature {
  name: string;
  description?: string;
  scenarios: GherkinScenario[];
}

/**
 * Parse a single .feature file
 */
export function parseFeatureFile(filePath: string): GherkinFeature | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    let featureName = '';
    let featureDescription = '';
    const scenarios: GherkinScenario[] = [];
    let currentScenario: GherkinScenario | null = null;
    let inFeatureDescription = false;

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines and comments
      if (!trimmed || trimmed.startsWith('#')) {
        continue;
      }

      // Feature declaration
      if (trimmed.startsWith('Feature:')) {
        featureName = trimmed.replace('Feature:', '').trim();
        inFeatureDescription = true;
        continue;
      }

      // Scenario declaration
      if (trimmed.startsWith('Scenario:')) {
        // Save previous scenario if exists
        if (currentScenario) {
          scenarios.push(currentScenario);
        }

        // Start new scenario
        currentScenario = {
          name: trimmed.replace('Scenario:', '').trim(),
          steps: [],
        };
        inFeatureDescription = false;
        continue;
      }

      // Scenario Outline
      if (trimmed.startsWith('Scenario Outline:')) {
        if (currentScenario) {
          scenarios.push(currentScenario);
        }
        currentScenario = {
          name: trimmed.replace('Scenario Outline:', '').trim(),
          steps: [],
        };
        inFeatureDescription = false;
        continue;
      }

      // Steps (Given, When, Then, And, But)
      if (
        trimmed.startsWith('Given ') ||
        trimmed.startsWith('When ') ||
        trimmed.startsWith('Then ') ||
        trimmed.startsWith('And ') ||
        trimmed.startsWith('But ')
      ) {
        if (currentScenario) {
          currentScenario.steps.push(trimmed);
        }
        continue;
      }

      // Feature description (after Feature: line, before first Scenario:)
      if (inFeatureDescription && trimmed) {
        featureDescription += (featureDescription ? ' ' : '') + trimmed;
      }
    }

    // Save last scenario
    if (currentScenario) {
      scenarios.push(currentScenario);
    }

    return {
      name: featureName,
      description: featureDescription || undefined,
      scenarios,
    };
  } catch (error) {
    console.error(`Error parsing feature file ${filePath}:`, error);
    return null;
  }
}

/**
 * Convert GherkinFeature to CardProps structure
 */
export function featureToCard(
  feature: GherkinFeature,
  featureId: string,
  testResults?: any
): CardProps {
  // Convert scenarios to child cards
  const children: CardProps[] = feature.scenarios.map((scenario, index) => {
    // Convert steps to CardStep format
    const steps: CardStep[] = scenario.steps.map((step) => ({
      step,
      status: 'pending' as const, // Default status, will be updated from test results
    }));

    // Calculate metrics
    const passingSteps = steps.filter((s) => s.status === 'passing').length;
    const metrics: CardMetrics = {
      signals: {
        completed: passingSteps,
        total: steps.length,
      },
      evidence: 0, // TODO: Calculate from test results
      percentage: steps.length > 0 ? Math.round((passingSteps / steps.length) * 100) : 0,
    };

    // Determine scenario status
    let status: 'NOT STARTED' | 'IN PROGRESS' | 'PASSING' | 'FAILING' = 'NOT STARTED';
    if (passingSteps === steps.length && steps.length > 0) {
      status = 'PASSING';
    } else if (passingSteps > 0) {
      status = 'IN PROGRESS';
    } else if (steps.some((s) => s.status === 'failing')) {
      status = 'FAILING';
    }

    return {
      id: `${featureId}-S${index + 1}`,
      title: scenario.name,
      type: 'scenario',
      status,
      metrics,
      steps,
    };
  });

  // Calculate feature-level metrics
  const passingScenarios = children.filter((c) => c.status === 'PASSING').length;
  const totalEvidence = children.reduce((sum, child) => sum + (child.metrics?.evidence || 0), 0);
  const metrics: CardMetrics = {
    signals: {
      completed: passingScenarios,
      total: children.length,
    },
    evidence: totalEvidence,
    percentage: children.length > 0 ? Math.round((passingScenarios / children.length) * 100) : 0,
  };

  // Determine feature status
  let status: 'NOT STARTED' | 'IN PROGRESS' | 'PASSING' | 'FAILING' = 'NOT STARTED';
  if (passingScenarios === children.length && children.length > 0) {
    status = 'PASSING';
  } else if (passingScenarios > 0) {
    status = 'IN PROGRESS';
  } else if (children.some((c) => c.status === 'FAILING')) {
    status = 'FAILING';
  }

  return {
    id: featureId,
    title: feature.name,
    type: 'feature',
    status,
    metrics,
    children,
  };
}

/**
 * Parse all feature files in a directory
 */
export function parseFeatureDirectory(dirPath: string): CardProps[] {
  const cards: CardProps[] = [];

  try {
    const files = fs.readdirSync(dirPath);
    const featureFiles = files.filter((f) => f.endsWith('.feature'));

    featureFiles.forEach((file, index) => {
      const filePath = path.join(dirPath, file);
      const feature = parseFeatureFile(filePath);

      if (feature) {
        const featureId = `BDD-${String(index + 1).padStart(2, '0')}`;
        const card = featureToCard(feature, featureId);
        cards.push(card);
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return cards;
}

/**
 * Update card structure with test results from behave JSON
 */
export function updateCardsWithTestResults(
  cards: CardProps[],
  behaveResults: any[]
): CardProps[] {
  // TODO: Map behave test results to card steps
  // This will update step status (passing/failing/pending) based on actual test execution
  return cards;
}
