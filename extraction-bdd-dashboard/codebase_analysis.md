# DUX HITL UI - Comprehensive Codebase Analysis

**Project:** dux-hitl-ui / extraction-bdd-dashboard
**Analysis Date:** January 18, 2026
**Version:** 1.0.0

---

## 1. Project Overview

### Project Type
**Real-time BDD Progress Dashboard with Human-in-the-Loop (HITL) Validation Pipeline**

This is a Next.js 15 web application that serves as a Behavior-Driven Development (BDD) monitoring and visualization dashboard. It integrates with the DUX (Declarative UX) Object Model to track feature development progress, test execution results, and evidence validation through a Conservative HITL Pipeline.

### Primary Purpose
- Display real-time BDD test progress from Gherkin `.feature` files
- Track Jobs-To-Be-Done (JTBD) alignment across features
- Provide PM/EM dashboard for spec declaration and validation
- Integrate with DUX Governance objects (Problem, Behavior, Result)
- Support longitudinal roadmap visualization over time

### Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 15.2.4 |
| **Language** | TypeScript | ^5 |
| **React** | React | ^19 |
| **Styling** | Tailwind CSS | ^3.4.17 |
| **UI Components** | Radix UI Primitives | latest |
| **BDD Parser** | @cucumber/gherkin | via @cucumber/messages ^28.1.0 |
| **AI Integration** | @ai-sdk/react + ai | ^3.0.41 / ^5.0.2 |
| **Testing** | Cucumber.js + Playwright | ^10.0.0 / ^1.40.0 |
| **Icons** | Lucide React | ^0.454.0 |
| **Markdown** | react-markdown | ^10.1.0 |

### Architecture Pattern
**Server-Side Rendering (SSR) with Client-Side Interactivity**

The application uses Next.js 15 App Router with:
- Server-side API routes for data fetching
- Client-side React components for interactivity
- File-based routing with dynamic segments
- CSS-in-JS via Tailwind with CSS variables for theming

---

## 2. Detailed Directory Structure Analysis

```
extraction-bdd-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── bdd/                  # BDD data endpoints
│   │   │   ├── features/         # Feature parsing API
│   │   │   ├── mockups/          # Mockup data API
│   │   │   └── progress/         # Progress metrics API
│   │   └── skateboard/           # Local filesystem parser API
│   │       └── dashboard/
│   ├── bdd-progress/             # BDD progress dashboard page
│   ├── components/               # App-specific components
│   │   ├── hitl/                 # HITL chat interface
│   │   └── ui/                   # Shadcn/UI primitives
│   ├── feature-detail/           # Dynamic feature detail pages
│   │   └── [featureId]/          # Dynamic route segment
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # App-level utilities
│   └── roadmap-timeline/         # Longitudinal roadmap page
├── components/                   # Shared components
│   ├── DashboardHeader.tsx       # JTBD + metrics header
│   ├── StepList.tsx              # BDD step visualization
│   └── UniversalCard.tsx         # Scenario/Feature card
├── docs/                         # Documentation
│   ├── architecture/             # Architecture docs
│   ├── context-resumes/          # Context resume files
│   ├── DATA_FLOW.md              # Data flow documentation
│   └── IMPLEMENTATION_SUMMARY.md # Implementation history
├── features/                     # BDD Feature Files (Gherkin)
│   ├── steps/                    # Step definitions (Python)
│   └── *.feature                 # 16 feature files
├── lib/                          # Library utilities
│   ├── gherkinParser.ts          # Gherkin file parser
│   ├── parseFeatureFiles.ts      # Feature file utilities
│   └── skateboard-filesystem-parser.ts # Local FS parser
├── public/                       # Static assets
│   ├── bdd-data/                 # BDD test results JSON
│   └── test-artifacts/           # Test screenshots/artifacts
├── reference/                    # Design showcase reference components
│   ├── app/                      # Reference page implementations
│   │   ├── insights/             # Carousel-based insight synthesizer
│   │   └── insights-v2/          # Researcher's desk style
│   └── components/               # Reference UI components
│       ├── chat-interface.tsx    # AI assistant with note-taking
│       └── dossier/              # Terminal aesthetic components
│           ├── action-hub.tsx    # Action buttons for artifacts
│           ├── crt-background.tsx # CRT monitor effects
│           ├── terminal-window.tsx # Terminal wrapper
│           └── typewriter.tsx    # Typewriter animation
├── scripts/                      # Build/utility scripts
└── specs/                        # Specification handoffs
    └── handoff/                  # Handoff documents
```

