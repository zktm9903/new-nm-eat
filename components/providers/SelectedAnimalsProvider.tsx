"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { ANIMALS } from "@/hooks/use-selected-animals";

type AnimalKey = (typeof ANIMALS)[number]["key"];

export const STORAGE_KEY = "nm-eat-selected-animals";
export const DEFAULT_SELECTED: AnimalKey[] = ["cat", "dog", "guinea-pig"];

interface SelectedAnimalsContextValue {
  selectedAnimals: AnimalKey[];
  selectedSrcs: string[];
  toggleAnimal: (key: AnimalKey) => void;
}

const SelectedAnimalsContext = createContext<SelectedAnimalsContextValue | null>(null);

export function SelectedAnimalsProvider({ children }: { children: React.ReactNode }) {
  const [selectedAnimals, setSelectedAnimals] = useState<AnimalKey[]>(DEFAULT_SELECTED);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored) as AnimalKey[];
      const valid = parsed.filter((k) => ANIMALS.some((a) => a.key === k));
      if (valid.length > 0) setSelectedAnimals(valid);
    } catch {
      // ignore
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
      return next;
    });
  };

  const selectedSrcs = ANIMALS.filter((a) => selectedAnimals.includes(a.key)).map((a) => a.src);

  return (
    <SelectedAnimalsContext.Provider value={{ selectedAnimals, selectedSrcs, toggleAnimal }}>
      {children}
    </SelectedAnimalsContext.Provider>
  );
}

export function useSelectedAnimalsContext() {
  const ctx = useContext(SelectedAnimalsContext);
  if (!ctx) throw new Error("useSelectedAnimalsContext must be used within SelectedAnimalsProvider");
  return ctx;
}
