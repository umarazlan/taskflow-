import React, { useState } from 'react';
import {
  User,
  Shield,
  Building,
  Bell,
  Palette,
  CreditCard,
  Save,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Download,
  Moon,
  Sun,
  Laptop,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Textarea,
  Select,
  Checkbox,
  Badge,
  Avatar,
  ProgressBar,
  ConfirmDialog,
  notify,
} from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { storage } from '../../services/storage';

const ACCENT_COLORS = [
  { name: 'Indigo', color: '#6366f1' },
  { name: 'Violet', color: '#8b5cf6' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Amber', color: '#f59e0b' },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form state
  const [name, setName] = useState(user?.name || 'Alex Morgan');
  const [email, setEmail] = useState(user?.email || 'demo@taskflow.com');
  const [bio, setBio] = useState(user?.bio || 'Product manager and engineering lead.');
  const [role, setRole] = useState(user?.role || 'Product Lead');

  // Account Form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Workspace state
  const [workspaceName, setWorkspaceName] = useState('Acme Product Studio');
  const [workspaceSlug, setWorkspaceSlug] = useState('acme-studio');

  // Appearance state
  const [themeMode, setThemeMode] = useState(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [selectedAccent, setSelectedAccent] = useState('#6366f1');
  const [density, setDensity] = useState('comfortable');

  // Notifications state
  const [notifPreferences, setNotifPreferences] = useState({
    assigned: true,
    mentioned: true,
    completed: true,
    weeklyDigest: false,
    securityAlerts: true,
  });

  // Confirm Reset Modal state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    notify.success('Profile preferences updated!');
  };

  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!newPass || newPass !== confirmPass) {
      notify.error('New passwords do not match');
      return;
    }
    notify.success('Password changed successfully!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleResetData = () => {
    storage.clearAll();
    notify.success('Demo data reset to factory default!');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleThemeChange = (mode) => {
    setThemeMode(mode);
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    notify.info(`Appearance theme set to ${mode}`);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account Security', icon: Shield },
    { id: 'workspace', label: 'Workspace', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'billing', label: 'Billing & Plans', icon: CreditCard },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
          Preferences & Settings
        </h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Manage your personal account, team workspace, notifications, and subscription plan.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-soft dark:bg-brand-500'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/60'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROFILE */}
      {activeTab === 'profile' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Personal Information
            </h3>
            <p className="text-xs text-slate-400">Public profile details displayed across projects</p>
          </div>

          <div className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
            <Avatar name={name} src={user?.avatar} size="xl" />
            <div className="space-y-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => notify.info('Avatar photo picker opened')}
              >
                Change Avatar
              </Button>
              <p className="text-[11px] text-slate-400">JPG, GIF or PNG. Max 2MB.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Job Title / Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Textarea
              label="Bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />

            <Button type="submit" variant="primary" size="md" leftIcon={Save}>
              Save Changes
            </Button>
          </form>
        </Card>
      )}

      {/* TAB 2: ACCOUNT SECURITY */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Change Password
              </h3>
              <p className="text-xs text-slate-400">Update your login security credentials</p>
            </div>

            <form onSubmit={handleSavePassword} className="space-y-4 max-w-md">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
              />
              <Input
                label="New Password"
                type="password"
                placeholder="At least 8 characters"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <Button type="submit" variant="primary" size="md">
                Update Password
              </Button>
            </form>
          </Card>

          {/* Danger Zone */}
          <Card className="p-6 border-rose-200 dark:border-rose-900/60 bg-rose-50/20 space-y-4">
            <div>
              <h3 className="text-sm font-bold text-rose-600 dark:text-rose-400">
                Danger Zone
              </h3>
              <p className="text-xs text-slate-500">
                Permanently delete your account and personal preferences.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => alert('Account deletion is locked for demo accounts.')}
            >
              Delete Account
            </Button>
          </Card>
        </div>
      )}

      {/* TAB 3: WORKSPACE */}
      {activeTab === 'workspace' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workspace Configuration
            </h3>
            <p className="text-xs text-slate-400">Manage organization name, URL, and demo state</p>
          </div>

          <div className="space-y-4 max-w-lg">
            <Input
              label="Workspace Name"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                Workspace URL
              </label>
              <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                <span>taskflow.app/</span>
                <span className="font-semibold text-brand-600">{workspaceSlug}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => notify.success('Workspace settings updated!')}
            >
              Save Workspace
            </Button>
          </div>

          {/* Reset Demo Data */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Data Persistence & Reset
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              TaskFlow stores all tasks, projects, columns, and activities in your browser's localStorage. You can reset everything to the original seed data at any time.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              leftIcon={RotateCcw}
            >
              Reset Demo Data to Initial State
            </Button>
          </div>
        </Card>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Notification Preferences
            </h3>
            <p className="text-xs text-slate-400">Control when and how you receive alerts</p>
          </div>

          <div className="space-y-4 max-w-lg">
            <Checkbox
              label="Task Assignments"
              description="Email me whenever a colleague assigns me to a deliverable"
              checked={notifPreferences.assigned}
              onChange={(e) => setNotifPreferences({ ...notifPreferences, assigned: e.target.checked })}
            />
            <Checkbox
              label="@Mentions in Discussions"
              description="Notify me when someone mentions my handle in task comments"
              checked={notifPreferences.mentioned}
              onChange={(e) => setNotifPreferences({ ...notifPreferences, mentioned: e.target.checked })}
            />
            <Checkbox
              label="Deliverable Status Changes"
              description="Alert me when tasks I created are completed or marked In Review"
              checked={notifPreferences.completed}
              onChange={(e) => setNotifPreferences({ ...notifPreferences, completed: e.target.checked })}
            />
            <Checkbox
              label="Weekly Sprint Digest"
              description="Summary email every Monday morning with team throughput and upcoming deadlines"
              checked={notifPreferences.weeklyDigest}
              onChange={(e) => setNotifPreferences({ ...notifPreferences, weeklyDigest: e.target.checked })}
            />
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => notify.success('Notification preferences saved!')}
          >
            Save Preferences
          </Button>
        </Card>
      )}

      {/* TAB 5: APPEARANCE */}
      {activeTab === 'appearance' && (
        <Card className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Interface Theme & Branding
            </h3>
            <p className="text-xs text-slate-400">Customize the visual styling of TaskFlow</p>
          </div>

          {/* Theme switcher */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  themeMode === 'light'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                <Sun className="h-4 w-4" /> Light
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                  themeMode === 'dark'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300 ring-2 ring-brand-500/20'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600'
                }`}
              >
                <Moon className="h-4 w-4" /> Dark
              </button>

              <button
                type="button"
                onClick={() => handleThemeChange('light')}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-slate-600"
              >
                <Laptop className="h-4 w-4" /> System
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Primary Accent Color
            </label>
            <div className="flex items-center gap-3">
              {ACCENT_COLORS.map((acc) => (
                <button
                  key={acc.name}
                  type="button"
                  onClick={() => setSelectedAccent(acc.color)}
                  className={`h-8 w-8 rounded-full transition-transform ${
                    selectedAccent === acc.color ? 'scale-125 ring-2 ring-offset-2 ring-brand-500' : ''
                  }`}
                  style={{ backgroundColor: acc.color }}
                  title={acc.name}
                />
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* TAB 6: BILLING & PLANS */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">Current Subscription</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                  Pro Team Plan
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">$12 / user / month &bull; Billed annually</p>
              </div>
              <Badge variant="success" size="md">Active</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Team Seats</span>
                  <span className="font-bold">6 / 15</span>
                </div>
                <ProgressBar value={40} size="xs" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Storage Used</span>
                  <span className="font-bold">2.4 GB / 100 GB</span>
                </div>
                <ProgressBar value={3} size="xs" />
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Active Projects</span>
                  <span className="font-bold">3 / Unlimited</span>
                </div>
                <ProgressBar value={20} size="xs" />
              </div>
            </div>
          </Card>

          {/* Invoices History Table */}
          <Card className="overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Billing History & Invoices
              </h4>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {[
                { id: 'INV-2026-001', date: 'Nov 01, 2026', amount: '$72.00', status: 'Paid' },
                { id: 'INV-2026-002', date: 'Oct 01, 2026', amount: '$72.00', status: 'Paid' },
                { id: 'INV-2026-003', date: 'Sep 01, 2026', amount: '$72.00', status: 'Paid' },
              ].map((inv) => (
                <div key={inv.id} className="p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{inv.id}</span>
                    <span className="text-slate-400">{inv.date}</span>
                    <span className="font-bold text-slate-900 dark:text-white">{inv.amount}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success" size="sm">{inv.status}</Badge>
                    <button
                      type="button"
                      onClick={() => notify.info(`Downloaded invoice ${inv.id}`)}
                      className="text-slate-400 hover:text-brand-600"
                      title="Download receipt"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Reset demo data?"
        message="This will clear your browser's localStorage and restore the original 3 projects, 25+ tasks, and team seed data. Any customized tasks will be replaced."
        confirmLabel="Reset Everything"
      />
    </div>
  );
}