### Key Directory Purposes

#### `/app` - Next.js Application Core
Contains the main application using Next.js 15 App Router. Each folder represents a route, and `page.tsx` files define the UI for that route.

#### `/app/api` - REST API Endpoints
Server-side API routes that handle:
- **`/api/bdd/features`**: Parses `.feature` files and returns structured JSON
- **`/api/bdd/progress`**: Returns BDD test execution metrics
- **`/api/skateboard/dashboard`**: Aggregates multi-project data from filesystem

#### `/components` - Shared UI Components
Core reusable components:
- **`DashboardHeader`**: Displays JTBD statement and key metrics
- **`UniversalCard`**: Collapsible card for features/scenarios with progress
- **`StepList`**: Renders BDD steps with status indicators

#### `/features` - BDD Specifications
Contains 16 Gherkin feature files following the pattern:
```
NN_role_action_outcome.feature
```
Example: `01_pm_declares_spec_confidently.feature`

Each feature includes:
- RESULT comments linking to measurable outcomes
- JTBD statements for context
- Technical benchmarks for performance validation

#### `/lib` - Parser Libraries
Critical utilities for transforming data:
- **`gherkinParser.ts`**: Uses `@cucumber/gherkin` to parse feature files
- **`skateboard-filesystem-parser.ts`**: Local filesystem BDD aggregator
- **`parseDuxObjects.ts`**: Extracts evidence from DUX Behavior objects

#### `/reference` - Design Showcase Reference Components
**Purpose**: Imported UI components from `dux-design-system-showcase` for HITL workflow integration.

These components serve as the foundation for all HITL use cases and will be modified to integrate with the canonical extraction-bdd-dashboard design system:

- **`components/chat-interface.tsx`**: AI assistant with chat history, note-taking, and evidence attachment capabilities
- **`components/dossier/`**: Terminal aesthetic components (typewriter effect, CRT background, terminal window, action hub)
- **`app/insights/`**: Carousel-based insight synthesizer connecting Problems → Behaviors → Results
- **`app/insights-v2/`**: Researcher's desk visual style for insight chains

**Note**: The canonical Tailwind CSS configuration and design tokens from the main `extraction-bdd-dashboard` project remain authoritative. These reference components will be adapted to match.

---

## 3. File-by-File Breakdown

### Core Application Files

#### Main Entry Points

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Root layout with Toaster provider |
| `app/bdd-progress/page.tsx` | Main BDD dashboard with feature cards |
| `app/roadmap-timeline/page.tsx` | Longitudinal progress visualization |
| `app/feature-detail/[featureId]/page.tsx` | Dynamic feature detail page |

#### API Routes

| File | Endpoint | Description |
|------|----------|-------------|
| `app/api/bdd/features/route.ts` | `GET /api/bdd/features` | Returns all features with scenarios/steps |
| `app/api/bdd/progress/route.ts` | `GET /api/bdd/progress` | Returns BDD execution metrics |
| `app/api/bdd/mockups/route.ts` | `GET /api/bdd/mockups` | Returns UI mockup data |
| `app/api/skateboard/dashboard/route.ts` | `GET /api/skateboard/dashboard` | Multi-project aggregation |

### Configuration Files

| File | Purpose |
|------|---------|
| `package.json` | NPM dependencies and scripts |
| `next.config.js` | Next.js configuration (minimal) |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | Tailwind CSS theme configuration |
| `postcss.config.js` | PostCSS plugins (implied) |

### Data Layer

| File | Purpose |
|------|---------|
| `lib/gherkinParser.ts` | Parse Gherkin feature files to structured JSON |
| `app/lib/parseDuxObjects.ts` | Extract DUX Behavior/Result/Problem objects |
| `lib/skateboard-filesystem-parser.ts` | Local filesystem feature scanner |
| `public/bdd-data/behave-results.json` | Behave test execution results |
| `public/bdd-data/longitudinal-roadmap.json` | Historical progress snapshots |

### UI Components

