# BDD Progress Dashboard - Real-Time Test Visualization

## 🎯 Overview
This Next.js dashboard provides real-time visibility into BDD test execution for the **Discrete Connection** project - a Kubeflow workspace enhancement with credential isolation, GitOps collaboration, and multi-cloud deployment.

## 📁 File Structure
```
extraction-bdd-dashboard/
├── README.md                    # This file
├── bdd-progress/                # Main page component
│   └── page.tsx                 # React page for /bdd-progress route
├── bdd/                         # API endpoints
│   ├── progress/
│   │   └── route.ts            # Progress metrics API
│   └── features/
│       └── route.ts            # Feature details API
├── jtbd_timeline.tsx            # Main timeline UI component
├── timeout-manager.js           # Configuration utility
├── components/
│   └── ui/                     # Reusable UI components
├── layout.tsx                   # Next.js layout
├── globals.css                  # Global styles
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── next.config.js              # Next.js configuration
└── tsconfig.json               # TypeScript configuration
```

## 🚀 What This Dashboard Does

### **Live BDD Progress Tracking**
- **Real-time metrics**: Updates every 30 seconds
- **Step-level visibility**: Shows passed/failed/undefined/pending steps
- **Feature progress**: Visual timeline of 6 core Discrete Connection features
- **Implementation tracking**: Specification → validation → deployment phases

### **Visual Design**
- **Terminal-style interface**: Green-on-dark theme
- **Timeline visualization**: Horizontal progress with dots
- **Interactive cards**: Expandable feature details
- **Real-time updates**: Live data refresh

## 📊 Data Flow

1. **Page Load**: `bdd-progress/page.tsx` renders main component
2. **API Calls**: Fetches from `/api/bdd/progress` and `/api/bdd/features`
3. **Data Transform**: `jtbd_timeline.tsx` converts BDD data to timeline format
4. **Visual Render**: Terminal-style interface with progress indicators

## 🔧 API Endpoints

### `/api/bdd/progress`
Returns:
- Total features/scenarios/steps (6 features, 24 scenarios)
- Pass/fail/undefined counts
- Implementation completeness %
- Specification coverage %
- Step execution rate %

### `/api/bdd/features`
Returns:
- Feature details with scenarios for all 6 Discrete Connection features
- Step-level execution status
- Error messages and timing
- Feature categories: Ownership, Security, GitOps, Multi-cloud, Billing

## 🎨 Key Components

### **JTBDTimeline** (`jtbd_timeline.tsx`)
- Main timeline visualization
- Feature cards with progress bars
- Signal indicators (✅ 🔄 ⚠️)
- Expandable step details

### **BDDFeatureCard**
- Individual feature progress
- Step execution status
- Evidence count display
- Click to expand signals

### **TerminalHeader**
- Mac-style terminal window
- Online status indicator
- Version information

## ⚡ Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run development server**:
   ```bash
   npm run dev
   ```

3. **Access dashboard**:
   ```
   http://localhost:3000/bdd-progress
   ```

## 🧩 Dependencies

### **Core Framework**
- Next.js 15.2.4
- React 18
- TypeScript

### **UI Libraries**
- Tailwind CSS
- Lucide React (icons)
- Custom UI components

### **Data Fetching**
- Native fetch API
- Real-time updates (30s interval)
- Fallback to mock data

## 🔗 Integration Points

### **Data Source**
- BDD Features: `../worktrees/bdd-progress-dashboard/features/`
- Test Execution: Behave framework (Python BDD)
- JSON Output: `public/bdd-data/behave-results.json`
- Generator Script: `../run-behave-for-dashboard.sh`

### **Mock Data** (Current State)
API routes currently return hardcoded data for 6 Discrete Connection features:
1. **Workspace Ownership** - Owner assignment and lifecycle
2. **Service Account Binding** - Credential isolation ("kids table")
3. **Vault Integration** - Secret management and rotation
4. **GitOps Deployment** - Version control and two-step merge
5. **Multi-Cloud Access** - Cross-cloud resource management
6. **Billing Tracking** - Cost attribution and budget enforcement

**Next Step:** Update API routes to parse real `behave-results.json`

## 📈 Metrics Displayed

1. **Features Complete**: X/6 features passing
2. **Scenarios Executed**: 0-24 scenarios with pass/fail/undefined status
3. **Implementation Progress**: Specification → Validation → Deployment phases
4. **Step Coverage**: Total steps defined vs implemented
5. **Test Execution Rate**: Steps per feature with timing data

## 🔍 Debugging

- **Network tab**: Check API calls to `/api/bdd/*`
- **Console logs**: API errors logged to browser console
- **Mock fallback**: Dashboard works offline with sample data
- **Real-time updates**: Data refreshes every 30 seconds

## 📝 Notes

- **Self-contained Next.js app**: All dependencies included
- **Runs independently**: Dashboard works on localhost:3000
- **Mock data mode**: Currently shows hardcoded Discrete Connection features
- **Ready for real data**: Designed to parse behave JSON output

## 🔄 Current Status

**Phase:** Specification-Driven Development
**BDD Features:** 6 features defined (24 scenarios)
**Step Definitions:** Not yet implemented
**Dashboard State:** Mock data mode
**Next Milestone:** Parse real behave JSON → Update API routes

This dashboard provides real-time visibility into BDD test execution for the Discrete Connection Kubeflow workspace enhancement project.