import React, { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/shared/utils/utils';
import { RoyalIcon, RoyalIconProps } from './RoyalIcon';
import { UserPreferencesContext, useUserPreferences, UserPreferences } from './useUserPreferences';

const defaultPreferences: UserPreferences = {
  theme: 'auto',
  animations: true,
  sounds: false,
  haptics: true,
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  language: 'en',
};



export const UserPreferencesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem('user-preferences');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences({ ...defaultPreferences, ...parsed });
      } catch (error) {
        // Failed to parse saved preferences - use defaults
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('user-preferences', JSON.stringify(preferences));
  }, [preferences]);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, updatePreference, resetPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

interface PreferenceToggleProps {
  preference: keyof UserPreferences;
  label: string;
  description?: string;
  icon?: RoyalIconProps['variant'];
}

export const PreferenceToggle: React.FC<PreferenceToggleProps> = ({ 
  preference, 
  label, 
  description, 
  icon 
}) => {
  const { preferences, updatePreference } = useUserPreferences();
  const value = preferences[preference] as boolean;

  return (
    <div className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-lg border border-border-primary">
      <div className="flex items-center gap-3">
        {icon && <RoyalIcon variant={icon} size={20} className="text-accent-primary" />}
        <div>
          <label className="text-text-primary font-medium">{label}</label>
          {description && (
            <p className="text-text-secondary text-sm">{description}</p>
          )}
        </div>
      </div>
      <button
        onClick={() => updatePreference(preference as keyof UserPreferences, !value)}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary",
          value ? "bg-accent-primary" : "bg-background-secondary"
        )}
        role="switch"
        aria-checked={value}
        aria-label={label}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            value ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
};

interface PreferenceSelectProps {
  preference: keyof UserPreferences;
  label: string;
  options: Array<{ value: string; label: string }>;
  icon?: RoyalIconProps['variant'];
}

export const PreferenceSelect: React.FC<PreferenceSelectProps> = ({ 
  preference, 
  label, 
  options, 
  icon 
}) => {
  const { preferences, updatePreference } = useUserPreferences();
  const value = preferences[preference] as string;

  return (
    <div className="flex items-center justify-between p-4 bg-background-secondary/50 rounded-lg border border-border-primary">
      <div className="flex items-center gap-3">
        {icon && <RoyalIcon variant={icon} size={20} className="text-accent-primary" />}
        <label className="text-text-primary font-medium">{label}</label>
      </div>
      <select
        value={value}
        onChange={(e) => updatePreference(preference as keyof UserPreferences, e.target.value)}
        className="bg-background-primary border border-border-primary text-text-primary rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export const UserPreferencesPanel: React.FC = () => {
  const { resetPreferences } = useUserPreferences();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 bg-accent-primary text-black p-3 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
        aria-label="User Preferences"
      >
        <RoyalIcon variant="settings" size={24} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background-primary border border-border-primary rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-border-primary">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-text-primary">User Preferences</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Close preferences"
                >
                  <RoyalIcon variant="close" size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <PreferenceToggle
                preference="animations"
                label="Enable Animations"
                description="Smooth transitions and visual effects"
                icon="animation"
              />

              <PreferenceToggle
                preference="sounds"
                label="Sound Effects"
                description="Audio feedback for interactions"
                icon="sound"
              />

              <PreferenceToggle
                preference="haptics"
                label="Haptic Feedback"
                description="Vibration on mobile devices"
                icon="vibration"
              />

              <PreferenceToggle
                preference="highContrast"
                label="High Contrast Mode"
                description="Enhanced visibility"
                icon="contrast"
              />

              <PreferenceToggle
                preference="reducedMotion"
                label="Reduced Motion"
                description="Minimize animations for accessibility"
                icon="accessibility"
              />

              <PreferenceSelect
                preference="fontSize"
                label="Font Size"
                icon="text"
                options={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
              />

              <div className="pt-4 border-t border-border-primary">
                <button
                  onClick={resetPreferences}
                  className="w-full bg-background-secondary text-text-primary py-2 px-4 rounded-lg hover:bg-background-secondary/80 transition-colors"
                >
                  Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};