| File | Purpose |
|------|---------|
| `components/DashboardHeader.tsx` | JTBD + metrics display header |
| `components/UniversalCard.tsx` | Expandable feature/scenario card |
| `components/StepList.tsx` | BDD step rendering with status |
| `app/components/hitl/ChatInterface.tsx` | AI-powered narrative refinement |
| `app/components/ui/*.tsx` | Shadcn/UI primitive components |

### BDD Feature Files

```
features/
├── 01_pm_declares_spec_confidently.feature
├── 02_pm_knows_whats_missing.feature
├── 03_developer_sees_ci_results.feature
├── 04_team_focuses_on_their_project.feature
├── 05_design_leader_proves_variant_winner.feature
├── 06_org_runs_dashboard_reliably.feature
├── 07_designer_writes_bdd_spec.feature
├── 08_character_agents_prevent_bad_specs.feature
├── 09_pm_tracks_accountability.feature
├── 10_engineer_implements_from_spec.feature
├── 11_pm_knows_feature_ready.feature
├── 12_pm_coordinates_team.feature
├── 13_sales_forecasts_ship_dates.feature
├── 14_cfo_sees_design_roi.feature
├── 15_executive_compares_team_performance.feature
└── pm_em_dashboard_validation.feature
```

### Step Definitions

| File | Purpose |
|------|---------|
| `features/steps/dashboard_validation_steps.py` | Python Behave step definitions |
| `features/environment.py` | Behave hooks and setup |

---

## 4. API Endpoints Analysis

### GET /api/bdd/features

**Purpose:** Returns all parsed BDD features with scenarios and steps

**Response Format:**
```typescript
{
  features: BDDFeature[],
  summary: {
    total_features: number,
    total_scenarios: number,
    total_steps: number,
    status: string,
    step_definitions_implemented: boolean
  },
  generated_at: string,
  data_source: string
}
```

**BDDFeature Structure:**
```typescript
interface BDDFeature {
  id: string                 // e.g., "workspace_ownership"
  name: string               // Feature name from Gherkin
  title: string              // Display title
  file_path: string          // Source file location
  status: 'completed' | 'in_progress' | 'not_started' | 'failed'
  overall_progress: number   // 0-100 percentage
  scenarios: BDDScenario[]
  evidenceCount?: number     // From DUX Behavior objects
  passedScenarios?: number
  totalScenarios?: number
}
```

### GET /api/bdd/progress

**Purpose:** Returns aggregated BDD execution metrics

**Response Format:**
```typescript
{
  bdd_progress: {
    total_features: number,
    total_scenarios: number,
    total_steps: number,
    passed_steps: number,
    failed_steps: number,
    undefined_steps: number,
    implementation_completeness: number,
    definition_coverage: number,
    step_execution_rate: number
  },
  conservative_hitl_metrics: {
    evidence_in_review: number,
    evidence_approved: number,
    evidence_rejected: number,
    average_review_time_ms: number,
    active_reviewers: number
  },
  demo_readiness: {
    overall_status: string,
    critical_blockers: number,
    key_features_operational: number
  }
}
```

### GET /api/skateboard/dashboard

**Purpose:** Aggregates multi-project BDD data from local filesystem

**Response Format:**
```typescript
{
  projects: ProjectSummary[],
  lastUpdated: string
}

interface ProjectSummary {
  id: string
  name: string
  featureCount: number
  scenarioCount: number
  avgLintScore: number
  features: FeatureSummary[]
}
```

---

## 5. Architecture Deep Dive

