import React from 'react';
import { useI18n } from '../lib/i18n';

interface EditableProps {
  k: string;
  children: (data: { text: string; styles: React.CSSProperties; link?: string }) => React.ReactNode;
  className?: string;
  as?: string;
}

/**
 * A wrapper component that makes an element selectable in the Admin Visual Editor.
 */
export const Editable: React.FC<EditableProps> = ({ k, children, className = '', as = 'div' }) => {
  const { getContent } = useI18n();
  const data = getContent(k);
  
  // Detect if we are inside an iframe (preview mode)
  const isPreview = window.self !== window.top;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: 'NKHB_ELEMENT_SELECTED', key: k }, '*');
    }
  };

  const Component = as as any;

  return (
    <Component 
      className={`relative ${className} ${isPreview ? 'cursor-pointer hover:ring-2 hover:ring-blue-400 hover:ring-offset-2 transition-all' : ''}`}
      onClick={handleClick}
      data-editable-key={k}
    >
      {children(data)}
    </Component>
  );
};
