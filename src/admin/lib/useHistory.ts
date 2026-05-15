import { useState, useCallback } from 'react';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

export function useHistory<T>(initialState: T) {
  const [state, setState] = useState<HistoryState<T>>({
    past: [],
    present: initialState,
    future: []
  });

  const push = useCallback((newPresent: T) => {
    setState(prev => {
      // Duplicate prevention
      if (JSON.stringify(prev.present) === JSON.stringify(newPresent)) return prev;
      
      return {
        past: [...prev.past, prev.present].slice(-50),
        present: newPresent,
        future: []
      };
    });
  }, []);

  const undo = useCallback(() => {
    setState(prev => {
      if (prev.past.length === 0) return prev;
      
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState(prev => {
      if (prev.future.length === 0) return prev;
      
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const reset = useCallback((initialState: T) => {
    setState({
      past: [],
      present: initialState,
      future: []
    });
  }, []);

  return { 
    state: state.present, 
    push, 
    undo, 
    redo, 
    reset,
    canUndo: state.past.length > 0, 
    canRedo: state.future.length > 0 
  };
}
