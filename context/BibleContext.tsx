import React, { createContext, useCallback, useContext, useMemo } from "react";
import { BIBLE_BOOKS } from "@/constants/bible-books";
import { thematicSearch } from "@/constants/thematic-search";
import { useSettings } from "./SettingsContext";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const bibleData: Record<string, Record<string, Record<string, string>>> = require("@/assets/bibles/fr.json");

export type SearchResult = {
  bookCode: string;
  bookName: string;
  chapter: number;
  verse: number;
  text: string;
  testament: "OT" | "NT";
  bookOrder: number;
};

type BibleContextType = {
  books: typeof BIBLE_BOOKS;
  getBookName: (bookCode: string) => string;
  getChapterVerses: (bookCode: string, chapter: number) => Record<number, string>;
  searchVerses: (query: string) => SearchResult[];
};

const BibleContext = createContext<BibleContextType>({
  books: BIBLE_BOOKS,
  getBookName: () => "",
  getChapterVerses: () => ({}),
  searchVerses: () => [],
});

export function BibleProvider({ children }: { children: React.ReactNode }) {
  const { language } = useSettings();

  const getBookName = useCallback((code: string): string => {
    const book = BIBLE_BOOKS.find((b) => b.code === code);
    return book ? book.name[language] : code;
  }, [language]);

  const getChapterVerses = useCallback((bookCode: string, chapter: number): Record<number, string> => {
    const chapterData = bibleData[bookCode]?.[String(chapter)];
    if (!chapterData) return {};
    const result: Record<number, string> = {};
    for (const [v, text] of Object.entries(chapterData)) {
      result[parseInt(v)] = text;
    }
    return result;
  }, []);

  const searchVerses = useCallback((query: string): SearchResult[] => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const results: SearchResult[] = [];

    const refMatch = trimmed.match(/^(\d?\s*[a-zA-Z\u00C0-\u017E]+(?:\s+[a-zA-Z\u00C0-\u017E]+)?)\s+(\d+)[:\s,](\d+)$/i);
    if (refMatch) {
      const bookPart = refMatch[1]!.trim().toLowerCase();
      const chNum = parseInt(refMatch[2]!);
      const vNum = parseInt(refMatch[3]!);

      const book = BIBLE_BOOKS.find((b) =>
        b.name.en.toLowerCase().startsWith(bookPart) ||
        b.name.fr.toLowerCase().startsWith(bookPart) ||
        b.name.pt.toLowerCase().startsWith(bookPart) ||
        b.abbr.en.toLowerCase() === bookPart ||
        b.abbr.fr.toLowerCase() === bookPart ||
        b.abbr.pt.toLowerCase() === bookPart ||
        b.code === bookPart
      );
      if (book) {
        const text = bibleData[book.code]?.[String(chNum)]?.[String(vNum)];
        if (text) {
          return [{
            bookCode: book.code,
            bookName: book.name[language],
            chapter: chNum,
            verse: vNum,
            text,
            testament: book.testament,
            bookOrder: book.id,
          }];
        }
      }
    }

    const keywords = trimmed.length > 20
      ? thematicSearch(trimmed)
      : trimmed.toLowerCase().split(/\s+/).filter((w) => w.length > 2);

    for (const [bookCode, chapters] of Object.entries(bibleData)) {
      const book = BIBLE_BOOKS.find((b) => b.code === bookCode);
      if (!book) continue;
      for (const [chStr, verses] of Object.entries(chapters)) {
        const ch = parseInt(chStr);
        for (const [vStr, text] of Object.entries(verses)) {
          const v = parseInt(vStr);
          const lowerText = text.toLowerCase();
          const matched = keywords.some((kw) => lowerText.includes(kw.toLowerCase()));
          if (matched) {
            results.push({
              bookCode,
              bookName: book.name[language],
              chapter: ch,
              verse: v,
              text,
              testament: book.testament,
              bookOrder: book.id,
            });
          }
        }
      }
    }

    return results.slice(0, 50);
  }, [language]);

  const value = useMemo(() => ({
    books: BIBLE_BOOKS,
    getBookName,
    getChapterVerses,
    searchVerses,
  }), [getBookName, getChapterVerses, searchVerses]);

  return <BibleContext.Provider value={value}>{children}</BibleContext.Provider>;
}

export function useBible() {
  return useContext(BibleContext);
}