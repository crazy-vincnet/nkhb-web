import { useEffect, RefObject } from 'react';

/**
 * Shared accessibility + UX behavior for modal dialogs:
 *  - locks body scroll while the modal is open (prevents background scroll on mobile)
 *  - closes on Escape
 *  - traps Tab focus inside the dialog and focuses the first field on open
 *
 * Must be called unconditionally (before any early `return null`) so hook order
 * stays stable. It no-ops while `isOpen` is false.
 */
export function useModalBehavior(
    isOpen: boolean,
    onClose: () => void,
    containerRef: RefObject<HTMLElement>
) {
    useEffect(() => {
        if (!isOpen) return;

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const focusableSelector =
            'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])';

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
                return;
            }
            if (e.key === 'Tab' && containerRef.current) {
                const focusables = Array.from(
                    containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
                ).filter((el) => el.offsetParent !== null);
                if (focusables.length === 0) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus the first meaningful control once the dialog has mounted.
        const focusTarget = containerRef.current?.querySelector<HTMLElement>(
            'input:not([disabled]), textarea, select, button:not([disabled]), a[href]'
        );
        focusTarget?.focus();

        return () => {
            document.body.style.overflow = prevOverflow;
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose, containerRef]);
}
