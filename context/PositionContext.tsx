import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";

type LastPosition = {
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
} | null;

type PositionContextType = {
  isLoaded: boolean;
  lastPosition: LastPosition;
  lastChapterPerBook: Record<string, number>;
  savePosition: (bookCode: string, bookName: string, chapter: number, verse: number) => void;
  getLastChapter: (bookCode: string) => number | null;
};

const POSITION_KEY = "@bible_last_position";
const CHAPTER_PER_BOOK_KEY = "@bible_last_chapter_per_book";

const PositionContext = createContext<PositionContextType>({
  isLoaded: false,
  lastPosition: null,
  lastChapterPerBook: {},
  savePosition: () => {},
  getLastChapter: () => null,
});

export function PositionProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [lastPosition, setLastPosition] = useState<LastPosition>(null);
  const [lastChapterPerBook, setLastChapterPerBook] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(POSITION_KEY),
      AsyncStorage.getItem(CHAPTER_PER_BOOK_KEY),
    ]).then(([pos, chapters]) => {
      if (pos) {
        try { setLastPosition(JSON.parse(pos)); } catch {}
      }
      if (chapters) {
        try { setLastChapterPerBook(JSON.parse(chapters)); } catch {}
      }
      setIsLoaded(true);
    });
  }, []);

  const savePosition = useCallback((bookCode: string, bookName: string, chapter: number, verse: number) => {
    const pos: LastPosition = { bookCode, bookName, chapter, verse };
    setLastPosition(pos);
    AsyncStorage.setItem(POSITION_KEY, JSON.stringify(pos));

    setLastChapterPerBook((prev) => {
      const next = { ...prev, [bookCode]: chapter };
      AsyncStorage.setItem(CHAPTER_PER_BOOK_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const getLastChapter = useCallback((bookCode: string) => {
    return lastChapterPerBook[bookCode] ?? null;
  }, [lastChapterPerBook]);

  return (
    <PositionContext.Provider value={{ isLoaded, lastPosition, lastChapterPerBook, savePosition, getLastChapter }}>
      {children}
    </PositionContext.Provider>
  );
}

export function usePosition() {
  return useContext(PositionContext);
}