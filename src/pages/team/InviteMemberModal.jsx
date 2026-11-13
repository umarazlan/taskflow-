import React, { useState } from 'react';
import { Modal, Input, Select, Button, notify } from '../../components/ui';
import { Mail, Shield } from 'lucide-react';

export function InviteMemberModal({ isOpen, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Member');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      notify.error('Please enter a valid email address');
      return;
    }

    onInvite({ email: email.trim(), role });
    setEmail('');
    setRole('Member');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Team Member"
      description="Send an invitation link to collaborate on this workspace."
      footer={
        <>
          <Button variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="md" onClick={handleSubmit}>
            Send Invitation
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email Address"
          type="email"
          placeholder="colleague@company.com"
          leftIcon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />

        <Select
          label="Workspace Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          options={[
            { label: 'Admin (Manage settings & members)', value: 'Admin' },
            { label: 'Member (Create & edit deliverables)', value: 'Member' },
            { label: 'Viewer (Read-only access)', value: 'Viewer' },
          ]}
        />
      </form>
    </Modal>
  );
}
