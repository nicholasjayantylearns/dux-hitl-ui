import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

export interface DuxBehavior {
  object_type: string
  id: string
  user_enablement: string
  end_user?: string
  observable_signals: string[]
  acceptance_criteria: string[]
  evidence: string[]
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface DuxResult {
  object_type: string
  id: string
  target_impact: string
  success_criteria: string
  success_metrics: string[]
  evidence_maturity: string
  evidence: string[]
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface DuxProblem {
  object_type: string
  id: string
  problem_statement: string
  evidence: string[]
  tags?: string[]
  created_at?: string
  updated_at?: string
}

/**
 * Parse DUX Behavior object from markdown file
 */
export function parseBehaviorObject(filePath: string): DuxBehavior | null {
  try {
    const content = readFileSync(filePath, 'utf-8')

    // Extract JSON block from markdown
    const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
    if (!jsonMatch) {
      return null
    }

    const behaviorData = JSON.parse(jsonMatch[1])
    return behaviorData as DuxBehavior
  } catch (error) {
    console.error(`Error parsing behavior ${filePath}:`, error)
    return null
  }
}

/**
 * Load all DUX Behavior objects
 */
export function loadAllBehaviors(duxGovPath: string): DuxBehavior[] {
  try {
    const behaviorsPath = join(duxGovPath, 'instances', 'behaviors')
    const files = readdirSync(behaviorsPath).filter(f => f.endsWith('.md'))

    const behaviors: DuxBehavior[] = []
    for (const file of files) {
      const behavior = parseBehaviorObject(join(behaviorsPath, file))
      if (behavior) {
        behaviors.push(behavior)
      }
    }

    return behaviors
  } catch (error) {
    console.error('Error loading behaviors:', error)
    return []
  }
}

/**
 * Load all DUX Result objects
 */
export function loadAllResults(duxGovPath: string): DuxResult[] {
  try {
    const resultsPath = join(duxGovPath, 'instances', 'results')
    const files = readdirSync(resultsPath).filter(f => f.endsWith('.md'))

    const results: DuxResult[] = []
    for (const file of files) {
      const content = readFileSync(join(resultsPath, file), 'utf-8')
      const jsonMatch = content.match(/```json\s*\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        const resultData = JSON.parse(jsonMatch[1])
        results.push(resultData as DuxResult)
      }
    }

    return results
  } catch (error) {
    console.error('Error loading results:', error)
    return []
  }
}

/**
 * Match feature/scenario to DUX Behavior object
 * Returns evidence count from linked Behavior
 */
export function getEvidenceCountForFeature(
  featureName: string,
  behaviors: DuxBehavior[]
): number {
  // Simple matching: Look for behavior where user_enablement relates to feature name
  // This is experimental - will need refinement

  const normalizedFeature = featureName.toLowerCase()

  // Try to find matching behavior
  const matchedBehavior = behaviors.find(b => {
    const behaviorText = `${b.user_enablement} ${b.id}`.toLowerCase()

    // Match keywords from feature name
    if (normalizedFeature.includes('ownership') && behaviorText.includes('owner')) {
      return true
    }
    if (normalizedFeature.includes('connect') && behaviorText.includes('connect')) {
      return true
    }
    if (normalizedFeature.includes('signal') && behaviorText.includes('signal')) {
      return true
    }
    if (normalizedFeature.includes('interest') && behaviorText.includes('interest')) {
      return true
    }
    if (normalizedFeature.includes('health') && behaviorText.includes('health')) {
      return true
    }
    if (normalizedFeature.includes('privacy') && behaviorText.includes('privacy')) {
      return true
    }
    if (normalizedFeature.includes('reputation') && behaviorText.includes('reputation')) {
      return true
    }

    return false
  })

  return matchedBehavior?.evidence.length || 0
}

/**
 * Get all evidence IDs for a feature (for potential drill-down)
 */
export function getEvidenceIdsForFeature(
  featureName: string,
  behaviors: DuxBehavior[]
): string[] {
  const normalizedFeature = featureName.toLowerCase()

  const matchedBehavior = behaviors.find(b => {
    const behaviorText = `${b.user_enablement} ${b.id}`.toLowerCase()
    return behaviorText.includes(normalizedFeature.split(' ')[0])
  })

  return matchedBehavior?.evidence || []
}
