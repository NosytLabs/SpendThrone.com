import React, { useState, useCallback, ReactNode } from 'react';
import { cn } from '@/shared/utils/utils';
import { RoyalIcon } from './RoyalIcon';

interface CopyToClipboardProps {
  text: string;
  children?: ReactNode;
  className?: string;
  successMessage?: string;
  showIcon?: boolean;
  iconPosition?: 'left' | 'right';
  onCopy?: () => void;
}

export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  className,
  successMessage = 'Copied!',
  showIcon = true,
  iconPosition = 'right',
  onCopy,
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyToClipboard = useCallback(async () => {
    if (typeof window === 'undefined') return;
    
    try {
      await window.navigator.clipboard.writeText(text);
      setIsCopied(true);
      onCopy?.();
      
      // Reset after 2 seconds
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), 2000);
    }
  }, [text, onCopy]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyToClipboard();
    }
  }, [copyToClipboard]);

  return (
    <button
      onClick={copyToClipboard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      className={cn(
        'inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-primary focus:ring-offset-2 focus:ring-offset-background-primary',
        'bg-background-secondary/50 hover:bg-background-secondary text-text-primary border border-border-primary hover:border-accent-primary/50',
        'active:scale-95 transform',
        isCopied && 'bg-success/20 border-success/50 text-success',
        className
      )}
      aria-label={isCopied ? successMessage : 'Copy to clipboard'}
      title={isCopied ? successMessage : 'Click to copy'}
      type="button"
    >
      {showIcon && iconPosition === 'left' && (
        <RoyalIcon 
          variant={isCopied ? 'check' : 'copy'} 
          size={16} 
          className={cn(
            'transition-all duration-200',
            isCopied ? 'text-success' : isHovered ? 'text-accent-primary' : 'text-text-secondary'
          )}
        />
      )}
      
      {children || (
        <span className="truncate max-w-[200px]">
          {text.length > 20 ? `${text.slice(0, 8)}...${text.slice(-8)}` : text}
        </span>
      )}
      
      {showIcon && iconPosition === 'right' && (
        <RoyalIcon 
          variant={isCopied ? 'check' : 'copy'} 
          size={16} 
          className={cn(
            'transition-all duration-200',
            isCopied ? 'text-success' : isHovered ? 'text-accent-primary' : 'text-text-secondary'
          )}
        />
      )}
    </button>
  );
};

interface CopyableTextProps {
  text: string;
  displayText?: string;
  className?: string;
  showCopyButton?: boolean;
  copyButtonClassName?: string;
}

export const CopyableText: React.FC<CopyableTextProps> = ({
  text,
  displayText,
  className,
  showCopyButton = true,
  copyButtonClassName,
}) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-text-primary font-mono text-sm">
        {displayText || (text.length > 20 ? `${text.slice(0, 8)}...${text.slice(-8)}` : text)}
      </span>
      {showCopyButton && (
        <CopyToClipboard
          text={text}
          className={copyButtonClassName}
          showIcon={true}
          iconPosition="left"
        />
      )}
    </div>
  );
};