import { useEffect, type RefObject } from 'react';

export const useKeyboardShortcuts = (
    inputRef: RefObject<HTMLInputElement | null>,
    clearSearch: () => void
) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/') {
                e.preventDefault();
                clearSearch();
                inputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [inputRef, clearSearch]);
};
