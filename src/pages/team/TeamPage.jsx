import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  LayoutGrid,
  List as ListIcon,
  Mail,
  Shield,
  MoreVertical,
  Trash2,
  Clock,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  Card,
  Button,
  Input,
  Select,
  Badge,
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownDivider,
  ConfirmDialog,
  notify,
} from '../../components/ui';
import { INITIAL_USERS } from '../../data/seedData';
import { InviteMemberModal } from './InviteMemberModal';

const roleBadges = {
  Owner: 'purple',
  Admin: 'primary',
  Member: 'info',
  Viewer: 'default',
};

const initialPending = [
  { id: 'inv-1', email: 'jordan.lee@company.com', role: 'Member', sentAt: '1 day ago' },
  { id: 'inv-2', email: 'taylor.swift@company.com', role: 'Viewer', sentAt: '3 days ago' },
];

export default function TeamPage() {
  const [members, setMembers] = useState(
    INITIAL_USERS.map((u, i) => ({
      ...u,
      roleBadge: i === 0 ? 'Owner' : i === 1 ? 'Admin' : 'Member',
      workload: [8, 6, 9, 5, 4, 7][i % 6],
      status: ['online', 'online', 'busy', 'away', 'offline', 'online'][i % 6],
    }))
  );

  const [pendingInvites, setPendingInvites] = useState(initialPending);
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const handleInvite = ({ email, role }) => {
    const newInvite = {
      id: `inv-${Date.now()}`,
      email,
      role,
      sentAt: 'Just now',
    };
    setPendingInvites([newInvite, ...pendingInvites]);
    notify.success(`Invitation sent to ${email}!`);
  };

  const handleResendInvite = (email) => {
    notify.info(`Resent invitation email to ${email}`);
  };

  const handleRevokeInvite = (id) => {
    setPendingInvites(pendingInvites.filter((inv) => inv.id !== id));
    notify.info('Invitation revoked');
  };

  const handleChangeRole = (memberId, newRole) => {
    setMembers(
      members.map((m) => (m.id === memberId ? { ...m, roleBadge: newRole } : m))
    );
    notify.success(`Role updated to ${newRole}`);
  };

  const handleRemoveMember = () => {
    if (!deleteTargetId) return;
    setMembers(members.filter((m) => m.id !== deleteTargetId));
    notify.success('Member removed from workspace');
    setDeleteTargetId(null);
  };

  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || m.roleBadge === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Team Directory & Roles
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Manage teammates, adjust permission roles, and review individual workload allocation.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={UserPlus}
          onClick={() => setIsInviteModalOpen(true)}
        >
          Invite Member
        </Button>
      </div>

      {/* 2. Controls Toolbar */}
      <Card className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search team by name or role..."
            leftIcon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="w-36">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Owner', value: 'Owner' },
                { label: 'Admin', value: 'Admin' },
                { label: 'Member', value: 'Member' },
                { label: 'Viewer', value: 'Viewer' },
              ]}
            />
          </div>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-subtle'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
              }`}
            >
              <ListIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* 3. Members Roster */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="p-5 space-y-4 hover:shadow-soft-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={member.name}
                    src={member.avatar}
                    size="lg"
                    presence={member.status}
                  />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      {member.name}
                    </h3>
                    <p className="text-[11px] text-slate-400">{member.role}</p>
                  </div>
                </div>

                <Dropdown
                  align="right"
                  trigger={
                    <button type="button" className="p-1 text-slate-400 hover:text-slate-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  }
                >
                  <DropdownItem onClick={() => handleChangeRole(member.id, 'Admin')}>
                    Set as Admin
                  </DropdownItem>
                  <DropdownItem onClick={() => handleChangeRole(member.id, 'Member')}>
                    Set as Member
                  </DropdownItem>
                  <DropdownItem onClick={() => handleChangeRole(member.id, 'Viewer')}>
                    Set as Viewer
                  </DropdownItem>
                  {member.roleBadge !== 'Owner' && (
                    <>
                      <DropdownDivider />
                      <DropdownItem
                        icon={Trash2}
                        danger
                        onClick={() => setDeleteTargetId(member.id)}
                      >
                        Remove Member
                      </DropdownItem>
                    </>
                  )}
                </Dropdown>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {member.bio || 'Product team collaborator.'}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                <Badge variant={roleBadges[member.roleBadge] || 'default'} size="sm">
                  {member.roleBadge}
                </Badge>
                <span className="text-slate-400 text-[11px]">
                  {member.workload} active tasks
                </span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card className="overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3.5">Member</th>
                <th className="p-3.5">Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Workload</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="p-3.5 flex items-center gap-3">
                    <Avatar name={member.name} src={member.avatar} size="sm" presence={member.status} />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{member.name}</p>
                      <p className="text-[11px] text-slate-400">{member.role}</p>
                    </div>
                  </td>
                  <td className="p-3.5 text-slate-500">{member.email}</td>
                  <td className="p-3.5">
                    <Badge variant={roleBadges[member.roleBadge] || 'default'} size="sm">
                      {member.roleBadge}
                    </Badge>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    {member.workload} tasks
                  </td>
                  <td className="p-3.5 text-right">
                    {member.roleBadge !== 'Owner' && (
                      <button
                        type="button"
                        onClick={() => setDeleteTargetId(member.id)}
                        className="p-1 text-slate-400 hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* 4. Pending Invitations Section */}
      {pendingInvites.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Pending Invitations
            </h3>
            <Badge variant="warning" size="sm">{pendingInvites.length}</Badge>
          </div>

          <Card className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
            {pendingInvites.map((inv) => (
              <div
                key={inv.id}
                className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 flex items-center justify-center">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{inv.email}</p>
                    <p className="text-[10px] text-slate-400">Invited as {inv.role} &bull; {inv.sentAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleResendInvite(inv.email)}
                    leftIcon={RotateCcw}
                  >
                    Resend
                  </Button>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => handleRevokeInvite(inv.id)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Invite Member Modal */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />

      {/* Remove Member Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleRemoveMember}
        title="Remove team member?"
        message="This user will immediately lose access to all projects, tasks, and private notes in this workspace."
        confirmLabel="Remove User"
      />
    </div>
  );
}
