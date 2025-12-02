import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button, Input, RoyalIcon, useToast } from '@/components/ui';
import { databaseService } from '@/core/services/databaseService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    walletAddress: string;
    displayName?: string;
    message?: string;
    link?: string;
  };
  onUpdate: (newData: { displayName?: string; message?: string; link?: string }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onUpdate
}) => {
  const [displayName, setDisplayName] = useState(currentData.displayName || '');
  const [message, setMessage] = useState(currentData.message || '');
  const [link, setLink] = useState(currentData.link || '');
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Try to update via service (Supabase)
      await databaseService.upsertLeaderboardEntry(currentData.walletAddress, 0, {
        displayName,
        message,
        link
      });

      // Success UI
      addToast({
        type: 'success',
        title: 'Profile Updated',
        description: 'Your royal records have been inscribed.',
        duration: 3000
      });

      // Pass data back to parent to update local state immediately
      onUpdate({ displayName, message, link });
      onClose();
    } catch (error) {
      // Fallback: If service fails (e.g. no DB), we still update local state
      // and tell user it's saved locally
      addToast({
        type: 'warning',
        title: 'Local Update Only',
        description: 'Could not reach the Royal Archives. Changes saved locally.',
        duration: 4000
      });
      onUpdate({ displayName, message, link });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background-secondary border border-border-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <RoyalIcon variant="edit" className="text-accent-primary" />
            Edit Royal Profile
          </DialogTitle>
          <DialogDescription>
            Update your public appearance on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Display Name</label>
            <Input
              value={displayName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDisplayName(e.target.value)}
              placeholder="KingSolana"
              maxLength={20}
              className="bg-background-primary border-border-primary"
            />
            <p className="text-xs text-text-muted text-right">{displayName.length}/20</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Royal Decree (Message)</label>
            <Input
              value={message}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
              placeholder="Long live the king!"
              maxLength={50}
              className="bg-background-primary border-border-primary"
            />
            <p className="text-xs text-text-muted text-right">{message.length}/50</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text-secondary">Link (Optional)</label>
            <Input
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLink(e.target.value)}
              placeholder="https://twitter.com/..."
              maxLength={100}
              className="bg-background-primary border-border-primary"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} loading={isLoading}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
