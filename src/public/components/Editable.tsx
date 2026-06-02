import React, { useRef, useEffect } from 'react';
import { useI18n } from '../lib/i18n';

interface EditableProps {
  k: string;
  children: (data: { text: string; styles: React.CSSProperties; link?: string; order?: any[]; items?: any[] }) => React.ReactElement;
  className?: string;
  as?: string | React.ComponentType<any>;
  headless?: boolean;
}

/**
 * Helper to convert rgb(a) color to hex
 */
const rgbaToHex = (rgba: string) => {
  if (!rgba) return '';
  const match = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
  if (!match) return rgba;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  const hex = "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return hex;
};

/**
 * A wrapper component that makes an element selectable in the Admin Visual Editor.
 * Refactored to use direct prop injection for cleaner layouts.
 */
export const Editable: React.FC<EditableProps> = ({ k, children, className = '', as, headless = false }) => {
  const { getContent } = useI18n();
  const data = getContent(k);
  const elementRef = useRef<HTMLElement>(null);
  
  // Detect if we are inside an iframe (preview mode)
  const isPreview = window.self !== window.top;

  // Global click interceptor for preview mode
  useEffect(() => {
    if (!isPreview) return;

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isLink = target.closest('a') || target.tagName === 'A';
      const isButton = target.closest('button') || target.tagName === 'BUTTON';

      if (isLink || isButton) {
        e.preventDefault();
      }
    };

    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, [isPreview]);

  const handleClick = (e: React.MouseEvent) => {
    if (isPreview) {
      e.preventDefault();
      e.stopPropagation();

      let computedStyles = {};
      let currentLink = data.link;

      // Extract real-time computed styles and link from DOM
      // We try to find the actual element or its child
      const el = elementRef.current;
      if (el) {
        const targetEl = (el.getAttribute('data-editable-key') ? el : el.firstElementChild) as HTMLElement || el;
        const style = window.getComputedStyle(targetEl);
        
        // Extract background image URL if present
        let bgImage = style.backgroundImage;
        if (bgImage && bgImage !== 'none') {
            const match = bgImage.match(/url\(["']?([^"']+)["']?\)/);
            if (match) bgImage = match[1];
            else bgImage = '';
        } else {
            bgImage = '';
        }

        computedStyles = {
          fontSize: style.fontSize,
          color: rgbaToHex(style.color),
          backgroundColor: style.backgroundColor === 'rgba(0, 0, 0, 0)' ? '' : rgbaToHex(style.backgroundColor),
          backgroundImage: bgImage,
          margin: style.margin,
          padding: style.padding,
          fontWeight: style.fontWeight,
          borderRadius: style.borderRadius,
          borderWidth: style.borderWidth,
          borderColor: rgbaToHex(style.borderColor)
        };

        if (!currentLink) {
            // Priority: Explicit link > IMG src > Background Image > Found Anchor
            const findAsset = (node: HTMLElement): string | null => {
                // 1. Check if it's an image
                if (node.tagName === 'IMG') return (node as HTMLImageElement).src;
                
                // 2. Check for background image
                const style = window.getComputedStyle(node);
                const bg = style.backgroundImage;
                if (bg && bg !== 'none') {
                    const match = bg.match(/url\(["']?([^"']+)["']?\)/);
                    if (match) return match[1];
                }

                // 3. Check for link
                if (node.tagName === 'A') return node.getAttribute('href');

                // 4. Recurse children
                for (const child of Array.from(node.children)) {
                    const found = findAsset(child as HTMLElement);
                    if (found) return found;
                }
                return null;
            };
            const foundUrl = findAsset(targetEl);
            if (foundUrl) currentLink = foundUrl;
        }

        window.parent.postMessage({ 
            type: 'NKHB_ELEMENT_SELECTED', 
            key: k,
            computedStyles,
            link: currentLink,
            innerText: targetEl.innerText || ''
        }, '*');
      }
    }
  };

  const editProps: any = {
    ref: elementRef,
    'data-editable-key': k
  };

  if (isPreview) {
    editProps.onClick = handleClick;
    editProps.className = `${className} cursor-pointer hover:outline hover:outline-2 hover:outline-blue-500 hover:outline-offset-[-4px] transition-all relative`;

    // Ensure large containers have higher priority for empty-space clicks
    if (k.startsWith('section')) {
        editProps.style = { 
            cursor: 'cell',
            position: 'relative',
            zIndex: 1 // Ensure the section can receive clicks on its own background
        };
    }
  }
 else {
    editProps.className = className;
  }

  const child = children(data);

  if (headless) {
    // Inject props directly into the child element to avoid wrapper issues
    return React.cloneElement(child, {
        ...editProps,
        // Merge class names if the child already has one
        className: `${child.props.className || ''} ${editProps.className || ''}`.trim(),
        // Prioritize explicit styles from child but allow injection
        style: { ...child.props.style, ...editProps.style }
    });
  }

  const Component = (as || 'div') as any;
  return (
    <Component {...editProps}>
      {child}
    </Component>
  );
};