### Data Flow Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW PIPELINE                               │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: Source Files (.feature)
    ↓
    features/*.feature (Gherkin BDD specifications)
    • 16 feature files with JTBD headers
    • Scenarios with Given/When/Then steps

Step 2: Parser (lib/gherkinParser.ts)
    ↓
    parseFeatureDirectory() → reads all .feature files
    • Uses @cucumber/gherkin to parse Gherkin syntax
    • Extracts: features, scenarios, steps, tags
    • Generates unique IDs (S1, S2, S3...)

Step 3: DUX Object Linking (app/lib/parseDuxObjects.ts)
    ↓
    loadAllBehaviors() → reads DUX-Governance/instances/behaviors/*.md
    • Matches features to Behavior objects
    • Extracts evidence counts
    • Links observable signals

Step 4: Test Results Merge (optional)
    ↓
    public/bdd-data/behave-results.json (if exists)
    • mergeWithTestResults() updates step statuses
    • Maps behave status → parsed status

Step 5: API Route (app/api/bdd/features/route.ts)
    ↓
    GET /api/bdd/features
    • Combines parsed features + DUX evidence + test results
    • Converts to API format
    • Returns JSON response

Step 6: Client-Side Fetch (pages)
    ↓
    useEffect(() => fetch('/api/bdd/features'))
    • Fetches all features from API
    • Stores in React state
    • Handles loading/error states

Step 7: UI Rendering
    ↓
    React Components
    • DashboardHeader (JTBD + metrics)
    • UniversalCard (scenarios as cards)
    • Navigation buttons (Previous/Next)
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         COMPONENT HIERARCHY                              │
└─────────────────────────────────────────────────────────────────────────┘

RootLayout
├── Toaster (toast notifications)
└── Page
    ├── DashboardHeader
    │   ├── Pipeline Title
    │   ├── Online Status Indicator
    │   ├── Journey Section (JTBD Box)
    │   └── Progress Metrics Grid
    ├── Feature Cards Row
    │   └── UniversalCard (for each feature)
    │       ├── ID Badge
    │       ├── Status Indicator
    │       ├── Title
    │       ├── Metrics Row
    │       ├── Progress Bar
    │       └── Expanded Content (scenarios/steps)
    └── Navigation Controls
```

### State Management

The application uses React's built-in state management:

```typescript
// Page-level state
const [progressData, setProgressData] = useState<BDDProgressData | null>(null)
const [bddFeatures, setBddFeatures] = useState<RealBDDFeature[] | null>(null)
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)
const [expandedCardId, setExpandedCardId] = useState<string | null>(null)
```

### Caching Strategy

```typescript
// In-memory caching with 60-second TTL (skateboard-filesystem-parser.ts)
let cache: { data: DashboardData | null; timestamp: number } = {
  data: null,
  timestamp: 0
};

const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export async function getCachedDashboardData(rootDir: string): Promise<DashboardData> {
  const now = Date.now();
  if (cache.data && (now - cache.timestamp) < CACHE_TTL_MS) {
    return cache.data;
  }
  // Regenerate and cache
}
```

---

## 6. Environment & Setup Analysis

### Required Environment Variables

```bash
# Optional - Chat API endpoint for HITL interface
NEXT_PUBLIC_CHAT_API_ENDPOINT="/api/chat/proxy"  # Defaults to this
```

### Installation & Setup

```bash
# Navigate to project
cd extraction-bdd-dashboard

# Install dependencies
npm install

# Run development server
npm run dev    # Starts on http://localhost:3000

# Build for production
npm run build

# Run production server
npm start

# Run BDD tests
npm run test:cucumber
npm run test:e2e
```

### Development Workflow

1. **Feature Development:**
   - Write `.feature` file in `features/` directory
   - Add step definitions in `features/steps/`
   - Dashboard auto-refreshes (30-second polling)

2. **Component Development:**
   - Edit components in `components/` or `app/components/`
   - Hot reload via Next.js dev server

3. **API Development:**
   - Add routes in `app/api/` directory
   - Test via `curl http://localhost:3000/api/endpoint`

### Scripts

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test:cucumber": "cucumber-js",
  "test:cucumber:watch": "cucumber-js --watch",
  "test:e2e": "cucumber-js --profile e2e"
}
```

---

## 7. Technology Stack Breakdown

### Runtime Environment
- **Node.js** (implied v18+ for Next.js 15)
- **Next.js 15.2.4** with App Router

### Frameworks & Libraries

| Library | Purpose | Usage |
|---------|---------|-------|
| **React 19** | UI framework | Components, hooks |
| **Next.js 15** | Full-stack framework | Routing, SSR, API |
| **Tailwind CSS** | Utility-first CSS | Styling |
| **Radix UI** | Accessible primitives | Dialogs, dropdowns, tabs |
| **Lucide React** | Icon library | UI icons |

### BDD & Testing

| Library | Purpose |
|---------|---------|
| **@cucumber/gherkin** | Parse Gherkin feature files |
| **@cucumber/cucumber** | Run Cucumber.js tests |
| **Playwright** | Browser automation for E2E |
| **behave** | Python BDD framework (external) |

### AI Integration

| Library | Purpose |
|---------|---------|
| **@ai-sdk/react** | React hooks for AI chat |
| **ai** | Vercel AI SDK for streaming |

### Build Tools
- **PostCSS** with autoprefixer
- **TypeScript** compiler
- **Next.js** built-in bundler (SWC)

---

## 8. Visual Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DUX HITL UI ARCHITECTURE                                │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   FRONTEND                                        │
│                                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              PAGES (Next.js App Router)                      │ │
│  │                                                                               │ │
│  │   /bdd-progress              /roadmap-timeline        /feature-detail/[id]  │ │
│  │   ┌──────────────┐           ┌──────────────┐         ┌──────────────┐       │ │
│  │   │ BDD Progress │           │ Longitudinal │         │ Feature      │       │ │
│  │   │ Dashboard    │           │ Timeline     │         │ Detail       │       │ │
│  │   └──────────────┘           └──────────────┘         └──────────────┘       │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
│                                       │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────┐ │
│  │                              COMPONENTS                                       │ │
│  │                                                                               │ │
│  │   ┌───────────────┐    ┌───────────────┐    ┌───────────────────────────┐   │ │
│  │   │ DashboardHeader│    │ UniversalCard │    │ ChatInterface (HITL)     │   │ │
│  │   │ - JTBD        │    │ - Feature     │    │ - AI-powered refinement  │   │ │
│  │   │ - Metrics     │    │ - Scenario    │    │ - useChat hook           │   │ │
│  │   └───────────────┘    │ - Steps       │    └───────────────────────────┘   │ │
│  │                        └───────────────┘                                     │ │
│  │                                                                               │ │
│  │   ┌─────────────────────────────────────────────────────────────────────┐   │ │
│  │   │                    UI Primitives (Radix + Shadcn)                   │   │ │
│  │   │   Card │ Button │ Input │ Tabs │ Progress │ Toast │ Badge          │   │ │
│  │   └─────────────────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ HTTP/JSON
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   API LAYER                                       │
│                                                                                   │
│   ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│   │ /api/bdd/       │    │ /api/bdd/       │    │ /api/skateboard │             │
│   │ features        │    │ progress        │    │ /dashboard      │             │
│   │                 │    │                 │    │                 │             │
│   │ Returns parsed  │    │ Returns BDD     │    │ Multi-project   │             │
│   │ feature data    │    │ execution       │    │ aggregation     │             │
│   │ + DUX evidence  │    │ metrics         │    │                 │             │
│   └────────┬────────┘    └────────┬────────┘    └────────┬────────┘             │
│            │                      │                      │                       │
└────────────┼──────────────────────┼──────────────────────┼───────────────────────┘
             │                      │                      │
             ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                  DATA LAYER                                       │
│                                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                           PARSERS / UTILITIES                            │   │
│   │                                                                           │   │
│   │   lib/gherkinParser.ts    │   app/lib/parseDuxObjects.ts               │   │
│   │   • parseFeatureFile()    │   • loadAllBehaviors()                      │   │
│   │   • parseFeatureDirectory()│  • getEvidenceCountForFeature()            │   │
│   │   • mergeWithTestResults()│                                             │   │
│   │                           │   lib/skateboard-filesystem-parser.ts       │   │
│   │                           │   • generateDashboardData()                 │   │
│   │                           │   • lintFeature() (quality scoring)         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                        │                                         │
│                                        ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                             FILE SYSTEM                                  │   │
│   │                                                                           │   │
│   │   features/*.feature          │   public/bdd-data/                      │   │
│   │   ├── 01_pm_declares_...      │   ├── behave-results.json               │   │
│   │   ├── 02_pm_knows_...         │   └── longitudinal-roadmap.json         │   │
│   │   └── ...16 feature files     │                                         │   │
│   │                               │   ../DUX-Governance/                     │   │
│   │                               │   └── instances/behaviors/*.md           │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              EXTERNAL SYSTEMS                                     │
│                                                                                   │
│   ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐       │
│   │ behave (Python)   │    │ Playwright        │    │ AI Chat API       │       │
│   │ BDD test runner   │    │ Browser automation│    │ (configurable)    │       │
│   └───────────────────┘    └───────────────────┘    └───────────────────┘       │
│                                                                                   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### File Structure Hierarchy

```
dux-hitl-ui/
└── extraction-bdd-dashboard/          # Main application
    ├── app/                           # Next.js App Router
    │   ├── api/                       # Server-side API routes
    │   │   ├── bdd/                   # BDD data endpoints
    │   │   └── skateboard/            # Multi-project aggregation
    │   ├── bdd-progress/              # Dashboard page
    │   ├── feature-detail/[id]/       # Dynamic feature pages
    │   ├── roadmap-timeline/          # Timeline visualization
    │   ├── components/                # App-specific components
    │   │   ├── hitl/                  # HITL chat interface
    │   │   └── ui/                    # Shadcn primitives
    │   ├── hooks/                     # Custom hooks
    │   └── lib/                       # App utilities
    ├── components/                    # Shared components
    ├── features/                      # BDD feature files
    │   └── steps/                     # Step definitions
    ├── lib/                          # Core utilities
    ├── public/                       # Static assets
    │   └── bdd-data/                 # Test results
    └── docs/                         # Documentation
```

---

## 9. Key Insights & Recommendations

### Code Quality Assessment

#### Strengths ✅

1. **Single Source of Truth**: Feature files are the authoritative source; dashboard reads them directly
2. **Clean Separation**: Parser → API → UI layers are well-separated
3. **Type Safety**: TypeScript interfaces enforce data contracts between layers
4. **Graceful Degradation**: Works with or without test results
5. **Comprehensive Documentation**: DATA_FLOW.md and IMPLEMENTATION_SUMMARY.md

#### Areas for Improvement ⚠️

1. **JTBD Extraction**: Parser doesn't reliably extract JTBD from feature file comments
2. **No Caching Layer**: API parses files on every request (acceptable for <20 features)
3. **Client-Side Filtering**: All features fetched, then filtered client-side
4. **Step Definition Coverage**: Many step definitions are scaffolds (return `pass`)

### Security Considerations

1. **File System Access**: API reads from filesystem - ensure path sanitization
2. **No Authentication**: Dashboard is open; consider adding auth for production
3. **AI Chat Integration**: Uses configurable endpoint - validate input/output
4. **CORS**: Next.js API routes are same-origin; external APIs need CORS config

### Performance Optimization Opportunities

1. **Add Feature-Specific API**: `/api/bdd/features/[id]` to reduce payload size
2. **Implement File Caching**: Watch `.feature` files for changes, cache parsed results
3. **Add Pagination**: For large feature sets (>20 features)
4. **Lazy Load Scenarios**: Load scenario details on card expansion

### Maintainability Suggestions

1. **Extract Constants**: Move status mappings to shared constants file
2. **Add Unit Tests**: Parser utilities have no test coverage
3. **Create Component Stories**: Add Storybook for UI components
4. **Standardize Error Handling**: Create shared error boundary component

### Recommended Next Steps

1. **Short-term (This Sprint)**
   - Fix JTBD extraction from feature file comments
   - Add feature search/filtering capability
   - Implement feature-specific API endpoint

2. **Medium-term (Next Month)**
   - Add WebSocket for real-time test updates
   - Implement Redis caching layer
   - Create comprehensive test suite

3. **Long-term (Next Quarter)**
   - Multi-repository support
   - CI/CD integration with GitHub Actions
   - Dashboard analytics and trending

---

## Appendix: Quick Reference

### Development Commands

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Run BDD tests
npm run test:cucumber

# Run E2E tests
npm run test:e2e
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/bdd/features` | GET | All parsed features |
| `/api/bdd/progress` | GET | BDD execution metrics |
| `/api/bdd/mockups` | GET | UI mockup data |
| `/api/skateboard/dashboard` | GET | Multi-project aggregation |

### Key Files to Edit

| Task | File |
|------|------|
| Add new feature | `features/NN_new_feature.feature` |
| Add step definition | `features/steps/dashboard_validation_steps.py` |
| Modify dashboard UI | `app/bdd-progress/page.tsx` |
| Update card component | `components/UniversalCard.tsx` |
| Add new API endpoint | `app/api/[name]/route.ts` |

---

*Generated by Claude Code Analysis - January 18, 2026*
