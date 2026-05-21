import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

export type HighlightColor = "yellow" | "green" | "blue" | "pink" | "purple";

export type HighlightedVerse = {
  id: string;
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  color: HighlightColor;
  testament: "OT" | "NT";
  bookOrder: number;
};

type HighlightsContextType = {
  highlights: HighlightedVerse[];
  addHighlight: (v: HighlightedVerse) => void;
  removeHighlight: (id: string) => void;
  getHighlight: (bookCode: string, chapter: number, verse: number) => HighlightedVerse | undefined;
};

const STORAGE_KEY = "@bible_highlights";

const HighlightsContext = createContext<HighlightsContextType>({
  highlights: [],
  addHighlight: () => {},
  removeHighlight: () => {},
  getHighlight: () => undefined,
});

export function HighlightsProvider({ children }: { children: React.ReactNode }) {
  const [highlights, setHighlights] = useState<HighlightedVerse[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val) {
        try { setHighlights(JSON.parse(val)); } catch {}
      }
    });
  }, []);

  const persist = useCallback((items: HighlightedVerse[]) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, []);

  const addHighlight = useCallback((v: HighlightedVerse) => {
    setHighlights((prev) => {
      const next = [v, ...prev.filter((h) => h.id !== v.id)];
      persist(next);
      return next;
    });
  }, [persist]);

  const removeHighlight = useCallback((id: string) => {
    setHighlights((prev) => {
      const next = prev.filter((h) => h.id !== id);
      persist(next);
      return next;
    });
  }, [persist]);

  const getHighlight = useCallback((bookCode: string, chapter: number, verse: number) => {
    const id = `${bookCode}_${chapter}_${verse}`;
    return highlights.find((h) => h.id === id);
  }, [highlights]);

  return (
    <HighlightsContext.Provider value={{ highlights, addHighlight, removeHighlight, getHighlight }}>
      {children}
    </HighlightsContext.Provider>
  );
}

export function useHighlights() {
  return useContext(HighlightsContext);
}