import React, { useRef } from 'react';
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
 * Now extracts computed styles and link values to send to the Property Editor.
 */
export const Editable: React.FC<EditableProps> = ({ k, children, className = '', as, headless = false }) => {
  const { getContent } = useI18n();
  const data = getContent(k);
  const elementRef = useRef<HTMLElement>(null);
  
  // Detect if we are inside an iframe (preview mode)
  const isPreview = window.self !== window.top;

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();

      let computedStyles = {};
      let currentLink = data.link;

      // Extract real-time computed styles from DOM
      if (elementRef.current) {
        const el = elementRef.current;
        // If headless, the real content might be inside or the element itself is display: contents
        // We try to find the actual visible child if possible
        const targetEl = el.firstElementChild || el;
        const style = window.getComputedStyle(targetEl);
        
        computedStyles = {
          fontSize: style.fontSize,
          color: style.color,
          backgroundColor: style.backgroundColor,
          margin: style.margin,
          padding: style.padding,
          fontWeight: style.fontWeight
        };

        // Try to find link if not explicitly in data
        if (!currentLink) {
            const anchor = el.tagName === 'A' ? el : el.querySelector('a');
            if (anchor) currentLink = (anchor as HTMLAnchorElement).getAttribute('href') || '';
        }
      }

      window.parent.postMessage({ 
        type: 'NKHB_ELEMENT_SELECTED', 
        key: k,
        computedStyles,
        link: currentLink
      }, '*');
    }
  };

  const editProps = isPreview ? {
    ref: elementRef,
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
