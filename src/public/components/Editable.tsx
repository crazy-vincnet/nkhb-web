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

      // Extract real-time computed styles and link from DOM
      if (elementRef.current) {
        const el = elementRef.current;
        const targetEl = el.firstElementChild || el;
        const style = window.getComputedStyle(targetEl);
        
        computedStyles = {
          fontSize: style.fontSize,
          color: style.color,
          backgroundColor: style.backgroundColor === 'rgba(0, 0, 0, 0)' ? '' : style.backgroundColor,
          margin: style.margin,
          padding: style.padding,
          fontWeight: style.fontWeight
        };

        // Deep search for link: check self, then all children
        if (!currentLink) {
            const findLink = (node: HTMLElement): string | null => {
                if (node.tagName === 'A') return node.getAttribute('href');
                if (node.tagName === 'BUTTON' && node.onclick) return 'JS_ACTION'; // Mark as action if not a standard link
                
                for (let child of Array.from(node.children)) {
                    const found = findLink(child as HTMLElement);
                    if (found) return found;
                }
                return null;
            };
            currentLink = findLink(el) || '';
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
