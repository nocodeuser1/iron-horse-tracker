# Agent Task Specifications

## Agent 1: Foundation & Data Setup

**Working Directory:** `/Users/guardian/.openclaw/workspace/iron-horse-tracker`

**Task:**
```
You are building the foundation for an industry-leading Title V permit tracker for Iron Horse Midstream.

Read PROJECT_SPEC.md for full requirements.

Your Phase 1 tasks:

1. **Project Setup**
   - Initialize a modern React + TypeScript + Vite project
   - Configure TailwindCSS + install shadcn/ui
   - Set up folder structure as specified in PROJECT_SPEC.md
   - Configure TypeScript strict mode
   - Set up ESLint + Prettier

2. **Data Parsing & Sanitization**
   - Read Example Data.xlsx using xlsx library (already installed)
   - Parse the data into TypeScript types
   - CRITICAL: Remove ALL mentions of "Delek" company
   - Transform into clean JSON format
   - Save to src/lib/data/sample-requirements.json
   - Create TypeScript interfaces in src/types/

3. **Base Layout**
   - Create main app shell with routing (React Router v6)
   - Navigation bar with Iron Horse logo (IH Logo.png)
   - Basic layout components
   - Set up pages folder with placeholder pages

4. **Git Commits**
   - Make atomic commits for each step
   - Push to main branch

When completely finished, run:
openclaw system event --text "Agent 1 Done: Foundation setup complete, data parsed & sanitized" --mode now
```

---

## Agent 2: Core Features

**Working Directory:** `/Users/guardian/.openclaw/workspace/iron-horse-tracker`

**Prerequisites:** Agent 1 must complete first

**Task:**
```
You are building the core features for the Iron Horse permit tracker.

Read PROJECT_SPEC.md and review Agent 1's work.

Your Phase 2 tasks:

1. **Dashboard Page**
   - Create beautiful dashboard with metrics cards:
     - Total requirements
     - Due this month
     - Overdue items
     - Compliance score
   - Add charts using Recharts:
     - Requirements by type (pie chart)
     - Requirements by recurrence (bar chart)
   - Recent activity feed
   - Use shadcn/ui components for polish

2. **Requirements Table/List**
   - Advanced filtering system:
     - Multi-select for action types
     - Multi-select for recurrence patterns
     - Multi-select for equipment types
     - Date range picker
     - Status filter (completed, pending, overdue)
   - Full-text search
   - Sortable columns
   - Responsive (table on desktop, cards on mobile)
   - Click item for detail view
   - Virtual scrolling for performance

3. **Calendar View**
   - Monthly/weekly calendar
   - Color-coded by type
   - Click events for details
   - Filter integration

4. **State Management**
   - Set up React Query for data fetching
   - Zustand for UI state
   - LocalStorage persistence

5. **Git Commits**
   - Commit each feature separately
   - Push to main

When completely finished, run:
openclaw system event --text "Agent 2 Done: Dashboard, table, and calendar complete" --mode now
```

---

## Agent 3: Polish & Enhancements

**Working Directory:** `/Users/guardian/.openclaw/workspace/iron-horse-tracker`

**Prerequisites:** Agent 2 must complete first

**Task:**
```
You are adding the polish and wow-factor features for Iron Horse permit tracker.

Read PROJECT_SPEC.md and review previous work.

Your Phase 3 tasks:

1. **AI Chat Placeholder**
   - Clean, professional chat interface
   - Welcome message explaining:
     - "AI Assistant coming soon"
     - "Will use local LLM for privacy & security"
     - "Ask questions about your permit requirements"
   - Sample questions displayed
   - Maybe 2-3 canned demo responses to show potential
   - Beautiful, modern chat UI

2. **Settings Page**
   - Permit type management
   - Add new permit types
   - Configure custom fields
   - Export/import data
   - User preferences

3. **Dark Mode**
   - Complete dark mode implementation
   - Toggle in settings or navigation
   - Smooth transitions
   - Works with all components

4. **Export Functionality**
   - Export to Excel
   - Export to CSV
   - Print-friendly views

5. **Polish**
   - Loading states everywhere
   - Error boundaries and error states
   - Empty states with helpful messages
   - Smooth animations and transitions
   - Mobile responsive refinements
   - Accessibility improvements

6. **Git Commits**
   - Commit each feature
   - Push to main

When completely finished, run:
openclaw system event --text "Agent 3 Done: AI chat, settings, dark mode, and polish complete" --mode now
```

---

## Agent 4: Deployment & Final QA

**Working Directory:** `/Users/guardian/.openclaw/workspace/iron-horse-tracker`

**Prerequisites:** Agent 3 must complete first

**Task:**
```
You are preparing the Iron Horse permit tracker for production deployment.

Read PROJECT_SPEC.md and review the complete application.

Your Phase 4 tasks:

1. **Build Optimization**
   - Configure Vite for production
   - Code splitting
   - Lazy loading for routes
   - Asset optimization
   - Tree shaking verification

2. **README.md**
   - Project overview
   - Features list
   - Tech stack
   - Setup instructions
   - Deployment guide
   - Screenshots/GIFs if possible

3. **Netlify Configuration**
   - Create netlify.toml with proper settings
   - Configure build command
   - Set up redirects for SPA routing
   - Add _headers for security

4. **Final QA**
   - Test all features
   - Test on different screen sizes
   - Check performance
   - Verify all data sanitization (no "Delek" mentions)
   - Test dark mode
   - Check accessibility

5. **Documentation**
   - Add inline code comments
   - Document component props
   - Create DEPLOYMENT.md with Netlify instructions

6. **Git Commits**
   - Final commits
   - Tag release v1.0.0
   - Push to main

When completely finished, run:
openclaw system event --text "Agent 4 Done: Production-ready, optimized, and documented. Ready for Netlify deployment!" --mode now
```
