import React, { useState, useCallback } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  Button, 
  Input, 
  RoyalIcon, 
  useToast 
} from '@/components/ui';
import { validateDisplayName, validateMessage, validateUrl } from '@/shared/utils/validation';

interface CustomLink {
  label: string;
  url: string;
}

interface CustomSection {
  title: string;
  content: string;
}

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: {
    walletAddress: string;
    displayName?: string;
    avatar?: string;
    message?: string;
    link?: string;
    customLinks?: CustomLink[];
    customSections?: CustomSection[];
  };
  onUpdate: (newData: { 
    displayName?: string; 
    avatar?: string;
    message?: string; 
    link?: string;
    customLinks?: CustomLink[];
    customSections?: CustomSection[];
  }) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onUpdate
}) => {
  const [displayName, setDisplayName] = useState(currentData.displayName || '');
  const [avatar, setAvatar] = useState(currentData.avatar || '');
  const [message, setMessage] = useState(currentData.message || '');
  const [link, setLink] = useState(currentData.link || '');
  const [customLinks, setCustomLinks] = useState<CustomLink[]>(currentData.customLinks || []);
  const [customSections, setCustomSections] = useState<CustomSection[]>(currentData.customSections || []);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const { addToast } = useToast();

  const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateDisplayName(value);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, displayName: '' }));
      setDisplayName(validation.sanitized || value);
    } else {
      setErrors(prev => ({ ...prev, displayName: validation.error || 'Invalid display name' }));
      setDisplayName(value);
    }
  }, []);

  const handleMessageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateMessage(value, 50);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, message: '' }));
      setMessage(validation.sanitized || value);
    } else {
      setErrors(prev => ({ ...prev, message: validation.error || 'Invalid message' }));
      setMessage(value);
    }
  }, []);

  const handleLinkChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const validation = validateUrl(value);
    
    if (validation.isValid) {
      setErrors(prev => ({ ...prev, link: '' }));
      setLink(validation.sanitized || value);
    } else {
      setErrors(prev => ({ ...prev, link: validation.error || 'Invalid URL' }));
      setLink(value);
    }
  }, []);

  // Custom Links Management
  const addCustomLink = () => {
    if (customLinks.length >= 5) {
      addToast({ type: 'error', title: 'Limit Reached', description: 'Maximum 5 links allowed' });
      return;
    }
    setCustomLinks([...customLinks, { label: '', url: '' }]);
  };

  const removeCustomLink = (index: number) => {
    setCustomLinks(customLinks.filter((_, i) => i !== index));
  };

  const updateCustomLink = (index: number, field: keyof CustomLink, value: string) => {
    const newLinks = [...customLinks];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setCustomLinks(newLinks);
  };

  // Custom Sections Management
  const addCustomSection = () => {
    if (customSections.length >= 3) {
      addToast({ type: 'error', title: 'Limit Reached', description: 'Maximum 3 sections allowed' });
      return;
    }
    setCustomSections([...customSections, { title: '', content: '' }]);
  };

  const removeCustomSection = (index: number) => {
    setCustomSections(customSections.filter((_, i) => i !== index));
  };

  const updateCustomSection = (index: number, field: keyof CustomSection, value: string) => {
    const newSections = [...customSections];
    newSections[index] = { ...newSections[index], [field]: value };
    setCustomSections(newSections);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validate all fields
    const displayNameValidation = validateDisplayName(displayName);
    const messageValidation = validateMessage(message, 50);
    const linkValidation = validateUrl(link);

    const newErrors: Record<string, string> = {};
    if (!displayNameValidation.isValid) newErrors.displayName = displayNameValidation.error || 'Invalid display name';
    if (!messageValidation.isValid) newErrors.message = messageValidation.error || 'Invalid message';
    if (link && !linkValidation.isValid) newErrors.link = linkValidation.error || 'Invalid URL';

    // Validate custom links
    const validCustomLinks = customLinks.filter(l => l.label && l.url);
    // Ideally validate URLs here too, but basic check for now

    // Validate custom sections
    const validCustomSections = customSections.filter(s => s.title && s.content);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({
        type: 'error',
        title: 'Validation Error',
        description: 'Please fix the errors before saving.'
      });
      setIsSaving(false);
      return;
    }

    try {
      await onUpdate({
        displayName,
        avatar,
        message,
        link,
        customLinks: validCustomLinks,
        customSections: validCustomSections
      });
      onClose();
    } catch (error) {
      // Error handling is done in parent
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-background-secondary border border-border-primary">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <RoyalIcon variant="edit" className="text-accent-primary" />
            Edit Profile
          </DialogTitle>
          <DialogDescription className="text-text-secondary">
            Customize your royal appearance on the leaderboard.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Display Name</label>
              <Input
                value={displayName}
                onChange={handleDisplayNameChange}
                placeholder="Enter your royal title"
                className={errors.displayName ? 'border-red-500' : ''}
              />
              {errors.displayName && <p className="text-xs text-red-500 mt-1">{errors.displayName}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Avatar URL</label>
              <Input
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://example.com/avatar.png"
              />
              <p className="text-xs text-text-muted mt-1">Direct link to an image file</p>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Status Message</label>
              <Input
                value={message}
                onChange={handleMessageChange}
                placeholder="A short proclamation (max 50 chars)"
                maxLength={50}
                className={errors.message ? 'border-red-500' : ''}
              />
              {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary mb-1 block">Primary Link</label>
              <Input
                value={link}
                onChange={handleLinkChange}
                placeholder="https://twitter.com/yourname"
                className={errors.link ? 'border-red-500' : ''}
              />
              {errors.link && <p className="text-xs text-red-500 mt-1">{errors.link}</p>}
            </div>
          </div>

          <div className="border-t border-border-primary my-4"></div>

          {/* Custom Links */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-text-secondary">Additional Links</label>
              <Button size="sm" variant="ghost" onClick={addCustomLink} disabled={customLinks.length >= 5}>
                <RoyalIcon variant="sparkles" size={14} className="mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-3">
              {customLinks.map((link, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <Input
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateCustomLink(index, 'label', e.target.value)}
                    className="w-1/3"
                  />
                  <Input
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateCustomLink(index, 'url', e.target.value)}
                    className="w-2/3"
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeCustomLink(index)} className="w-8 h-8 p-0 text-red-400 hover:text-red-300">
                    <RoyalIcon variant="close" size={16} />
                  </Button>
                </div>
              ))}
              {customLinks.length === 0 && (
                <p className="text-xs text-text-muted italic">No additional links added.</p>
              )}
            </div>
          </div>

          <div className="border-t border-border-primary my-4"></div>

          {/* Custom Sections */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <label className="text-sm font-medium text-text-secondary">Custom Sections</label>
              <Button size="sm" variant="ghost" onClick={addCustomSection} disabled={customSections.length >= 3}>
                <RoyalIcon variant="sparkles" size={14} className="mr-1" /> Add
              </Button>
            </div>
            <div className="space-y-4">
              {customSections.map((section, index) => (
                <div key={index} className="bg-background-primary/30 p-3 rounded-lg border border-border-primary relative group">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => removeCustomSection(index)} 
                    className="absolute top-2 right-2 w-8 h-8 p-0 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <RoyalIcon variant="close" size={16} />
                  </Button>
                  <div className="space-y-2">
                    <Input
                      placeholder="Section Title (e.g. About Me)"
                      value={section.title}
                      onChange={(e) => updateCustomSection(index, 'title', e.target.value)}
                      className="font-bold"
                    />
                    <textarea
                      placeholder="Content..."
                      value={section.content}
                      onChange={(e) => updateCustomSection(index, 'content', e.target.value)}
                      className="w-full min-h-[80px] p-2 rounded-md bg-background-secondary border border-border-primary text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary/50 resize-y"
                    />
                  </div>
                </div>
              ))}
              {customSections.length === 0 && (
                <p className="text-xs text-text-muted italic">No custom sections added.</p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button variant="primary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
