# Design Showcase Reference Components

This directory contains reference components imported from the `dux-design-system-showcase` project.

## Purpose

These files are kept as **reference material only**. The canonical tailwind configuration and CSS in the main `extraction-bdd-dashboard` project is the DUX standard.

## Contents

### Components

- **chat-interface.tsx** - AI chat interface with message history and note-taking capabilities
- **dossier/typewriter.tsx** - Typewriter animation effect component
- **dossier/crt-background.tsx** - CRT monitor aesthetic background effects
- **dossier/terminal-window.tsx** - Terminal-style window wrapper component
- **dossier/action-hub.tsx** - Action buttons hub for generating artifacts and tickets

### App Pages

- **insights/page.tsx** - Insight Synthesizer with carousel-based chain viewer
- **insights-v2/page.tsx** - Alternative "Researcher's Desk" visual style for insight chains

## Notes

- These components use `@/components/ui/*` imports that reference the main project's UI components
- Tailwind classes and design tokens may differ from the canonical extraction-bdd-dashboard styles
- Use these as inspiration and reference, not as direct imports
