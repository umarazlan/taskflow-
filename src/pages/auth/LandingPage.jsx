import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Kanban,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Clock,
  Users,
  ChevronRight,
  Star,
  Moon,
  Sun,
  LayoutGrid,
  BarChart3,
  Calendar,
  Command,
  Menu,
  X,
} from 'lucide-react';
import { Button, Badge, Card, Avatar, AvatarGroup } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, logout } = useAuth();
  const [isAnnual, setIsAnnual] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleQuickDemo = async () => {
    try {
      await login('demo@taskflow.com', 'Demo@1234');
      navigate('/app/dashboard');
    } catch {
      navigate('/login');
    }
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100 selection:bg-brand-500 selection:text-white">
      {/* 1. Header / Navbar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/90 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" onClick={closeMenu} className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft transition-transform group-hover:scale-105">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              How It Works
            </a>
            <a href="#testimonials" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Wall of Love
            </a>
            <a href="#pricing" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              Pricing
            </a>
          </div>

          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard">
                  <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                    Open App
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={logout}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button variant="primary" size="sm" rightIcon={ArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Theme + Hamburger Button */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer / Dropdown */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-4 shadow-xl animate-fadeIn">
            <div className="flex flex-col space-y-3 font-medium text-base text-slate-700 dark:text-slate-200">
              <a
                href="#features"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                How It Works
              </a>
              <a
                href="#testimonials"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Wall of Love
              </a>
              <a
                href="#pricing"
                onClick={closeMenu}
                className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                Pricing
              </a>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2.5">
              {isAuthenticated ? (
                <>
                  <Link to="/app/dashboard" onClick={closeMenu} className="w-full">
                    <Button variant="primary" size="md" fullWidth rightIcon={ArrowRight}>
                      Open App Dashboard
                    </Button>
                  </Link>
                  <Button variant="ghost" size="md" fullWidth onClick={() => { logout(); closeMenu(); }}>
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/signup" onClick={closeMenu} className="w-full">
                    <Button variant="primary" size="md" fullWidth rightIcon={ArrowRight}>
                      Get Started Free
                    </Button>
                  </Link>
                  <Link to="/login" onClick={closeMenu} className="w-full">
                    <Button variant="outline" size="md" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="md"
                    fullWidth
                    leftIcon={Zap}
                    onClick={() => { handleQuickDemo(); closeMenu(); }}
                    className="text-brand-600 dark:text-brand-400"
                  >
                    1-Click Demo Login
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden">
        {/* Glow background effects */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[340px] sm:w-[700px] h-[340px] sm:h-[500px] bg-gradient-to-b from-brand-500/20 via-purple-500/10 to-transparent blur-3xl rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex max-w-full items-center gap-1.5 sm:gap-2 rounded-full border border-brand-200/80 bg-brand-50/70 px-3 py-1.5 text-[11px] sm:text-xs font-medium text-brand-700 dark:border-brand-800/80 dark:bg-brand-950/60 dark:text-brand-300 shadow-subtle mb-6 animate-fadeIn">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-brand-600 dark:text-brand-400" />
            <span className="truncate">TaskFlow 2.0 is live — Built for high-velocity teams</span>
            <ChevronRight className="h-3 w-3 shrink-0 opacity-60" />
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.15] sm:leading-[1.1]">
            The modern project OS for{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              shipping faster.
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-2">
            Streamline tasks, align cross-functional engineering and design teams, and turn complex roadmaps into shipped products. Without the clutter.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto">
            {isAuthenticated ? (
              <Link to="/app/dashboard" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" fullWidth rightIcon={ArrowRight} className="shadow-lg shadow-brand-500/25">
                  Go to Your Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/signup" className="w-full sm:w-auto">
                  <Button variant="primary" size="lg" fullWidth rightIcon={ArrowRight} className="shadow-lg shadow-brand-500/25">
                    Start for Free — No Card Needed
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleQuickDemo}
                  leftIcon={Zap}
                  className="w-full sm:w-auto"
                >
                  1-Click Demo Login
                </Button>
              </>
            )}
          </div>

          {/* Value props badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Free 14-day Pro trial
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> Instant local persistence
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> No credit card required
            </span>
          </div>

          {/* Interactive UI Mock Preview */}
          <div className="mt-10 sm:mt-14 rounded-2xl border border-slate-200/80 bg-slate-100/60 p-2 sm:p-4 shadow-soft-xl dark:border-slate-800 dark:bg-slate-900/60 max-w-5xl mx-auto overflow-hidden">
            <div className="rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900 overflow-hidden text-left">
              {/* Window controls bar */}
              <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-rose-400 shrink-0" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-400 shrink-0" />
                  <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-400 shrink-0" />
                  <span className="ml-2 sm:ml-3 text-[11px] sm:text-xs font-medium text-slate-500 truncate hidden xs:inline">
                    taskflow.app/workspace/acme-studio
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="primary" size="sm" dot>Sprint 24</Badge>
                </div>
              </div>

              {/* Mock Dashboard Preview */}
              <div className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 bg-slate-50/50 dark:bg-slate-950/40">
                {/* Column 1: Backlog */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      Backlog
                    </span>
                    <Badge variant="default" size="sm">4</Badge>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 bg-white dark:bg-slate-900/90 shadow-subtle space-y-2">
                    <Badge variant="purple" size="sm">Design</Badge>
                    <p className="text-xs font-medium">Design System tokens audit & elevation shadows</p>
                    <div className="flex items-center justify-between pt-1">
                      <Avatar name="Emily Zhang" size="xs" />
                      <span className="text-[10px] text-slate-400">Nov 18</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Progress */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-brand-500" />
                      In Progress
                    </span>
                    <Badge variant="primary" size="sm">6</Badge>
                  </div>
                  <div className="rounded-lg border border-brand-200/80 dark:border-brand-800/80 p-2.5 sm:p-3 bg-white dark:bg-slate-900 shadow-soft space-y-2 ring-1 ring-brand-500/20">
                    <Badge variant="primary" size="sm">Frontend</Badge>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      Kanban Board Drag & Drop optimistic updates
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <Avatar name="Sarah Chen" size="xs" presence="online" />
                      <Badge variant="warning" size="sm">Urgent</Badge>
                    </div>
                  </div>
                </div>

                {/* Column 3: Completed */}
                <div className="rounded-xl border border-slate-200/80 bg-white p-3 sm:p-3.5 dark:border-slate-800 dark:bg-slate-900 space-y-3 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      Done
                    </span>
                    <Badge variant="success" size="sm">18</Badge>
                  </div>
                  <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-2.5 sm:p-3 bg-white dark:bg-slate-900 shadow-subtle space-y-2 opacity-80">
                    <Badge variant="success" size="sm">Auth</Badge>
                    <p className="text-xs font-medium line-through text-slate-500">
                      JWT authentication flow & session restoration
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <Avatar name="Alex Morgan" size="xs" />
                      <span className="text-[10px] text-emerald-600 font-semibold">100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Social Proof */}
      <section className="py-10 sm:py-12 border-y border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Trusted by product engineers & teams at top startups
          </p>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 sm:gap-10 items-center justify-center opacity-70 grayscale hover:grayscale-0 transition-all max-w-3xl mx-auto">
            <span className="text-sm sm:text-base font-bold tracking-wider text-center">▲ VERCEL</span>
            <span className="text-sm sm:text-base font-bold tracking-wider text-center">✦ LINEAR</span>
            <span className="text-sm sm:text-base font-bold tracking-wider text-center">● NOTION</span>
            <span className="text-sm sm:text-base font-bold tracking-wider text-center">◼ STRIPE</span>
            <span className="text-sm sm:text-base font-bold tracking-wider text-center col-span-2 sm:col-span-1">❖ FIGMA</span>
          </div>
        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <Badge variant="primary" size="sm" dot>Everything you need</Badge>
          <h2 className="mt-3 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Engineered for clarity, speed, and focus
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            No bloated menus. No confusing settings. TaskFlow gives your product team the exact tools required to deliver sprint after sprint.
          </p>
        </div>

        <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-brand-50 dark:bg-brand-950/70 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <LayoutGrid className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Fluid Kanban Boards</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Drag, reorder, and organize work with zero lag. Custom columns, WIP limits, subtask checklists, and instant status updates.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <Calendar className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Timeline & Calendar Views</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Visualize deadlines, spot schedule conflicts, and drag tasks between dates to reschedule your product releases instantly.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <Command className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Global Command Palette</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Press Ctrl+K / Cmd+K anywhere. Jump between projects, create tasks, switch dark mode, and search team members at lightning speed.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-sky-50 dark:bg-sky-950/70 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Burndown & Velocity Reports</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Understand sprint capacity, track team member workload, identify bottlenecks, and export CSV reports with one click.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <Clock className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Native Time Tracking</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Start and stop timers directly on tasks. Log billable and non-billable hours with accurate breakdown summaries.
            </p>
          </Card>

          <Card className="p-5 sm:p-6 space-y-3.5 hover:border-brand-500/50 transition-all group">
            <div className="h-11 w-11 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-subtle group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Role-Based Team Control</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Manage permissions with Owner, Admin, Member, and Viewer access. Invite teammates seamlessly with instant workspace links.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. How It Works */}
      <section id="how-it-works" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <Badge variant="purple" size="sm">Simple 3-Step Setup</Badge>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Get your entire team aligned in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-soft">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Create Workspace</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Set your team name, pick custom branding, and configure your default product workflows.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-soft">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Spin Up Projects</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Choose Kanban, Scrum, or Roadmapping templates. Populate tasks and milestones in seconds.
              </p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 p-4">
              <div className="h-12 w-12 rounded-2xl bg-brand-600 text-white font-bold text-lg flex items-center justify-center shadow-soft">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Invite & Ship</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Invite teammates by email, assign responsibilities, track velocity, and hit every release date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Wall of Love / Testimonials */}
      <section id="testimonials" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <Badge variant="warning" size="sm" dot>Customer Reviews</Badge>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Loved by builders worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "TaskFlow replaced three separate subscription tools for us. The keyboard shortcuts and Kanban feel as snappy as Linear."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Avatar name="Sarah Chen" size="sm" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Sarah Chen</p>
                <p className="text-[11px] text-slate-400">VP of Engineering at FinScale</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "The design system and light/dark theme implementation is immaculate. Our product design team actually enjoys logging tasks now."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Avatar name="Marcus Johnson" size="sm" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Marcus Johnson</p>
                <p className="text-[11px] text-slate-400">Design Director at HyperCraft</p>
              </div>
            </div>
          </Card>

          <Card className="p-5 sm:p-6 space-y-4 sm:col-span-2 lg:col-span-1">
            <div className="flex gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">
              "Being able to drag tasks across calendar dates and get instant burndown velocity reports saved us 10+ hours of status meetings every week."
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Avatar name="Elena Rostova" size="sm" />
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Elena Rostova</p>
                <p className="text-[11px] text-slate-400">Founder & CTO at NexusLab</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 7. Pricing Teaser */}
      <section id="pricing" className="py-16 sm:py-20 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <Badge variant="primary" size="sm">Flexible Pricing</Badge>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Start free, scale as you ship
            </h2>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <span className={`text-xs font-medium ${!isAnnual ? 'text-brand-600 font-bold' : 'text-slate-500'}`}>
                Monthly billing
              </span>
              <button
                type="button"
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isAnnual ? 'bg-brand-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAnnual ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-xs font-medium flex items-center gap-1.5 ${isAnnual ? 'text-brand-600 font-bold' : 'text-slate-500'}`}>
                Annual billing <Badge variant="success" size="sm">Save 20%</Badge>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Starter</h3>
                <p className="text-xs text-slate-500 mt-1">For individuals and small hackathons</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">$0</span>
                  <span className="text-xs text-slate-400 ml-1">/ forever</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Up to 3 active projects</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Kanban board view</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Basic team collaboration</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Local storage persistence</li>
              </ul>
              <Link to="/signup" className="block">
                <Button variant="outline" size="md" fullWidth>Get Started Free</Button>
              </Link>
            </Card>

            {/* Pro Plan (Featured) */}
            <Card className="p-5 sm:p-6 space-y-5 border-2 border-brand-500 shadow-soft-lg relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge variant="primary" size="sm" dot>Most Popular</Badge>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pro Team</h3>
                <p className="text-xs text-slate-500 mt-1">For growing engineering and product squads</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">{isAnnual ? '$12' : '$15'}</span>
                  <span className="text-xs text-slate-400 ml-1">/ user / mo</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Unlimited projects & tasks</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Timeline & Calendar views</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Burndown velocity charts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Command palette (Ctrl+K)</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> CSV exports & time tracking</li>
              </ul>
              <Link to="/signup" className="block">
                <Button variant="primary" size="md" fullWidth rightIcon={ArrowRight}>Start 14-Day Free Trial</Button>
              </Link>
            </Card>

            {/* Enterprise Plan */}
            <Card className="p-5 sm:p-6 space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enterprise</h3>
                <p className="text-xs text-slate-500 mt-1">For organizations requiring strict governance</p>
                <div className="mt-4 flex items-baseline">
                  <span className="text-3xl font-extrabold">$29</span>
                  <span className="text-xs text-slate-400 ml-1">/ user / mo</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Custom workspace roles</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> SSO / SAML authentication</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> Audit logs & security reviews</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" /> 99.9% uptime SLA</li>
              </ul>
              <Button variant="outline" size="md" fullWidth onClick={() => alert('Contacting sales...')}>
                Contact Enterprise
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. Bottom CTA Banner */}
      <section className="py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 p-7 sm:p-10 md:p-14 text-white shadow-soft-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to ship your best work?
            </h2>
            <p className="mt-3 sm:mt-4 text-xs sm:text-base text-brand-100 max-w-xl mx-auto leading-relaxed">
              Join thousands of engineers and designers who organize their sprints with TaskFlow.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-none mx-auto">
              {isAuthenticated ? (
                <Link to="/app/dashboard" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" fullWidth rightIcon={ArrowRight} className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                    Open Workspace Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="w-full sm:w-auto">
                    <Button variant="secondary" size="lg" fullWidth rightIcon={ArrowRight} className="bg-white text-slate-900 hover:bg-slate-100 font-bold">
                      Create Free Workspace
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleQuickDemo}
                    className="w-full sm:w-auto text-white border-white/40 hover:bg-white/10"
                  >
                    Instant Demo Access
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center text-white shrink-0">
                <Kanban className="h-4 w-4" />
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">TaskFlow</span>
            </div>
            <span className="hidden sm:inline">—</span>
            <span>The Project & Task Management Platform</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link to="/login" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign In</Link>
            <Link to="/signup" className="hover:text-slate-900 dark:hover:text-white transition-colors">Sign Up</Link>
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-slate-900 dark:hover:text-white transition-colors">Wall of Love</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
          </div>

          <p>© {new Date().getFullYear()} TaskFlow Inc. Built with React & Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  );
}
