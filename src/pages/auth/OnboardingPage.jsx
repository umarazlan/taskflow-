import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  Kanban,
  Building,
  FolderKanban,
  Users,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Mail,
  Zap,
} from 'lucide-react';
import { Button, Input, Select, Card, Badge, ProgressBar } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const EMOJI_OPTIONS = ['⚡', '🚀', '🎯', '💡', '🔥', '🛠️', '✨', '🪐'];
const COLOR_OPTIONS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#f59e0b', // Amber
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, completeOnboarding } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [workspaceData, setWorkspaceData] = useState({
    name: 'Acme Studio',
    slug: 'acme-studio',
    size: '6-25',
    emoji: '⚡',
  });

  const [projectData, setProjectData] = useState({
    name: 'Q4 Product Roadmap',
    color: '#6366f1',
    template: 'kanban',
  });

  const [inviteEmails, setInviteEmails] = useState([
    { email: 'sarah.c@company.com', role: 'Member' },
    { email: 'marcus.j@company.com', role: 'Member' },
  ]);

  const addInviteField = () => {
    setInviteEmails([...inviteEmails, { email: '', role: 'Member' }]);
  };

  const removeInviteField = (index) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateInvite = (index, field, value) => {
    const updated = [...inviteEmails];
    updated[index][field] = value;
    setInviteEmails(updated);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      // Fire confetti celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      await completeOnboarding({
        workspace: workspaceData,
        project: projectData,
        invitedMembers: inviteEmails.filter((i) => i.email.trim() !== ''),
      });

      setTimeout(() => {
        navigate('/app/dashboard');
      }, 800);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        {/* Logo and Progress */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="h-9 w-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-soft">
              <Kanban className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">TaskFlow Setup</span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, {user?.name || 'there'}! Let's get your collaborative workspace configured.
          </p>

          {/* Stepper pills */}
          <div className="mt-6 flex items-center justify-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 1 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${currentStep > 1 ? 'bg-emerald-500 text-white' : currentStep === 1 ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                {currentStep > 1 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : '1'}
              </span>
              <span>Workspace</span>
            </div>
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 2 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${currentStep > 2 ? 'bg-emerald-500 text-white' : currentStep === 2 ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                {currentStep > 2 ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : '2'}
              </span>
              <span>First Project</span>
            </div>
            <div className="w-8 h-px bg-slate-200 dark:bg-slate-800" />

            <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep === 3 ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] ${currentStep === 3 ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800'}`}>
                3
              </span>
              <span>Invite Team</span>
            </div>
          </div>
        </div>

        {/* Wizard Card Container */}
        <Card className="p-8 shadow-soft-xl border-slate-200/90 dark:border-slate-800">
          {/* STEP 1: CREATE WORKSPACE */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-scaleIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Name your workspace
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  This is typically your company name, agency, or department.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Workspace Name"
                  placeholder="e.g. Acme Studio"
                  leftIcon={Building}
                  value={workspaceData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                    setWorkspaceData({ ...workspaceData, name, slug });
                  }}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
                    Workspace URL
                  </label>
                  <div className="flex items-center rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-400">
                    <span className="text-slate-400">taskflow.app/</span>
                    <span className="font-semibold text-brand-600 dark:text-brand-400">{workspaceData.slug || 'workspace'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Choose Icon
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setWorkspaceData({ ...workspaceData, emoji })}
                        className={`h-10 w-10 text-lg rounded-xl border flex items-center justify-center transition-all ${
                          workspaceData.emoji === emoji
                            ? 'border-brand-600 bg-brand-50 shadow-subtle ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-brand-950'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <Select
                  label="Team Size"
                  value={workspaceData.size}
                  onChange={(e) => setWorkspaceData({ ...workspaceData, size: e.target.value })}
                  options={[
                    { label: 'Just me (1 person)', value: '1' },
                    { label: 'Small Squad (2 - 5 people)', value: '2-5' },
                    { label: 'Medium Team (6 - 25 people)', value: '6-25' },
                    { label: 'Large Department (26 - 100 people)', value: '26-100' },
                    { label: 'Enterprise (100+ people)', value: '100+' },
                  ]}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={ArrowRight}
                  onClick={() => setCurrentStep(2)}
                >
                  Continue to Project Setup
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: CREATE FIRST PROJECT */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-scaleIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Create your first project
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Projects group tasks, track milestones, and keep deliverables on schedule.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Project Name"
                  placeholder="e.g. Website Redesign, Mobile App v2"
                  leftIcon={FolderKanban}
                  value={projectData.name}
                  onChange={(e) => setProjectData({ ...projectData, name: e.target.value })}
                  required
                />

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Project Color Badge
                  </label>
                  <div className="flex items-center gap-3">
                    {COLOR_OPTIONS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setProjectData({ ...projectData, color })}
                        className={`h-7 w-7 rounded-full transition-transform ${
                          projectData.color === color
                            ? 'scale-125 ring-2 ring-offset-2 ring-brand-500 dark:ring-offset-slate-900'
                            : 'hover:scale-110'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-2">
                    Default Workflow Template
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'kanban', title: 'Kanban Board', desc: 'Backlog, In Progress, Review, Done' },
                      { id: 'scrum', title: 'Sprint Sprints', desc: 'Points, cycles, and burndown charts' },
                      { id: 'roadmap', title: 'Roadmap', desc: 'Milestones and release timelines' },
                    ].map((tpl) => (
                      <div
                        key={tpl.id}
                        onClick={() => setProjectData({ ...projectData, template: tpl.id })}
                        className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                          projectData.template === tpl.id
                            ? 'border-brand-600 bg-brand-50/60 ring-2 ring-brand-500/20 dark:border-brand-500 dark:bg-brand-950/40'
                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{tpl.title}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{tpl.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="md"
                  leftIcon={ArrowLeft}
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  rightIcon={ArrowRight}
                  onClick={() => setCurrentStep(3)}
                >
                  Continue to Teammates
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: INVITE TEAMMATES */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-scaleIn">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Invite your collaborators
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Product building is best done together. You can always add more people later.
                </p>
              </div>

              <div className="space-y-3">
                {inviteEmails.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <Input
                        type="email"
                        placeholder="colleague@company.com"
                        leftIcon={Mail}
                        value={item.email}
                        onChange={(e) => updateInvite(index, 'email', e.target.value)}
                      />
                    </div>
                    <div className="w-32">
                      <Select
                        value={item.role}
                        onChange={(e) => updateInvite(index, 'role', e.target.value)}
                        options={['Admin', 'Member', 'Viewer']}
                      />
                    </div>
                    {inviteEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInviteField(index)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        aria-label="Remove teammate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addInviteField}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 dark:text-brand-400 pt-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add another teammate
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={handleFinish}
                  disabled={isSubmitting}
                >
                  Skip for now
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setCurrentStep(2)}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleFinish}
                    isLoading={isSubmitting}
                    rightIcon={Sparkles}
                  >
                    Finish & Launch App
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
