import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import { loadAllBehaviors, getEvidenceCountForFeature } from '@/lib/parseDuxObjects'

interface BDDStep {
  id: string
  name: string
  status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
  execution_time?: number
  error_message?: string
}

interface BDDScenario {
  id: string
  name: string
  description: string
  status: 'passed' | 'failed' | 'undefined' | 'skipped' | 'pending'
  feature_id: string
  steps: BDDStep[]
  passed?: boolean
  pending?: boolean
}

interface BDDFeature {
  id: string
  name: string
  title: string
  file_path: string
  status: 'completed' | 'in_progress' | 'not_started' | 'failed'
  overall_progress: number
  scenarios: BDDScenario[]
  evidenceCount?: number
  passedScenarios?: number
  totalScenarios?: number
  passing?: boolean
  inProgress?: boolean
}

export async function GET() {
  try {
    // Load DUX Behavior objects for evidence counts
    const duxGovPath = join(process.cwd(), '..', 'DUX-Governance')
    const behaviors = loadAllBehaviors(duxGovPath)

    // Read behave-results.json from public/bdd-data
    const resultsPath = join(process.cwd(), 'public', 'bdd-data', 'behave-results.json')
    const resultsData = readFileSync(resultsPath, 'utf-8')
    const behaveResults = JSON.parse(resultsData)

    // Parse behave results into BDDFeature format
    const features: BDDFeature[] = behaveResults.map((feature: any, idx: number) => {
      const scenarios: BDDScenario[] = (feature.elements || [])
        .filter((element: any) => element.type === 'scenario')
        .map((scenario: any, sidx: number) => {
          const steps: BDDStep[] = (scenario.steps || []).map((step: any, stepIdx: number) => ({
            id: `step_${idx}_${sidx}_${stepIdx}`,
            name: `${step.keyword}${step.name}`,
            status: step.result?.status || 'undefined',
            execution_time: step.result?.duration || 0,
            error_message: step.result?.error_message
          }))

          return {
            id: `${feature.name.toLowerCase().replace(/\s+/g, '_')}_s${sidx + 1}`,
            name: scenario.name,
            description: scenario.name,
            status: scenario.status || 'undefined',
            feature_id: feature.name.toLowerCase().replace(/\s+/g, '_'),
            steps,
            passed: scenario.status === 'passed',
            pending: scenario.status === 'pending'
          }
        })

      const passedScenarios = scenarios.filter(s => s.status === 'passed').length
      const progress = scenarios.length > 0 ? Math.round((passedScenarios / scenarios.length) * 100) : 0

      // Get evidence count from DUX Behavior objects
      const evidenceCount = getEvidenceCountForFeature(feature.name, behaviors)

      return {
        id: feature.name.toLowerCase().replace(/\s+/g, '_'),
        name: feature.name,
        title: feature.name,
        file_path: feature.location,
        status: feature.status === 'passed' ? 'completed' :
                feature.status === 'failed' ? 'failed' :
                passedScenarios > 0 ? 'in_progress' : 'not_started',
        overall_progress: progress,
        evidenceCount, // From DUX Behavior objects
        passedScenarios,
        totalScenarios: scenarios.length,
        passing: feature.status === 'passed',
        inProgress: passedScenarios > 0 && passedScenarios < scenarios.length,
        scenarios
      }
    })

    // Fallback to mock data if parsing fails
    const mockFeatures: BDDFeature[] = [
      {
        id: "workspace_ownership",
        name: "Workspace Ownership Assignment and Management",
        title: "Workspace Ownership Assignment and Management",
        file_path: "worktrees/bdd-progress-dashboard/features/workspace_ownership.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "assign_primary_owner",
            name: "Assign primary owner to new workspace",
            description: "Create workspace with designated owner",
            status: "undefined",
            feature_id: "workspace_ownership",
            passed: false,
            steps: [
              {
                id: "step_1",
                name: "Given I am creating a new workspace \"fraud-detection-team\"",
                status: "undefined"
              },
              {
                id: "step_2",
                name: "When I assign user \"sarah@bank.com\" as the primary owner",
                status: "undefined"
              },
              {
                id: "step_3",
                name: "Then the workspace should be created successfully",
                status: "undefined"
              },
              {
                id: "step_4",
                name: "And \"sarah@bank.com\" should have owner permissions",
                status: "undefined"
              }
            ]
          },
          {
            id: "transfer_ownership",
            name: "Transfer workspace ownership",
            description: "Change workspace owner from one user to another",
            status: "undefined",
            feature_id: "workspace_ownership",
            passed: false,
            steps: [
              {
                id: "step_5",
                name: "Given a workspace \"fraud-detection-team\" exists",
                status: "undefined"
              },
              {
                id: "step_6",
                name: "When I transfer ownership to \"john@bank.com\"",
                status: "undefined"
              },
              {
                id: "step_7",
                name: "Then \"john@bank.com\" should become the primary owner",
                status: "undefined"
              }
            ]
          },
          {
            id: "add_secondary_owners",
            name: "Add secondary workspace owners",
            description: "Multiple owners can manage a workspace",
            status: "undefined",
            feature_id: "workspace_ownership",
            passed: false,
            steps: [
              {
                id: "step_8",
                name: "Given \"sarah@bank.com\" is the primary owner",
                status: "undefined"
              },
              {
                id: "step_9",
                name: "When I add \"mike@bank.com\" as a secondary owner",
                status: "undefined"
              },
              {
                id: "step_10",
                name: "Then both should have owner permissions",
                status: "undefined"
              }
            ]
          },
          {
            id: "owner_deactivation",
            name: "Remove workspace owner when owner leaves organization",
            description: "Handle automatic ownership transfer on account deactivation",
            status: "undefined",
            feature_id: "workspace_ownership",
            passed: false,
            steps: [
              {
                id: "step_11",
                name: "Given \"sarah@bank.com\" account is deactivated",
                status: "undefined"
              },
              {
                id: "step_12",
                name: "When the system detects the deactivated account",
                status: "undefined"
              },
              {
                id: "step_13",
                name: "Then ownership should automatically transfer to designated secondary owner",
                status: "undefined"
              }
            ]
          }
        ]
      },
      {
        id: "service_account_binding",
        name: "Service Account Integration for Credential Isolation",
        title: "Service Account Integration for Credential Isolation",
        file_path: "worktrees/bdd-progress-dashboard/features/service_account_binding.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "auto_provision_sa",
            name: "Automatic service account provisioning",
            description: "SA created automatically when workspace created",
            status: "undefined",
            feature_id: "service_account_binding",
            passed: false,
            steps: [
              {
                id: "step_14",
                name: "Given I am creating a new workspace",
                status: "undefined"
              },
              {
                id: "step_15",
                name: "When the workspace is created",
                status: "undefined"
              },
              {
                id: "step_16",
                name: "Then a dedicated service account should be automatically provisioned",
                status: "undefined"
              }
            ]
          },
          {
            id: "access_db_via_sa",
            name: "Access external database through service account",
            description: "Database access via SA with credential isolation",
            status: "undefined",
            feature_id: "service_account_binding",
            passed: false,
            steps: [
              {
                id: "step_17",
                name: "Given workspace has a bound service account",
                status: "undefined"
              },
              {
                id: "step_18",
                name: "When a notebook attempts to connect to database",
                status: "undefined"
              },
              {
                id: "step_19",
                name: "Then connection succeeds using service account credentials",
                status: "undefined"
              },
              {
                id: "step_20",
                name: "And no database credentials visible in workspace",
                status: "undefined"
              }
            ]
          },
          {
            id: "credential_rotation",
            name: "Service account credential rotation",
            description: "Seamless credential rotation without downtime",
            status: "undefined",
            feature_id: "service_account_binding",
            passed: false,
            steps: [
              {
                id: "step_21",
                name: "Given workspace has active database connections",
                status: "undefined"
              },
              {
                id: "step_22",
                name: "When scheduled credential rotation occurs",
                status: "undefined"
              },
              {
                id: "step_23",
                name: "Then connections transition to new credentials seamlessly",
                status: "undefined"
              }
            ]
          },
          {
            id: "block_direct_access",
            name: "Block direct credential access attempts",
            description: "Prevent users from accessing SA credentials directly",
            status: "undefined",
            feature_id: "service_account_binding",
            passed: false,
            steps: [
              {
                id: "step_24",
                name: "Given a workspace user tries to retrieve SA credentials",
                status: "undefined"
              },
              {
                id: "step_25",
                name: "When they attempt to access the service account token",
                status: "undefined"
              },
              {
                id: "step_26",
                name: "Then the access attempt should be blocked",
                status: "undefined"
              },
              {
                id: "step_27",
                name: "And a security alert should be generated",
                status: "undefined"
              }
            ]
          }
        ]
      },
      {
        id: "vault_integration",
        name: "HashiCorp Vault Integration for Secret Management",
        title: "HashiCorp Vault Integration for Secret Management",
        file_path: "worktrees/bdd-progress-dashboard/features/vault_integration.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "vault_secret_storage",
            name: "Store and retrieve secrets via Vault",
            description: "Basic Vault secret management",
            status: "undefined",
            feature_id: "vault_integration",
            passed: false,
            steps: [
              {
                id: "step_28",
                name: "Given a workspace service account exists",
                status: "undefined"
              },
              {
                id: "step_29",
                name: "When workspace requests database credentials",
                status: "undefined"
              },
              {
                id: "step_30",
                name: "Then Vault provides time-limited credentials",
                status: "undefined"
              }
            ]
          },
          {
            id: "auto_rotation",
            name: "Automatic credential rotation",
            description: "Vault rotates credentials automatically",
            status: "undefined",
            feature_id: "vault_integration",
            passed: false,
            steps: [
              {
                id: "step_31",
                name: "Given credentials are approaching expiry",
                status: "undefined"
              },
              {
                id: "step_32",
                name: "When Vault rotation threshold is reached",
                status: "undefined"
              },
              {
                id: "step_33",
                name: "Then new credentials are generated automatically",
                status: "undefined"
              }
            ]
          },
          {
            id: "vault_failover",
            name: "Handle Vault unavailability gracefully",
            description: "Workspace degradation when Vault fails",
            status: "undefined",
            feature_id: "vault_integration",
            passed: false,
            steps: [
              {
                id: "step_34",
                name: "Given Vault becomes unavailable",
                status: "undefined"
              },
              {
                id: "step_35",
                name: "When workspace attempts data connection",
                status: "undefined"
              },
              {
                id: "step_36",
                name: "Then workspace enters degraded mode with cached credentials",
                status: "undefined"
              }
            ]
          },
          {
            id: "audit_logging",
            name: "Log all credential access in Vault audit trail",
            description: "Complete audit trail for compliance",
            status: "undefined",
            feature_id: "vault_integration",
            passed: false,
            steps: [
              {
                id: "step_37",
                name: "Given workspace accesses credentials",
                status: "undefined"
              },
              {
                id: "step_38",
                name: "When credential request is processed",
                status: "undefined"
              },
              {
                id: "step_39",
                name: "Then audit log records request with workspace context",
                status: "undefined"
              }
            ]
          }
        ]
      },
      {
        id: "gitops_deployment",
        name: "GitOps-Based Workspace Deployment and Configuration",
        title: "GitOps-Based Workspace Deployment and Configuration",
        file_path: "worktrees/bdd-progress-dashboard/features/gitops_deployment.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "git_version_control",
            name: "Workspace configuration stored in Git",
            description: "Git as single source of truth",
            status: "undefined",
            feature_id: "gitops_deployment",
            passed: false,
            steps: [
              {
                id: "step_40",
                name: "Given a workspace is configured",
                status: "undefined"
              },
              {
                id: "step_41",
                name: "When changes are made to workspace",
                status: "undefined"
              },
              {
                id: "step_42",
                name: "Then changes are committed to Git repository",
                status: "undefined"
              }
            ]
          },
          {
            id: "two_step_merge",
            name: "Two-step merge workflow prevents auto-sync",
            description: "Manual deploy after PR merge",
            status: "undefined",
            feature_id: "gitops_deployment",
            passed: false,
            steps: [
              {
                id: "step_43",
                name: "Given a PR is merged to main branch",
                status: "undefined"
              },
              {
                id: "step_44",
                name: "When owner triggers manual deployment",
                status: "undefined"
              },
              {
                id: "step_45",
                name: "Then workspace updates with merged changes",
                status: "undefined"
              }
            ]
          },
          {
            id: "drift_detection",
            name: "Detect configuration drift from Git",
            description: "Alert when workspace diverges from Git",
            status: "undefined",
            feature_id: "gitops_deployment",
            passed: false,
            steps: [
              {
                id: "step_46",
                name: "Given workspace configuration differs from Git",
                status: "undefined"
              },
              {
                id: "step_47",
                name: "When drift detection runs",
                status: "undefined"
              },
              {
                id: "step_48",
                name: "Then owner is alerted to configuration drift",
                status: "undefined"
              }
            ]
          },
          {
            id: "rollback",
            name: "Rollback workspace to previous Git commit",
            description: "Git-based rollback mechanism",
            status: "undefined",
            feature_id: "gitops_deployment",
            passed: false,
            steps: [
              {
                id: "step_49",
                name: "Given workspace has issues after deployment",
                status: "undefined"
              },
              {
                id: "step_50",
                name: "When owner triggers rollback to previous commit",
                status: "undefined"
              },
              {
                id: "step_51",
                name: "Then workspace reverts to stable state",
                status: "undefined"
              }
            ]
          }
        ]
      },
      {
        id: "multicloud_access",
        name: "Multi-Cloud Resource Access Management",
        title: "Multi-Cloud Resource Access Management",
        file_path: "worktrees/bdd-progress-dashboard/features/multicloud_access.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "cross_cloud_deployment",
            name: "Deploy workspace across multiple cloud providers",
            description: "AWS + GCP + Azure support",
            status: "undefined",
            feature_id: "multicloud_access",
            passed: false,
            steps: [
              {
                id: "step_52",
                name: "Given workspace needs resources from AWS and GCP",
                status: "undefined"
              },
              {
                id: "step_53",
                name: "When workspace is deployed",
                status: "undefined"
              },
              {
                id: "step_54",
                name: "Then service accounts configured for both clouds",
                status: "undefined"
              }
            ]
          },
          {
            id: "cloud_restrictions",
            name: "Enforce cloud-specific resource restrictions",
            description: "Policy-driven cloud access control",
            status: "undefined",
            feature_id: "multicloud_access",
            passed: false,
            steps: [
              {
                id: "step_55",
                name: "Given policy restricts GCP access for workspace",
                status: "undefined"
              },
              {
                id: "step_56",
                name: "When workspace attempts GCP resource access",
                status: "undefined"
              },
              {
                id: "step_57",
                name: "Then access is denied with policy violation message",
                status: "undefined"
              }
            ]
          },
          {
            id: "credential_federation",
            name: "Federate credentials across cloud providers",
            description: "Cross-cloud credential management",
            status: "undefined",
            feature_id: "multicloud_access",
            passed: false,
            steps: [
              {
                id: "step_58",
                name: "Given workspace has AWS and Azure resources",
                status: "undefined"
              },
              {
                id: "step_59",
                name: "When credentials are requested",
                status: "undefined"
              },
              {
                id: "step_60",
                name: "Then Vault provides federated credentials for both clouds",
                status: "undefined"
              }
            ]
          },
          {
            id: "cost_optimization",
            name: "Recommend cost-optimal cloud for workload",
            description: "Cost-aware cloud selection",
            status: "undefined",
            feature_id: "multicloud_access",
            passed: false,
            steps: [
              {
                id: "step_61",
                name: "Given workload can run on AWS or GCP",
                status: "undefined"
              },
              {
                id: "step_62",
                name: "When deployment planning occurs",
                status: "undefined"
              },
              {
                id: "step_63",
                name: "Then system recommends lower-cost cloud provider",
                status: "undefined"
              }
            ]
          }
        ]
      },
      {
        id: "billing_tracking",
        name: "Workspace-Level Billing and Cost Attribution",
        title: "Workspace-Level Billing and Cost Attribution",
        file_path: "worktrees/bdd-progress-dashboard/features/billing_tracking.feature",
        status: "not_started",
        overall_progress: 0,
        evidenceCount: 0,
        passedScenarios: 0,
        totalScenarios: 4,
        passing: false,
        inProgress: false,
        scenarios: [
          {
            id: "cost_attribution",
            name: "Track costs by workspace owner",
            description: "Per-workspace cost tracking",
            status: "undefined",
            feature_id: "billing_tracking",
            passed: false,
            steps: [
              {
                id: "step_64",
                name: "Given workspace consumes compute resources",
                status: "undefined"
              },
              {
                id: "step_65",
                name: "When billing aggregation runs",
                status: "undefined"
              },
              {
                id: "step_66",
                name: "Then costs are attributed to workspace owner",
                status: "undefined"
              }
            ]
          },
          {
            id: "budget_alerts",
            name: "Alert owner when budget threshold exceeded",
            description: "Proactive budget monitoring",
            status: "undefined",
            feature_id: "billing_tracking",
            passed: false,
            steps: [
              {
                id: "step_67",
                name: "Given workspace has $500 monthly budget",
                status: "undefined"
              },
              {
                id: "step_68",
                name: "When spend reaches $450 (90% threshold)",
                status: "undefined"
              },
              {
                id: "step_69",
                name: "Then owner receives budget alert notification",
                status: "undefined"
              }
            ]
          },
          {
            id: "real_time_dashboard",
            name: "Real-time cost dashboard for owners",
            description: "Live spend visibility",
            status: "undefined",
            feature_id: "billing_tracking",
            passed: false,
            steps: [
              {
                id: "step_70",
                name: "Given workspace owner opens cost dashboard",
                status: "undefined"
              },
              {
                id: "step_71",
                name: "When dashboard loads",
                status: "undefined"
              },
              {
                id: "step_72",
                name: "Then current month spend displayed in real-time",
                status: "undefined"
              }
            ]
          },
          {
            id: "budget_enforcement",
            name: "Automatically suspend workspace at hard budget limit",
            description: "Prevent budget overruns",
            status: "undefined",
            feature_id: "billing_tracking",
            passed: false,
            steps: [
              {
                id: "step_73",
                name: "Given workspace has $500 hard budget limit",
                status: "undefined"
              },
              {
                id: "step_74",
                name: "When spend reaches $500",
                status: "undefined"
              },
              {
                id: "step_75",
                name: "Then workspace is automatically suspended",
                status: "undefined"
              }
            ]
          }
        ]
      }
    ]

    // Calculate summary from parsed features
    const totalScenarios = features.reduce((sum, f) => sum + f.scenarios.length, 0)
    const totalSteps = features.reduce((sum, f) =>
      sum + f.scenarios.reduce((ssum, s) => ssum + s.steps.length, 0), 0)

    return NextResponse.json({
      features,
      summary: {
        total_features: features.length,
        total_scenarios: totalScenarios,
        total_steps: totalSteps,
        status: "specification_phase",
        step_definitions_implemented: false
      },
      generated_at: new Date().toISOString(),
      data_source: "Behave Test Results (Real Data)"
    })

  } catch (error) {
    console.error('Error getting BDD features data:', error)
    
    return NextResponse.json({
      error: "Failed to load BDD features data",
      message: error instanceof Error ? error.message : "Unknown error",
      generated_at: new Date().toISOString()
    }, { status: 500 })
  }
}