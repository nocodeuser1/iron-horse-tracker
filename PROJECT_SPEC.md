# Iron Horse Midstream - Title V Permit Tracker

## Project Overview
Build an industry-leading web application for tracking Title V air quality permits. The app should be beautiful, fully functional, and populated with example data to wow the client.

## Company Details
- **Client**: Iron Horse Midstream
- **Purpose**: Title V permit compliance tracking
- **Future**: Expandable to track multiple permit types

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui components
- **State Management**: React Query + Zustand
- **Data Storage**: LocalStorage (easily swappable for backend later)
- **Charts/Viz**: Recharts or similar
- **Icons**: Lucide React
- **Routing**: React Router v6

## Data Structure (from Example Data.xlsx)

The example data contains permit tracking records with these fields:

### Core Fields
1. **Type of Action** (6 types):
   - Event Actions
   - Inspections
   - Samples
   - Tests
   - Throughput Reports

2. **Recurrence** (patterns):
   - Per Event
   - Initial
   - Continual
   - Quarterly
   - Semi-Annual
   - Annual
   - Initial / Annual
   - Initial / Quarterly
   - Initial / Biannual (Every 2 Years)

3. **Action**: Detailed description of the requirement
4. **Requirements Covered**: Specific permit requirements/rules
5. **Needed By**: Due date
6. **Completed Date**: When action was completed
7. **Name Of File Uploaded**: Supporting documentation

### Equipment Types (to add)
While not in the current data, add capability to filter by equipment type:
- Compressors
- Storage Tanks
- Flares
- Dehydrators
- Heaters
- Etc. (extensible)

## Key Features

### 1. Dashboard (Home Page)
- **Hero Section** with Iron Horse logo
- **Key Metrics Cards**:
  - Total active requirements
  - Items due this month
  - Items overdue
  - Compliance score (% completed on time)
- **Quick Stats Charts**:
  - Requirements by type (pie chart)
  - Requirements by recurrence (bar chart)
  - Upcoming deadlines timeline
- **Recent Activity** feed

### 2. Requirements Table/List
- **Advanced Filtering**:
  - Type of Action (multi-select)
  - Recurrence pattern (multi-select)
  - Equipment Type (multi-select)
  - Status (completed, pending, overdue)
  - Date range
- **Search**: Full-text search across all fields
- **Sorting**: By any column
- **Responsive** table/card view
- **Bulk Actions**: Mark as complete, export, etc.
- **Detail View**: Click any item for full details

### 3. Calendar View
- Monthly/weekly view of upcoming requirements
- Color-coded by type and urgency
- Click to see details
- Filter options

### 4. AI Chat Placeholder 🤖
- **Important**: This is a PLACEHOLDER only
- Clean, professional chat interface
- Welcome message explaining:
  - "AI Assistant coming soon"
  - "Will use local LLM for privacy"
  - "Ask questions about your permit requirements"
- Sample questions they could ask
- Maybe fake a few canned responses to show potential

### 5. Settings Page
- **Permit Management**:
  - Add new permit types
  - Configure custom fields
  - Import/export data
- **Notification Preferences**
- **User Preferences** (theme, etc.)

### 6. Reports/Export
- Export to Excel/CSV
- Generate compliance reports
- Print-friendly views

## Design Requirements

### Visual Design
- **Modern, professional** aesthetic
- **Clean, spacious** layouts
- **Responsive** - works on mobile, tablet, desktop
- **Dark mode** support (toggle in settings)
- **Brand colors** extracted from Iron Horse logo
- **Smooth animations** and transitions

### UX Principles
- **Intuitive navigation**
- **Fast performance** (virtual scrolling for large lists)
- **Clear data hierarchy**
- **Helpful empty states**
- **Loading states** for all async operations
- **Error handling** with friendly messages

## Data Sanitization

**CRITICAL**: Remove all mentions of "Delek" (the company name in the example data)
- Replace with "Iron Horse Midstream" where appropriate
- Or make requirements generic
- Keep the structure and requirements intact

## Example Data Population

- Parse the Example Data.xlsx file
- Transform into proper JSON structure
- Add ~50-100 sample records
- Include variety of:
  - Past, current, and future due dates
  - Mix of completed and pending
  - Different action types and recurrence patterns
- Add realistic equipment assignments

## File Structure

```
iron-horse-tracker/
├── public/
│   ├── IH_Logo.png
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn components
│   │   ├── dashboard/
│   │   ├── requirements/
│   │   ├── calendar/
│   │   ├── ai-chat/
│   │   ├── settings/
│   │   └── layout/
│   ├── lib/
│   │   ├── data/         # Example data + utilities
│   │   ├── hooks/
│   │   └── utils/
│   ├── pages/
│   ├── types/
│   ├── App.tsx
│   └── main.tsx
├── data/
│   └── sample-requirements.json
├── README.md
├── package.json
└── vite.config.ts
```

## Deployment

- Deploy to **Netlify**
- Use Israel's Netlify account
- Subdomain: `iron-horse-demo.netlify.app` (or similar)
- Enable preview deployments
- Ensure fast build times

## Success Criteria

The app should:
1. ✅ Load instantly and feel snappy
2. ✅ Look professional and modern
3. ✅ Be immediately usable without tutorial
4. ✅ Show the power of the filtering system
5. ✅ Demonstrate the AI future potential
6. ✅ Be fully populated with realistic data
7. ✅ Work flawlessly on mobile and desktop
8. ✅ "Wow" the client on first impression

## Development Phases

### Phase 1: Foundation (Agent Team 1)
- Set up Vite + React + TypeScript
- Configure TailwindCSS + shadcn/ui
- Set up routing structure
- Create base layout components
- Parse and sanitize example data

### Phase 2: Core Features (Agent Team 2)
- Build requirements table with filtering
- Implement dashboard with charts
- Create calendar view
- Set up data management (React Query + LocalStorage)

### Phase 3: Polish & Additional Features (Agent Team 3)
- AI chat placeholder interface
- Settings page
- Export functionality
- Dark mode
- Responsive refinements
- Loading/error states
- Animations

### Phase 4: Deployment (Agent Team 4)
- Optimize build
- Set up Netlify deployment
- Configure custom domain
- Test on multiple devices
- Final QA pass

## Notes for Coding Agents

- **Use Claude Code 4.6 Opus** for all development
- **Coordinate** between teams - share types and utilities
- **Test** as you build - ensure everything works
- **Document** key decisions in code comments
- **Focus on quality** over speed - this needs to impress
- **Mobile-first** responsive design
- **Accessibility** matters - proper ARIA labels, keyboard nav
- **Performance** - code-split, lazy load, virtual scroll large lists

## Logo
Located at: `/Users/guardian/.openclaw/workspace/iron-horse-tracker/IH Logo.png`

## Example Data
Located at: `/Users/guardian/.openclaw/workspace/iron-horse-tracker/Example Data.xlsx`
