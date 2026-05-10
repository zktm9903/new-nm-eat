"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ANIMALS } from "@/hooks/use-selected-animals";

type AnimalKey = (typeof ANIMALS)[number]["key"];

const STORAGE_KEY = "nm-eat-selected-animals";
const DEFAULT_SELECTED: AnimalKey[] = ["cat", "dog", "guinea-pig"];

interface SelectedAnimalsContextValue {
  selectedAnimals: AnimalKey[];
  selectedSrcs: string[];
  hasChosen: boolean;
  toggleAnimal: (key: AnimalKey) => void;
}

const SelectedAnimalsContext = createContext<SelectedAnimalsContextValue | null>(null);

export function SelectedAnimalsProvider({ children }: { children: React.ReactNode }) {
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalKey[]>(DEFAULT_SELECTED);
  const [hasChosen, setHasChosen] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SELECTED));
      setHasChosen(false);
      return;
    }
    setHasChosen(true);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AnimalKey[];
        const valid = parsed.filter((k) => ANIMALS.some((a) => a.key === k));
        if (valid.length > 0) setSelectedAnimals(valid);
      } catch {
        // ignore
      }
    }
  }, []);

  const toggleAnimal = (key: AnimalKey) => {
    setSelectedAnimals((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev;
        const next = prev.filter((k) => k !== key);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      const next = [...prev, key];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setHasChosen(true);
      return next;
    });
  };

  const selectedSrcs = ANIMALS.filter((a) => selectedAnimals.includes(a.key)).map((a) => a.src);

  return (
    <SelectedAnimalsContext.Provider value={{ selectedAnimals, selectedSrcs, hasChosen, toggleAnimal }}>
      {children}
    </SelectedAnimalsContext.Provider>
  );
}

export function useSelectedAnimalsContext() {
  const ctx = useContext(SelectedAnimalsContext);
  if (!ctx) throw new Error("useSelectedAnimalsContext must be used within SelectedAnimalsProvider");
  return ctx;
}
