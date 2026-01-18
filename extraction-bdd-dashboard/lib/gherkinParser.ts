import * as Gherkin from '@cucumber/gherkin'
import * as Messages from '@cucumber/messages'
import fs from 'fs'
import path from 'path'

export interface ParsedStep {
  id: string
  keyword: string
  text: string
  status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
}

export interface ParsedScenario {
  id: string
  name: string
  description?: string
  steps: ParsedStep[]
  status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
  tags: string[]
}

export interface ParsedFeature {
  id: string
  name: string
  description?: string
  jtbd?: string
  target?: string
  currentState?: string
  scenarios: ParsedScenario[]
  status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
  tags: string[]
}

interface BehaveStep {
  name: string
  keyword: string
  result?: {
    status: 'passed' | 'failed' | 'skipped' | 'pending' | 'undefined'
  }
}

interface BehaveScenario {
  name: string
  steps: BehaveStep[]
  status?: 'passed' | 'failed' | 'skipped' | 'pending' | 'undefined'
}

interface BehaveFeature {
  name: string
  elements?: BehaveScenario[]
  status?: 'passed' | 'failed' | 'skipped' | 'pending' | 'undefined'
}

/**
 * Parse a single .feature file
 */
export function parseFeatureFile(filePath: string): ParsedFeature | null {
  try {
    const source = fs.readFileSync(filePath, 'utf-8')
    const uuidFn = Messages.IdGenerator.uuid()
    const builder = new Gherkin.AstBuilder(uuidFn)
    const matcher = new Gherkin.GherkinClassicTokenMatcher()
    const parser = new Gherkin.Parser(builder, matcher)

    const gherkinDocument = parser.parse(source)
    const feature = gherkinDocument.feature

    if (!feature) {
      return null
    }

    // Extract JTBD, target, and current state from comments
    let jtbd: string | undefined
    let target: string | undefined
    let currentState: string | undefined

    const commentLines = source.split('\n').filter(line => line.trim().startsWith('#'))
    for (const comment of commentLines) {
      const trimmed = comment.replace(/^#\s*/, '')
      if (trimmed.toLowerCase().startsWith('jtbd:')) {
        jtbd = trimmed.replace(/^jtbd:\s*/i, '').replace(/^["']|["']$/g, '')
      } else if (trimmed.toLowerCase().startsWith('target:')) {
        target = trimmed.replace(/^target:\s*/i, '')
      } else if (trimmed.toLowerCase().startsWith('current')) {
        currentState = trimmed.replace(/^current(\s+pain)?:\s*/i, '')
      }
    }

    // Generate feature ID from filename
    const featureId = path.basename(filePath, '.feature')

    // Parse scenarios
    const scenarios: ParsedScenario[] = []

    if (feature.children) {
      for (let i = 0; i < feature.children.length; i++) {
        const child = feature.children[i]
        if (child.scenario) {
          const scenario = child.scenario
          const scenarioId = `S${i + 1}`

          const steps: ParsedStep[] = scenario.steps.map((step, stepIndex) => ({
            id: `${scenarioId}-step-${stepIndex + 1}`,
            keyword: step.keyword.trim(),
            text: step.text,
            status: 'undefined' as const
          }))

          scenarios.push({
            id: scenarioId,
            name: scenario.name,
            description: scenario.description || undefined,
            steps,
            status: 'undefined',
            tags: scenario.tags ? scenario.tags.map(tag => tag.name) : []
          })
        }
      }
    }

    return {
      id: featureId,
      name: feature.name,
      description: feature.description || undefined,
      jtbd,
      target,
      currentState,
      scenarios,
      status: 'undefined',
      tags: feature.tags ? feature.tags.map(tag => tag.name) : []
    }
  } catch (error) {
    console.error(`Error parsing feature file ${filePath}:`, error)
    return null
  }
}

/**
 * Parse all .feature files in a directory
 */
export function parseFeatureDirectory(directory: string): ParsedFeature[] {
  const features: ParsedFeature[] = []

  try {
    const files = fs.readdirSync(directory)

    for (const file of files) {
      if (file.endsWith('.feature')) {
        const filePath = path.join(directory, file)
        const parsed = parseFeatureFile(filePath)
        if (parsed) {
          features.push(parsed)
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error)
  }

  return features
}

/**
 * Merge parsed features with behave test results
 */
export function mergeWithTestResults(
  features: ParsedFeature[],
  behaveResultsPath?: string
): ParsedFeature[] {
  if (!behaveResultsPath || !fs.existsSync(behaveResultsPath)) {
    return features
  }

  try {
    const resultsContent = fs.readFileSync(behaveResultsPath, 'utf-8')
    const behaveResults: BehaveFeature[] = JSON.parse(resultsContent)

    return features.map(feature => {
      const behaveFeature = behaveResults.find(
        bf => bf.name === feature.name
      )

      if (!behaveFeature) {
        return feature
      }

      const updatedScenarios = feature.scenarios.map(scenario => {
        const behaveScenario = behaveFeature.elements?.find(
          bs => bs.name === scenario.name
        )

        if (!behaveScenario) {
          return scenario
        }

        const updatedSteps = scenario.steps.map(step => {
          const behaveStep = behaveScenario.steps.find(
            bs => bs.keyword.trim() === step.keyword && bs.name === step.text
          )

          return {
            ...step,
            status: behaveStep?.result?.status || step.status
          }
        })

        // Calculate scenario status based on steps
        let scenarioStatus: ParsedScenario['status'] = 'passed'
        if (updatedSteps.some(s => s.status === 'failed')) {
          scenarioStatus = 'failed'
        } else if (updatedSteps.some(s => s.status === 'undefined')) {
          scenarioStatus = 'undefined'
        } else if (updatedSteps.some(s => s.status === 'pending')) {
          scenarioStatus = 'pending'
        } else if (updatedSteps.some(s => s.status === 'skipped')) {
          scenarioStatus = 'skipped'
        }

        return {
          ...scenario,
          steps: updatedSteps,
          status: behaveScenario.status || scenarioStatus
        }
      })

      // Calculate feature status based on scenarios
      let featureStatus: ParsedFeature['status'] = 'passed'
      if (updatedScenarios.some(s => s.status === 'failed')) {
        featureStatus = 'failed'
      } else if (updatedScenarios.some(s => s.status === 'undefined')) {
        featureStatus = 'undefined'
      } else if (updatedScenarios.some(s => s.status === 'pending')) {
        featureStatus = 'pending'
      } else if (updatedScenarios.some(s => s.status === 'skipped')) {
        featureStatus = 'skipped'
      }

      return {
        ...feature,
        scenarios: updatedScenarios,
        status: behaveFeature.status || featureStatus
      }
    })
  } catch (error) {
    console.error('Error merging with test results:', error)
    return features
  }
}

/**
 * Get feature files path (works in both dev and production)
 */
export function getFeatureFilesPath(): string {
  // In the worktree, features are one level up from extraction-bdd-dashboard
  const devPath = path.join(process.cwd(), '..', 'features')

  // Fallback to current directory
  const fallbackPath = path.join(process.cwd(), 'features')

  if (fs.existsSync(devPath)) {
    return devPath
  }

  return fallbackPath
}

/**
 * Get behave results path
 */
export function getBehaveResultsPath(): string {
  return path.join(process.cwd(), 'public', 'bdd-data', 'behave-results.json')
}
