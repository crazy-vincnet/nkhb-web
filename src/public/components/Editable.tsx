import React from 'react';
import { useI18n } from '../lib/i18n';

interface EditableProps {
  k: string;
  children: (data: { text: string; styles: React.CSSProperties; link?: string }) => React.ReactNode;
  className?: string;
  as?: string | React.ComponentType<any>;
  headless?: boolean;
}

/**
 * A wrapper component that makes an element selectable in the Admin Visual Editor.
 * Headless mode provides editability without adding an extra DOM node.
 */
export const Editable: React.FC<EditableProps> = ({ k, children, className = '', as, headless = false }) => {
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

  const editProps = isPreview ? {
    onClick: handleClick,
    className: `${className} cursor-pointer hover:outline hover:outline-2 hover:outline-blue-400 hover:outline-offset-2 transition-all`,
    'data-editable-key': k
  } : {
    className,
    'data-editable-key': k
  };

  if (headless) {
    return (
      <span {...editProps} style={{ display: 'contents' }}>
        {children(data)}
      </span>
    );
  }

  const Component = (as || 'div') as any;

  return (
    <Component {...editProps}>
      {children(data)}
    </Component>
  );
};
