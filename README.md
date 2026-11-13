# TaskFlow — Modern Project & Task Management Platform

TaskFlow is a production-quality, fast, and accessible frontend project and task management web application built with **React 18**, **Tailwind CSS**, and **Vite**. Inspired by modern SaaS tools like Linear, Notion, and Asana, TaskFlow provides an intuitive experience for agile product squads to manage tasks, sprints, timelines, and team workloads.

---

## 🚀 Live Demo & Seed Credentials

- **Development URL**: [https://tasqflow.netlify.app/](https://tasqflow.netlify.app/)
- **Demo Account**:
  - **Email**: `demo@taskflow.com`
  - **Password**: `Demo@1234`
  - *(Alternatively, click the **"1-Click Demo Login"** button on the Landing and Login pages for instant access)*

---

## 🛠️ Tech Stack & Architecture

- **Core**: React 18 + Vite (ESModules)
- **Styling**: Tailwind CSS with custom brand design tokens (`colors`, `shadow-soft`, `keyframes`, `darkMode: 'class'`)
- **Routing**: React Router v6 (lazy-loaded routes with `Suspense` fallbacks, nested layouts, `ProtectedRoute`, `PublicRoute`)
- **State & Data Layer**: React Context API + LocalStorage persistence layer simulating network latency (150ms–400ms) with zero backend requirement
- **Drag & Drop**: `@hello-pangea/dnd` for Kanban board column/task reordering + native HTML5 drag-and-drop for the Calendar scheduler
- **Forms & Validation**: React Hook Form + Zod schema validation
- **Data Visualizations**: Recharts (Area charts, Bar charts, Donut charts, Line burndowns)
- **Icons**: Lucide React
- **Dates**: Date-fns
- **Notifications**: React Hot Toast with styled light/dark alerts
- **Micro-Delight**: Canvas Confetti celebrations upon onboarding and task completions

---

## ✨ Features by Module

### 1. Design System & UI Library (20 Custom Components)
- Built completely from scratch with Tailwind CSS — zero third-party UI libraries:
  - `Button`: 6 variants (`primary`, `secondary`, `outline`, `ghost`, `danger`, `subtle`), sizes (`xs`, `sm`, `md`, `lg`, `icon`), loading spinner states.
  - `Input`: Label, validation errors, leading/trailing icons, password visibility toggle.
  - `Textarea`: Character counter and auto-resizing.
  - `Select`: Custom chevron icon and option grouping.
  - `Checkbox`: Custom SVG animated checkmarks with indeterminate state.
  - `Badge`: 8 semantic colors, pulsing presence dots, removable pill tags.
  - `Avatar` & `AvatarGroup`: Initials fallback with deterministic color hashing and online status rings.
  - `Modal`: Accessible dialog with focus trap, backdrop blur, ESC key dismiss.
  - `Drawer`: Smooth slide-over side drawer from right or left.
  - `Dropdown`: Menu dropdowns with dividers, icons, and keyboard support.
  - `Tabs`: Underline, segmented, and pill variants with counter badges.
  - `Tooltip`: Directional hover tooltips (`top`, `bottom`, `left`, `right`).
  - `Card`: Compound cards (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).
  - `Skeleton`: Shimmer pulse skeleton cards and text loaders.
  - `EmptyState`: Illustrated empty states with primary and secondary CTA buttons.
  - `ConfirmDialog`: Destructive confirmation dialogs for deletions.
  - `Pagination`: Page numbering with ellipsis and jump controls.
  - `ProgressBar`: Threshold-based semantic color progress bars.
  - `Toast`: Custom styled dark/light mode alert banners.

### 2. Authentication & Onboarding
- **Landing Page (`/`)**: Hero section with interactive UI preview, feature highlights, 3-step walkthrough, testimonials, pricing plans with monthly/annual toggle, and bottom CTA banner.
- **Login (`/login`)**: 1-Click Demo autofill, remember me checkbox, show/hide password toggle, and social OAuth UI.
- **Signup (`/signup`)**: Real-time password strength meter (score 0–100% with weak/fair/good/strong feedback), confirm password matching, and Terms of Service validation.
- **Password Recovery (`/forgot-password` & `/reset-password`)**: Simulated reset email dispatch and password update confirmation.
- **3-Step Onboarding Wizard (`/onboarding`)**:
  - Step 1: Workspace creation (name, URL slug, logo/emoji, team size).
  - Step 2: First project spin-up (name, color badge, workflow template).
  - Step 3: Teammate invites with roles (Admin / Member / Viewer) and celebratory confetti burst.

### 3. Application Layout Shell
- **Collapsible Sidebar**: Logo, workspace switcher dropdown, active route highlights, unread counter badges, starred favorite projects list, and user mini-profile with sign out.
- **Mobile Responsive Drawer**: Auto-collapses into a slide-over mobile drawer on tablets and smartphones.
- **Top Navbar**: Breadcrumbs trail, global search trigger, `+ Create` dropdown, notifications bell with unread badge, and quick theme toggle.
- **Command Palette (`Ctrl+K` / `⌘K`)**: Fuzzy-search navigation, actions, projects, and theme switching.
- **Keyboard Shortcuts (`?`)**: Full hotkey guide for rapid navigation.

### 4. Dashboard & Projects Portfolio
- **Dashboard (`/app/dashboard`)**:
  - Greeting with user's name and formatted date (`date-fns`).
  - 4 Key metric cards (Total Projects, Due Today, Overdue, Completed this week).
  - Visual charts: Task Completion Velocity (AreaChart), Status Breakdown (Donut), and Team Workload Capacity (BarChart).
  - Quick-add task bar for rapid backlog additions.
  - "My Upcoming Tasks" list with 1-click completion toggle.
- **Projects (`/app/projects`)**:
  - Grid and List view switcher.
  - Instant search and filters by status (All, In Progress, Active, Completed, Archived) and sorting.
  - Create and Edit Project Modal with color theme and icon pickers.
  - Project duplication, archiving, and deletion with ConfirmDialog.

### 5. Project Detail & Interactive Kanban Board (`/app/projects/:id`)
- **6 Dedicated Project Tabs**:
  1. **Board (Kanban)**: Drag-and-drop between columns and card reordering (`@hello-pangea/dnd`), WIP count badges, column collapse, inline quick card inputs, and custom column creation.
  2. **List View**: Sortable table with bulk selection, bulk complete, and bulk delete actions.
  3. **Timeline (Gantt-lite)**: Horizontal timeline tracking task spans across start and due dates.
  4. **Overview**: Project scope, milestones checklist, team roster, and key metric cards.
  5. **Files**: Drag-and-drop mock file uploader and downloadable file attachments.
  6. **Activity**: Chronological audit log of project events.

### 6. Task Drawer, My Tasks & Calendar
- **Task Detail Drawer**: Rich description markdown formatting, field editor (priority, status, assignee, dates, estimate), subtasks checklist with progress bar, live stopwatch timer with logged hours tracker, and team comments.
- **My Tasks (`/app/my-tasks`)**: Urgency groups (**Overdue**, **Due Today**, **This Week**, **Later**, **No Due Date**) with collapse toggles and instant completion checkboxes.
- **Calendar (`/app/calendar`)**: Month and Week views, date jump controls, click-to-schedule modal, and **HTML5 drag-and-drop to reschedule** tasks directly onto another calendar date.

### 7. Team, Reports & Settings
- **Team (`/app/team`)**: Member roster (Cards/Table), role badges (Owner, Admin, Member, Viewer), presence indicators, workload metrics, Invite Member Modal, and pending invites manager.
- **Reports (`/app/reports`)**: Sprint burndown curve, velocity bars, time distribution pie chart, and **Export CSV button** downloading a live generated CSV file.
- **Notifications (`/app/notifications`)**: Tabs for All, Unread, and Mentions with mark-as-read controls.
- **Settings (`/app/settings`)**: Profile, Account Security, Workspace (including **Reset Demo Data**), Notification preferences, Theme & Accents appearance, and Billing invoices history.

---

## 📂 Project Structure

```
taskflow/
├── index.html
├── package.json
├── vite.config.js
├── postcss.config.js
├── tailwind.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── data/
│   │   ├── seedData.js              # Initial users & default workspace
│   │   └── mockData.js              # Initial projects, columns & tasks
│   ├── services/
│   │   ├── storage.js               # LocalStorage type-safe helper
│   │   ├── authService.js           # Auth mock API & simulated JWT
│   │   ├── projectService.js        # Projects & columns API
│   │   └── taskService.js           # Tasks CRUD & reordering API
│   ├── context/
│   │   └── AuthContext.jsx          # Auth provider & session hook
│   ├── hooks/
│   │   └── useHotkeys.js            # Keyboard shortcuts hook
│   ├── utils/
│   │   ├── cn.js                    # Tailwind merge helper
│   │   └── theme.js                 # Dark mode persistence manager
│   ├── routes/
│   │   ├── AppRoutes.jsx            # Router v6 route configuration
│   │   ├── ProtectedRoute.jsx       # Auth guard
│   │   └── PublicRoute.jsx          # Guest guard
│   ├── components/
│   │   ├── common/
│   │   │   └── ErrorBoundary.jsx    # Graceful error boundary
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx        # Core application shell
│   │   │   ├── Sidebar.jsx          # Desktop & mobile drawer navigation
│   │   │   ├── Navbar.jsx           # Top header bar
│   │   │   ├── Breadcrumbs.jsx      # Path breadcrumbs
│   │   │   ├── NotificationsDropdown.jsx # Navbar notifications bell
│   │   │   ├── CommandPalette.jsx   # Ctrl+K global speed-dial
│   │   │   ├── CreateModal.jsx      # Quick task/project creator
│   │   │   └── ShortcutsModal.jsx   # '?' keyboard guide
│   │   ├── tasks/
│   │   │   └── TaskDetailDrawer.jsx # Comprehensive task editor
│   │   └── ui/                      # 20 Reusable design system components
│   │       ├── Button.jsx
│   │       ├── Input.jsx
│   │       ├── Textarea.jsx
│   │       ├── Select.jsx
│   │       ├── Checkbox.jsx
│   │       ├── Badge.jsx
│   │       ├── Avatar.jsx
│   │       ├── AvatarGroup.jsx
│   │       ├── Modal.jsx
│   │       ├── Drawer.jsx
│   │       ├── Dropdown.jsx
│   │       ├── Tabs.jsx
│   │       ├── Tooltip.jsx
│   │       ├── Card.jsx
│   │       ├── Skeleton.jsx
│   │       ├── EmptyState.jsx
│   │       ├── ConfirmDialog.jsx
│   │       ├── Pagination.jsx
│   │       ├── ProgressBar.jsx
│   │       ├── Toast.jsx
│   │       └── index.js
│   └── pages/
│       ├── NotFoundPage.jsx
│       ├── auth/
│       │   ├── LandingPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── SignupPage.jsx
│       │   ├── ForgotPasswordPage.jsx
│       │   ├── ResetPasswordPage.jsx
│       │   └── OnboardingPage.jsx
│       ├── dashboard/
│       │   └── DashboardPage.jsx
│       ├── projects/
│       │   ├── ProjectsPage.jsx
│       │   ├── ProjectDetailPage.jsx
│       │   ├── ProjectModal.jsx
│       │   ├── kanban/
│       │   │   ├── KanbanBoard.jsx
│       │   │   └── TaskCard.jsx
│       │   └── tabs/
│       │       ├── ProjectListView.jsx
│       │       ├── ProjectTimelineView.jsx
│       │       ├── ProjectOverviewTab.jsx
│       │       ├── ProjectFilesTab.jsx
│       │       └── ProjectActivityTab.jsx
│       ├── tasks/
│       │   └── MyTasksPage.jsx
│       ├── calendar/
│       │   └── CalendarPage.jsx
│       ├── team/
│       │   ├── TeamPage.jsx
│       │   └── InviteMemberModal.jsx
│       ├── reports/
│       │   └── ReportsPage.jsx
│       ├── notifications/
│       │   └── NotificationsPage.jsx
│       └── settings/
│           └── SettingsPage.jsx
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
|---|---|
| `⌘ + K` or `Ctrl + K` | Open global Command Palette |
| `?` | Show Keyboard Shortcuts modal |
| `C` | Quick-create new Task |
| `P` | Quick-create new Project |
| `ESC` | Close modal, drawer, or dropdown |
| `/` | Focus global search bar |

---

## ⚙️ Getting Started Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Open browser at:
# http://localhost:3000/

# 4. Production build verification
npm run build
```

---

Built with precision for fast-moving engineering and product teams.
