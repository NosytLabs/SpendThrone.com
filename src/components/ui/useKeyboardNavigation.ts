import { useEffect, useCallback, useRef } from 'react';

export interface KeyboardShortcut {
  key: string;
  modifier?: 'ctrl' | 'alt' | 'shift' | 'meta';
  description: string;
  action: () => void;
  disabled?: boolean;
}

export const useKeyboardNavigation = () => {
  const shortcutsRef = useRef<KeyboardShortcut[]>([]);

  const registerShortcuts = useCallback((shortcuts: KeyboardShortcut[]) => {
    shortcutsRef.current = shortcuts;
  }, []);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    // Don't handle if user is typing in an input
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    shortcutsRef.current.forEach(shortcut => {
      if (shortcut.disabled) return;

      const keyMatches = event.key.toLowerCase() === shortcut.key.toLowerCase();
      let modifierMatches = true;

      if (shortcut.modifier) {
        switch (shortcut.modifier) {
          case 'ctrl':
            modifierMatches = event.ctrlKey || event.metaKey;
            break;
          case 'alt':
            modifierMatches = event.altKey;
            break;
          case 'shift':
            modifierMatches = event.shiftKey;
            break;
          case 'meta':
            modifierMatches = event.metaKey;
            break;
        }
      } else {
        // No modifier required, so ensure no modifiers are pressed
        modifierMatches = !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey;
      }

      if (keyMatches && modifierMatches) {
        event.preventDefault();
        shortcut.action();
      }
    });
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return { registerShortcuts };
};

// Predefined shortcut configurations
export const createGlobalShortcuts = (navigateTo: (path: string) => void): KeyboardShortcut[] => [
  {
    key: '/',
    description: 'Focus search',
    action: () => {
      const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
      if (searchInput) {
        searchInput.focus();
      }
    }
  },
  {
    key: 'h',
    modifier: 'ctrl',
    description: 'Go to home',
    action: () => navigateTo('/')
  },
  {
    key: 'l',
    modifier: 'ctrl',
    description: 'Go to leaderboard',
    action: () => navigateTo('/leaderboard')
  },
  {
    key: 'p',
    modifier: 'ctrl',
    description: 'Open payment modal',
    action: () => {
      const payButton = document.querySelector('[data-action="pay-tribute"]') as HTMLButtonElement;
      if (payButton) {
        payButton.click();
      }
    }
  },
  {
    key: 't',
    modifier: 'ctrl',
    description: 'Toggle theme',
    action: () => {
      const themeToggle = document.querySelector('[data-action="toggle-theme"]') as HTMLButtonElement;
      if (themeToggle) {
        themeToggle.click();
      }
    }
  },
  {
    key: 'Escape',
    description: 'Close modals/overlays',
    action: () => {
      const closeButtons = document.querySelectorAll('[data-action="close"]');
      const lastCloseButton = closeButtons[closeButtons.length - 1] as HTMLButtonElement;
      if (lastCloseButton) {
        lastCloseButton.click();
      }
    }
  },
  {
    key: '?',
    description: 'Show keyboard shortcuts',
    action: () => {
      // This would trigger a keyboard shortcuts modal
      // Keyboard shortcuts available
    }
  }
];

interface FocusableElement {
  isConnected: boolean;
  hasAttribute(name: string): boolean;
  focus(): void;
}

// Focus management utilities
export const useFocusManagement = () => {
  const focusableElementsRef = useRef<FocusableElement[]>([]);

  const registerFocusableElement = useCallback((element: FocusableElement | null) => {
    if (element && !focusableElementsRef.current.includes(element)) {
      focusableElementsRef.current.push(element);
    }
  }, []);

  const unregisterFocusableElement = useCallback((element: FocusableElement | null) => {
    if (element) {
      const index = focusableElementsRef.current.indexOf(element);
      if (index > -1) {
        focusableElementsRef.current.splice(index, 1);
      }
    }
  }, []);

  const focusNext = useCallback((currentElement: FocusableElement) => {
    const focusableElements = focusableElementsRef.current.filter(el => 
      el.isConnected && !el.hasAttribute('disabled') && !el.hasAttribute('hidden')
    );
    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, []);

  const focusPrevious = useCallback((currentElement: FocusableElement) => {
    const focusableElements = focusableElementsRef.current.filter(el => 
      el.isConnected && !el.hasAttribute('disabled') && !el.hasAttribute('hidden')
    );
    const currentIndex = focusableElements.indexOf(currentElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  }, []);

  return {
    registerFocusableElement,
    unregisterFocusableElement,
    focusNext,
    focusPrevious,
    getFocusableElements: () => focusableElementsRef.current
  };
};

// Trap focus within a container (useful for modals)
export const useFocusTrap = (containerRef: { current: HTMLElement | null }, isActive: boolean) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          (lastElement as HTMLElement).focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          (firstElement as HTMLElement).focus();
        }
      }
    };

    // Focus the first element
    firstElement.focus();

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
};