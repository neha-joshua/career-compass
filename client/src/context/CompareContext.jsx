import { createContext, useContext, useState } from 'react';

const CompareContext = createContext(null);

export function CompareProvider({ children }) {
  const [compareList, setCompareList] = useState([]); // max 3 careers

  const addToCompare = (career) => {
    setCompareList(prev => {
      if (prev.find(c => c.id === career.id)) return prev;
      if (prev.length >= 3) return prev;
      return [...prev, career];
    });
  };

  const removeFromCompare = (careerId) => {
    setCompareList(prev => prev.filter(c => c.id !== careerId));
  };

  const isInCompare = (careerId) => compareList.some(c => c.id === careerId);

  const clearCompare = () => setCompareList([]);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, isInCompare, clearCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
}
